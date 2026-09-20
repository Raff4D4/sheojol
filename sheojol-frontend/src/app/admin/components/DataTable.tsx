'use client';

import { Fragment, ReactNode } from 'react';

export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

export type CellAlign = 'left' | 'center' | 'right';

export interface DataColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  align?: CellAlign;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  sort: SortState | null;
  onSortChange: (sort: SortState | null) => void;
  emptyTitle: string;
  emptyHint?: string;
  skeletonRows?: number;
  className?: string;
  renderRow: (row: T) => ReactNode;
}

const ALIGN_CLASS: Record<CellAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function useSortableData<T>(rows: T[], columns: DataColumn<T>[], sort: SortState | null): T[] {
  if (!sort) return rows;
  const column = columns.find((item) => item.key === sort.key && item.sortable && item.sortValue);
  if (!column) return rows;
  const factor = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const aValue = column.sortValue!(a);
    const bValue = column.sortValue!(b);
    if (aValue < bValue) return -1 * factor;
    if (aValue > bValue) return 1 * factor;
    return 0;
  });
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  sort,
  onSortChange,
  emptyTitle,
  emptyHint,
  skeletonRows = 4,
  className = '',
  renderRow,
}: DataTableProps<T>) {
  const toggle = (key: string) => {
    const activeKey = sort?.key === key;
    const direction = activeKey && sort.direction === 'asc' ? 'desc' : 'asc';
    if (activeKey && sort.direction === 'desc') {
      onSortChange(null);
    } else {
      onSortChange({ key, direction });
    }
  };

  return (
    <div className={`overflow-x-auto rounded-2xl border-2 border-edge bg-surface ${className}`}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b-2 border-edge text-[10px] font-bold uppercase tracking-widest text-muted">
            {columns.map((column) => {
              const active = sort?.key === column.key ? sort : null;
              const arrow = active ? (active.direction === 'asc' ? '↑' : '↓') : '';
              return (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 ${ALIGN_CLASS[column.align ?? 'left']} ${column.className ?? ''}`}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggle(column.key)}
                      aria-label={`Urutkan ${column.label} ${arrow ? 'membalik' : 'naik'}`}
                      className={`inline-flex items-center gap-1 transition ${active ? 'text-primary' : 'hover:text-content'}`}
                    >
                      <span className="w-full whitespace-nowrap">{column.label}</span>
                      <span className={`inline-block w-3 text-primary ${active ? 'opacity-100' : 'opacity-0'}`}>{arrow}</span>
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, index) => (
              <tr key={`skeleton-${index}`} className="border-b border-edge/60 last:border-0">
                <td colSpan={columns.length} className="px-4 py-3">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-surface-2 motion-reduce:animate-none" />
                </td>
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <p className="text-sm font-bold text-content">{emptyTitle}</p>
                {emptyHint ? <p className="mt-1 text-xs text-muted">{emptyHint}</p> : null}
              </td>
            </tr>
          ) : (
            rows.map((row) => <Fragment key={rowKey(row)}>{renderRow(row)}</Fragment>)
          )}
        </tbody>
      </table>
    </div>
  );
}