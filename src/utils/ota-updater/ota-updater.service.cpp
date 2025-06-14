#include <array>
#include <span>
#include <utility>

#include "ArduinoLog.h"
#include "Update.h"

#include "globals.h"

#include "./ota-updater.service.h"

using std::span;

OtaUpdaterService::OtaUpdaterService()
{
}

bool OtaUpdaterService::isUpdating() const
{
    return Update.isRunning();
}

void OtaUpdaterService::onData(const NimBLEAttValue &data, const unsigned short newMtu)
{
    if (otaTxCharacteristic == nullptr)
    {
        Log.warningln("OTA BLE Service has not been started");

        return;
    }

    Log.verboseln("OTA onData message length: %d", data.size());

    if (data.size() < 1)
    {
        handleError(OtaResponseOpCodes::IncorrectFormat);

        return;
    }

    Log.verboseln("OTA onData request code: %d", data[0]);

    switch (data[0])
    {
    case std::to_underlying(OtaRequestOpCodes::Begin):
    {
        setMtu(newMtu);
        span<const unsigned char>::iterator iterator(data.data());
        handleBegin(span<const unsigned char>(iterator + 1, data.size() - 1));
    }
    break;
    case std::to_underlying(OtaRequestOpCodes::Package):
    {
        span<const unsigned char>::iterator iterator(data.data());
        handlePackage(span<const unsigned char>(iterator + 1, data.size() - 1));
    }
    break;
    case std::to_underlying(OtaRequestOpCodes::End):
    {
        span<const unsigned char>::iterator iterator(data.data());
        handleEnd(span<const unsigned char>(iterator + 1, data.size() - 1));
    }
    break;
    case std::to_underlying(OtaRequestOpCodes::Abort):
        terminateUpload();
        send(std::to_underlying(OtaResponseOpCodes::Ok));
        break;
    default:
        handleError(OtaResponseOpCodes::IncorrectFormat);
        break;
    }
}

void OtaUpdaterService::begin(NimBLECharacteristic *newOtaTxCharacteristic)
{
    otaTxCharacteristic = newOtaTxCharacteristic;
}

void OtaUpdaterService::handleBegin(const span<const unsigned char> &payload)
{
    if (isUpdating())
    {
        terminateUpload();
    }

    if (payload.size() != sizeof(unsigned int))
    {
        handleError(OtaResponseOpCodes::IncorrectFormat);

        return;
    }

    const unsigned int firmwareLength = payload[0] | payload[1] << 8 | payload[2] << 16 | payload[3] << 24;

    Log.infoln("Begin OTA firmware update (size: %d)", firmwareLength);

    if (!Update.begin(firmwareLength))
    {
        const auto otaErrorCode = Update.getError();
        Log.warningln("OTA begin error: %s", Update.errorString());

        terminateUpload();

        switch (otaErrorCode)
        {
        case UPDATE_ERROR_SIZE:
            handleError(OtaResponseOpCodes::IncorrectFirmwareSize);
            return;
        case UPDATE_ERROR_NO_PARTITION:
            handleError(OtaResponseOpCodes::InternalStorageError);
            return;
        default:
            handleError(OtaResponseOpCodes::NotOk);
            return;
        }
    }

    const unsigned short perPackageDataSize = mtu - blePackageHeaderSize - sizeof(OtaRequestOpCodes);
    unsigned int bufferSize = perPackageDataSize * bufferCapacity;

    Log.verboseln("OTA MTU size: %d; Attribute size: %d; buffer size: %d", mtu, perPackageDataSize, bufferSize);

    const auto length = 9U;
    std::array<unsigned char, length> response = {
        std::to_underlying(OtaResponseOpCodes::Ok),
        static_cast<unsigned char>(perPackageDataSize),
        static_cast<unsigned char>(perPackageDataSize >> 8),
        static_cast<unsigned char>(perPackageDataSize >> 16),
        static_cast<unsigned char>(perPackageDataSize >> 24),

        static_cast<unsigned char>(bufferSize),
        static_cast<unsigned char>(bufferSize >> 8),
        static_cast<unsigned char>(bufferSize >> 16),
        static_cast<unsigned char>(bufferSize >> 24),
    };

    send(response.data(), sizeof(response));

    Log.verboseln("Detach rotation interrupt pin");
    detachRotationInterrupt();
}

void OtaUpdaterService::handlePackage(const span<const unsigned char> &payload)
{
    if (!isUpdating())
    {
        handleError(OtaResponseOpCodes::NotOk);

        return;
    }

    Log.verboseln("OTA current buffer size: %d", buffer.size());

    unsigned short perPackageDataSize = mtu - blePackageHeaderSize - sizeof(OtaRequestOpCodes);
    unsigned int bufferSize = perPackageDataSize * bufferCapacity;

    buffer.insert(cend(buffer), cbegin(payload), cend(payload));

    if (buffer.size() >= bufferSize)
    {
        flushBuffer();

        if (Update.hasError())
        {
            Log.warningln("OTA error while writing to Update Partition: %s", Update.errorString());
            Update.abort();

            handleError(Update.getError() == UPDATE_ERROR_MAGIC_BYTE ? OtaResponseOpCodes::ChecksumError : OtaResponseOpCodes::InternalStorageError);

            return;
        }

        send(std::to_underlying(OtaResponseOpCodes::Ok));

        Log.verboseln("OTA progress: %d/%d, remaining: %d", Update.size(), Update.progress(), Update.remaining());
    }
}

void OtaUpdaterService::handleEnd(const span<const unsigned char> &payload)
{
    if (!isUpdating())
    {
        handleError(OtaResponseOpCodes::NotOk);

        return;
    }

    if (payload.size() != ESP_ROM_MD5_DIGEST_LEN)
    {
        handleError(OtaResponseOpCodes::IncorrectFormat);

        return;
    }

    const std::string hexChars = "0123456789abcdef";
    std::string md5Hex;

    for (size_t i = 0; i < ESP_ROM_MD5_DIGEST_LEN; ++i)
    {
        auto byte = payload[i];
        md5Hex.push_back(hexChars[byte >> 4]);
        md5Hex.push_back(hexChars[byte & 0x0F]);
    }

    Log.verboseln("OTA setting MD5 hash to %s", md5Hex.c_str());
    Update.setMD5(md5Hex.c_str());

    flushBuffer();

    handleInstall();
}

void OtaUpdaterService::handleInstall()
{
    if (!Update.end(false))
    {

        Log.warningln("OTA install error: %s", Update.errorString());

        handleError(Update.getError() == UPDATE_ERROR_MD5 ? OtaResponseOpCodes::ChecksumError : OtaResponseOpCodes::NotOk);

        return;
    }

    send(std::to_underlying(OtaResponseOpCodes::Ok));

    Log.infoln("OTA installed, restarting device...");

    restartWithDelay(500);
}

void OtaUpdaterService::handleError(OtaResponseOpCodes errorCode)
{
    send(std::to_underlying(errorCode));
}

void OtaUpdaterService::send(unsigned char head)
{
    send(&head, 1);
}

void OtaUpdaterService::send(const unsigned char *data, size_t messageLength)
{
    otaTxCharacteristic->setValue(data, messageLength);
    otaTxCharacteristic->notify();
}

void OtaUpdaterService::setMtu(const unsigned short newMtu = 512)
{
    if (isUpdating())
    {
        return;
    }

    mtu = newMtu;
}

void OtaUpdaterService::terminateUpload()
{
    Log.infoln("Terminating OTA Update");

    buffer.clear();
    Update.abort();

    attachRotationInterrupt();
}

void OtaUpdaterService::flushBuffer()
{
    while (!buffer.empty())
    {
        auto element = buffer.front();
        Update.write(&element, 1);
        buffer.pop_front();
    }
}