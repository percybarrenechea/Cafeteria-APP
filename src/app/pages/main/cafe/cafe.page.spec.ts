import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CafePage } from './cafe.page';

describe('CafePage', () => {
  let component: CafePage;
  let fixture: ComponentFixture<CafePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CafePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
