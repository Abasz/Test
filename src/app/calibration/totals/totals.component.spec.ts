/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TotalsComponent } from "./totals.component";

describe("TotalsComponent", (): void => {
    let component: TotalsComponent;
    let fixture: ComponentFixture<TotalsComponent>;

    beforeEach((): void => {
        TestBed.configureTestingModule({
            declarations: [TotalsComponent],
        }).compileComponents();
    });

    beforeEach((): void => {
        fixture = TestBed.createComponent(TotalsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", (): void => {
        expect(component).toBeTruthy();
    });
});
