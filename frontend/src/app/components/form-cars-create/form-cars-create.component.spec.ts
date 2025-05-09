import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCarsCreateComponent } from './form-cars-create.component';

describe('FormCarsCreateComponent', () => {
  let component: FormCarsCreateComponent;
  let fixture: ComponentFixture<FormCarsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCarsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCarsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
