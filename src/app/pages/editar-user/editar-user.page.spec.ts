import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUserPage } from './editar-user.page';

describe('EditarUserPage', () => {
  let component: EditUserPage;
  let fixture: ComponentFixture<EditUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
