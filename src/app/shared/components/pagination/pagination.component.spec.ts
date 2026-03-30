import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent, buildPagination } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentPage', 6);
    fixture.componentRef.setInput('totalPages', 42);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the requested page when changing page', () => {
    const emitSpy = vi.spyOn(component.pageChange, 'emit');

    component.changePage(7);

    expect(emitSpy).toHaveBeenCalledWith(7);
  });
});

describe('buildPagination', () => {
  it('should return all pages when the total is small', () => {
    expect(buildPagination(1, 4)).toEqual([
      { type: 'page', value: 1 },
      { type: 'page', value: 2 },
      { type: 'page', value: 3 },
      { type: 'page', value: 4 },
    ]);
  });

  it('should show the opening block and the last page when starting', () => {
    expect(buildPagination(1, 42)).toEqual([
      { type: 'page', value: 1 },
      { type: 'page', value: 2 },
      { type: 'page', value: 3 },
      { type: 'ellipsis' },
      { type: 'page', value: 42 },
    ]);
  });

  it('should show both ellipses around the current page in the middle', () => {
    expect(buildPagination(6, 42)).toEqual([
      { type: 'page', value: 1 },
      { type: 'ellipsis' },
      { type: 'page', value: 5 },
      { type: 'page', value: 6 },
      { type: 'page', value: 7 },
      { type: 'ellipsis' },
      { type: 'page', value: 42 },
    ]);
  });

  it('should show the closing block when near the end', () => {
    expect(buildPagination(41, 42)).toEqual([
      { type: 'page', value: 1 },
      { type: 'ellipsis' },
      { type: 'page', value: 40 },
      { type: 'page', value: 41 },
      { type: 'page', value: 42 },
    ]);
  });
});
