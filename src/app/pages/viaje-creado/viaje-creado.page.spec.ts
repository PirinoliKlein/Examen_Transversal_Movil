import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajeCreadoPage } from './viaje-creado.page';

describe('ViajeCreadoPage', () => {
  let component: ViajeCreadoPage;
  let fixture: ComponentFixture<ViajeCreadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajeCreadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
