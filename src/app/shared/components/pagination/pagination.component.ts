import { Component, computed, input, output } from '@angular/core';

export interface PaginationItem {
  type: 'page' | 'ellipsis';
  value?: number;
}

export function buildPagination(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 0) {
    return [];
  }

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => ({
      type: 'page',
      value: index + 1,
    }));
  }

  const visiblePages = new Set<number>([1, totalPages]);

  if (safeCurrentPage <= 3) {
    [1, 2, 3].forEach((page) => visiblePages.add(page));
  } else if (safeCurrentPage >= totalPages - 2) {
    [totalPages - 2, totalPages - 1, totalPages].forEach((page) => visiblePages.add(page));
  } else {
    [safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1].forEach((page) =>
      visiblePages.add(page),
    );
  }

  const sortedPages = [...visiblePages].sort((left, right) => left - right);
  const items: PaginationItem[] = [];

  for (const page of sortedPages) {
    const previousPage = items.at(-1);

    if (previousPage?.type === 'page' && previousPage.value) {
      const gap = page - previousPage.value;

      if (gap === 2) {
        items.push({ type: 'page', value: previousPage.value + 1 });
      } else if (gap > 2) {
        items.push({ type: 'ellipsis' });
      }
    }

    items.push({ type: 'page', value: page });
  }

  return items;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly ariaLabel = input('Pagination');

  readonly pageChange = output<number>();

  readonly shouldRender = computed(() => this.totalPages() > 1);
  readonly paginationItems = computed(() =>
    buildPagination(this.currentPage(), this.totalPages()),
  );
  readonly hasPreviousPage = computed(() => this.currentPage() > 1);
  readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());

  changePage(targetPage: number): void {
    const safeTargetPage = Math.min(Math.max(targetPage, 1), this.totalPages());

    if (safeTargetPage !== this.currentPage()) {
      this.pageChange.emit(safeTargetPage);
    }
  }

  trackPaginationItem(index: number, item: PaginationItem): string {
    return item.type === 'ellipsis' ? `ellipsis-${index}` : `page-${item.value}`;
  }
}
