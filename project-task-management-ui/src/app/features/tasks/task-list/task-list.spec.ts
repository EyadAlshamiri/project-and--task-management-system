import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListList } from './list-list';

describe('ListList', () => {
  let component: ListList;
  let fixture: ComponentFixture<ListList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListList],
    }).compileComponents();

    fixture = TestBed.createComponent(ListList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
