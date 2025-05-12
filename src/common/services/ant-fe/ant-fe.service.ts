import { Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { timer } from "rxjs";
import { Messages, USBDriver } from "web-ant-plus";

import { ICalculatedMetrics } from "../../common.interfaces";

import { AntHeartRateService } from "./../heart-rate/ant-heart-rate.service";

interface ISessionData {
    accumulatedStrokes: number;
    accumulatedDistance: number;
    accumulatedTime: number;
    accumulatedPower: number;
    cycleLinearVelocity: number;
    strokeRate: number;
    instantaneousPower: number;
    distancePerStroke: number;
    fitnessEquipmentState: number;
}

const fitnessEquipmentStates = {
    inUse: 3 << 0x04,
};

const fitnessEquipmentCapabilities = {
    hrDataSourceInvalid: 0x00 << 0,
    distanceTraveledEnabled: 0x01 << 2,
    realSpeed: 0x00 << 3,
};

const rowingMachineCapabilities = {
    accumulatedStrokesEnabled: 0x01 << 0,
};

const feCapabilitiesBitField =
    fitnessEquipmentCapabilities.hrDataSourceInvalid |
    fitnessEquipmentCapabilities.distanceTraveledEnabled |
    fitnessEquipmentCapabilities.realSpeed;
const rowingCapabilitiesBitField = rowingMachineCapabilities.accumulatedStrokesEnabled;

@Injectable({
    providedIn: "root",
})
export class AntFeService {
    private antStick: USBDriver | undefined;

    private broadcastPeriod: number = 8192; // 8192/32768 ~4hz
    private broadcastInterval: number = (this.broadcastPeriod / 32768) * 1000; // millisecond
    private channel: number = 1;
    private deviceId: number = 431234567 & 0xffff;
    private deviceNumber: number = 1;
    private deviceType: number = 0x11; // ant FE-C device
    private rfChannel: number = 57; // 2457 MHz
    private dataPageCount: number = 0;
    private commonPageCount: number = 0;
    // private timer: number;

    private sessionData: ISessionData = {
        accumulatedStrokes: 0,
        accumulatedDistance: 0,
        accumulatedTime: 0,
        accumulatedPower: 0,
        cycleLinearVelocity: 0,
        strokeRate: 0,
        instantaneousPower: 0,
        distancePerStroke: 0,
        fitnessEquipmentState: fitnessEquipmentStates.inUse,
    };

    constructor(private antHeartRateService: AntHeartRateService) {
        timer(0, this.broadcastInterval)
            .pipe(takeUntilDestroyed())
            .subscribe((): void => this.onBroadcastInterval());
    }

    notifyMetrics(metrics: ICalculatedMetrics): void {
        this.sessionData = {
            ...this.sessionData,
            accumulatedDistance: (metrics.distance / 100) & 0xff,
            accumulatedStrokes: metrics.strokeCount & 0xff,
            accumulatedTime: (Date.now() - metrics.activityStartTime.getTime()) & 0xff,
            cycleLinearVelocity: Math.round(metrics.speed * 1000),
            strokeRate: Math.round(metrics.strokeRate) & 0xff,
            instantaneousPower: Math.round(metrics.avgStrokePower) & 0xffff,
            distancePerStroke: Math.round(metrics.distPerStroke * 100),
        };
    }

    onBroadcastInterval(): void {
        if (this.antStick === undefined) {
            if (!this.antHeartRateService.getAntStickConnected()) {
                return;
            }
            const stick = this.antHeartRateService.getAntStick();

            if (stick === undefined) {
                return;
            }

            this.antStick = stick;

            const messages = [
                Messages.assignChannel(this.channel, "transmit"),
                Messages.setDevice(this.channel, this.deviceId, this.deviceType, this.deviceNumber),
                Messages.setFrequency(this.channel, this.rfChannel),
                Messages.setPeriod(this.channel, this.broadcastPeriod),
                Messages.openChannel(this.channel),
            ];

            console.info(`ANT+ FE server start [deviceId=${this.deviceId} channel=${this.channel}]`);
            for (const message of messages) {
                this.antStick.write(message);
            }
        }

        this.dataPageCount++;
        let data: Array<number> = [];

        switch (true) {
            case this.dataPageCount === 65 || this.dataPageCount === 66:
                if (this.commonPageCount % 2 === 0) {
                    // 0x50 - Common Page for Manufacturers Identification (approx twice a minute)
                    data = [
                        0x50, // page 80
                        0xff, // reserved
                        0xff, // reserved
                        907 & 0xff, // hardware Revision
                        ...Messages.intToLEHexArray(40, 2), // manufacturer ID (value 255 = Development ID, value 40 = concept2)
                        0x0001, // model Number
                    ];
                }
                if (this.commonPageCount % 2 === 1) {
                    // 0x51 - Common Page for Product Information (minute)
                    data = [
                        0x51, // page 81
                        0xff, // reserved
                        907, // sW Revision (Supplemental)
                        210, // sW Version
                        ...Messages.intToLEHexArray(121212, 4), // serial Number (None)
                    ];
                }

                if (this.dataPageCount === 66) {
                    this.commonPageCount++;
                    this.dataPageCount = 0;
                }
                break;
            case this.dataPageCount % 8 === 4: // 0x11 - General Settings Page (once a second)
            case this.dataPageCount % 8 === 7:
                data = [
                    0x11, // page 17
                    0xff, // reserved
                    0xff, // reserved
                    ...Messages.intToLEHexArray(this.sessionData.distancePerStroke, 1), // stroke Length in 0.01 m
                    0x7fff, // incline (Not Used)
                    0x00, // resistance (DF may be reported if conversion to the % is worked out (value in % with a resolution of 0.5%).
                    ...Messages.intToLEHexArray(feCapabilitiesBitField, 1),
                ];
                // console.trace(
                //     `Page 17 Data Sent. Event=${this.dataPageCount}. Stroke Length=${this.sessionData.distancePerStroke}.`,
                // );
                // console.trace(`Hex Stroke Length=0x${this.sessionData.distancePerStroke.toString(16)}.`);
                break;
            case this.dataPageCount % 8 === 3: // 0x16 - Specific Rower Data (once a second)
            case this.dataPageCount % 8 === 0:
                data = [
                    0x16, // page 22
                    0xff, // reserved
                    0xff, // reserved
                    ...Messages.intToLEHexArray(this.sessionData.accumulatedStrokes, 1), // stroke Count
                    ...Messages.intToLEHexArray(this.sessionData.strokeRate, 1), // cadence / Stroke Rate
                    ...Messages.intToLEHexArray(this.sessionData.instantaneousPower, 2), // instant Power (2 bytes)
                    ...Messages.intToLEHexArray(
                        this.sessionData.fitnessEquipmentState + rowingCapabilitiesBitField,
                        1,
                    ),
                ];
                // console.trace(
                //     `Page 22 Data Sent. Event=${this.dataPageCount}. Strokes=${this.sessionData.accumulatedStrokes}. Stroke Rate=${this.sessionData.strokeRate}. Power=${this.sessionData.instantaneousPower}`,
                // );
                // console.trace(
                //     `Hex Strokes=0x${this.sessionData.accumulatedStrokes.toString(16)}. Hex Stroke Rate=0x${this.sessionData.strokeRate.toString(16)}. Hex Power=0x${Messages.intToLEHexArray(this.sessionData.instantaneousPower, 2)}.`,
                // );
                break;
            case this.dataPageCount % 4 === 2: // 0x10 - General FE Data (twice a second)
            default:
                data = [
                    0x10, // page 16
                    0x16, // rowing Machine (22)
                    ...Messages.intToLEHexArray(this.sessionData.accumulatedTime, 1), // elapsed time
                    ...Messages.intToLEHexArray(this.sessionData.accumulatedDistance, 1), // distance travelled
                    ...Messages.intToLEHexArray(this.sessionData.cycleLinearVelocity, 2), // speed in 0.001 m/s
                    0xff, // heart rate not being sent
                    ...Messages.intToLEHexArray(
                        this.sessionData.fitnessEquipmentState + feCapabilitiesBitField,
                        1,
                    ),
                ];
                // console.trace(
                //     `Page 16 Data Sent. Event=${this.dataPageCount}. Time=${this.sessionData.accumulatedTime}. Distance=${this.sessionData.accumulatedDistance}. Speed=${this.sessionData.cycleLinearVelocity}.`,
                // );
                // console.trace(
                //     `Hex Time=0x${this.sessionData.accumulatedTime.toString(16)}. Hex Distance=0x${this.sessionData.accumulatedDistance.toString(16)}. Hex Speed=0x${Messages.intToLEHexArray(this.sessionData.cycleLinearVelocity, 2)}.`,
                // );
                break;
        }

        // const message = Messages.buildMessage(
        //     [this.channel, ...data],
        //     Constants.MESSAGE_CHANNEL_BROADCAST_DATA,
        // );
        const message = Messages.broadcastData(this.channel, data);
        this.antStick.write(message);
    }
}
