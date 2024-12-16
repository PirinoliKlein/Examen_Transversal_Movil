import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarViajesPage } from './editar-viajes.page';

describe('EditarViajesPage', () => {
  let component: EditarViajesPage;
  let fixture: ComponentFixture<EditarViajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
