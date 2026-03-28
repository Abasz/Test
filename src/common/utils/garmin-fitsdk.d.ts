/* eslint-disable max-classes-per-file */
declare module "@garmin/fitsdk" {
    export class Encoder {
        constructor(options?: { fieldDescriptions?: Record<number, unknown> });
        close(): Uint8Array;
        writeMesg(mesg: { mesgNum: number; [key: string]: unknown }): this;
        onMesg(mesgNum: number, mesg: Record<string, unknown>): this;
    }

    export class Stream {
        static fromByteArray(data: Array<number>): Stream;
        static fromArrayBuffer(arrayBuffer: ArrayBufferLike): Stream;
        constructor(buffer: ArrayBufferLike);
    }

    export class Decoder {
        constructor(stream: Stream);
        isFIT(): boolean;
        checkIntegrity(): boolean;
        read(options?: {
            mesgListener?: (mesgNum: number, message: unknown) => void;
            expandSubFields?: boolean;
            expandComponents?: boolean;
            applyScaleAndOffset?: boolean;
            convertTypesToStrings?: boolean;
            convertDateTimesToDates?: boolean;
            includeUnknownData?: boolean;
            mergeHeartRates?: boolean;
        }): {
            messages: Record<string, Array<Record<string, unknown>>>;
            errors: Array<unknown>;
        };
    }

    export const Profile: {
        MesgNum: Record<string, number>;
    };

    export const Utils: {
        FIT_EPOCH_MS: number;
        convertDateToDateTime(date: Date): number;
        convertDateTimeToDate(datetime: number): Date;
    };
}
