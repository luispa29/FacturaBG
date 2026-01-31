import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';

export interface TableColumn {
    field: string;
    header: string;
    sortable?: boolean;
    width?: string;
    template?: TemplateRef<any>;
}

export interface PaginationData {
    page: number;
    pageSize: number;
    totalRecords: number;
}

export interface PageEvent {
    page: number;
    pageSize: number;
}

@Component({
    selector: 'app-table',
    imports: [CommonModule, Button],
    templateUrl: './table.html',
    styleUrl: './table.css'
})
export class Table {
    @Input() columns: TableColumn[] = [];
    @Input() data: any[] = [];
    @Input() loading: boolean = false;
    @Input() pagination: PaginationData = {
        page: 1,
        pageSize: 10,
        totalRecords: 0
    };
    @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    @Input() emptyMessage: string = 'No se encontraron registros';
    @Input() showHeader: boolean = true;
    @Input() striped: boolean = true;
    @Input() hoverable: boolean = true;

    @Output() onPageChange = new EventEmitter<PageEvent>();
    @Output() onSort = new EventEmitter<{ field: string; order: 'asc' | 'desc' }>();
    @Output() onRowClick = new EventEmitter<any>();

    sortField: string = '';
    sortOrder: 'asc' | 'desc' = 'asc';

    get totalPages(): number {
        return Math.ceil(this.pagination.totalRecords / this.pagination.pageSize);
    }

    get startRecord(): number {
        return (this.pagination.page - 1) * this.pagination.pageSize + 1;
    }

    get endRecord(): number {
        const end = this.pagination.page * this.pagination.pageSize;
        return end > this.pagination.totalRecords ? this.pagination.totalRecords : end;
    }

    get visiblePages(): number[] {
        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, this.pagination.page - Math.floor(maxVisible / 2));
        let end = Math.min(this.totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }

    onPageSizeChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const newPageSize = parseInt(select.value);
        this.onPageChange.emit({
            page: 1,
            pageSize: newPageSize
        });
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages && page !== this.pagination.page) {
            this.onPageChange.emit({
                page,
                pageSize: this.pagination.pageSize
            });
        }
    }

    previousPage(): void {
        if (this.pagination.page > 1) {
            this.goToPage(this.pagination.page - 1);
        }
    }

    nextPage(): void {
        if (this.pagination.page < this.totalPages) {
            this.goToPage(this.pagination.page + 1);
        }
    }

    sort(column: TableColumn): void {
        if (!column.sortable) return;

        if (this.sortField === column.field) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = column.field;
            this.sortOrder = 'asc';
        }

        this.onSort.emit({
            field: column.field,
            order: this.sortOrder
        });
    }

    handleRowClick(row: any): void {
        this.onRowClick.emit(row);
    }

    getCellValue(row: any, field: string): any {
        return field.split('.').reduce((obj, key) => obj?.[key], row);
    }
}
