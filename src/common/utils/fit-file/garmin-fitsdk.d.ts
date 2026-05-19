/* eslint-disable max-classes-per-file */
declare module "@garmin/fitsdk" {
    export interface BaseFitField {
        name: string;
        type: string;
        base_type?: string;
        array?: true | false | undefined;
        scale: number | Array<number>;
        offset: number | Array<number>;
        units: string | Array<string>;
        bits: Array<number>;
        components: Array<number | string>;
        hasComponents: boolean;
    }

    export interface SubField extends BaseFitField {
        map: Array<{ name: string; value: number }>;
    }

    export interface FitField extends BaseFitField {
        num: number;
        isAccumulated: boolean;
        subFields: Array<SubField>;
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

    export const Utils: {
        convertDateToDateTime(date: Date): number;
        convertDateTimeToDate(datetime: number): Date;
    };
}
