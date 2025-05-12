/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DeltaTimesComponent } from "./delta-times.component";

describe("DeltaTimesComponent", (): void => {
    let component: DeltaTimesComponent;
    let fixture: ComponentFixture<DeltaTimesComponent>;

    beforeEach((): void => {
        TestBed.configureTestingModule({
            declarations: [DeltaTimesComponent],
        }).compileComponents();
    });

    beforeEach((): void => {
        fixture = TestBed.createComponent(DeltaTimesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", (): void => {
        expect(component).toBeTruthy();
    });
});
