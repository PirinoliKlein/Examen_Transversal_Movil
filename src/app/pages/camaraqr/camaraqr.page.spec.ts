import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CamaraqrPage } from './camaraqr.page';

describe('CamaraqrPage', () => {
  let component: CamaraqrPage;
  let fixture: ComponentFixture<CamaraqrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CamaraqrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
