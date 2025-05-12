/* tslint:disable:no-unused-variable */

import { inject, TestBed } from "@angular/core/testing";

import { AntFeService } from "./ant-fe.service";

describe("Service: AntFe", (): void => {
    beforeEach((): void => {
        TestBed.configureTestingModule({
            providers: [AntFeService],
        });
    });

    it("should ...", inject([AntFeService], (service: AntFeService): void => {
        expect(service).toBeTruthy();
    }));
});
