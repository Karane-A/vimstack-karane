import React from 'react';

interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T, index: number) => string | number;
}

export function DataTable<T>({ columns, data, keyExtractor }: DataTableProps<T>) {
    return (
        <div className="ds-table-container">
            <table className="ds-table w-full border-collapse">
                <thead className="bg-[#fcfcfd]">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                style={{ textAlign: column.align || 'left' }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="py-12 text-center text-slate-400 text-sm">
                                No results found
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={keyExtractor(item, index)} className="hover:bg-slate-50/50 transition-colors group">
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        style={{ textAlign: column.align || 'left' }}
                                        className="group-last:border-none"
                                    >
                                        {column.render ? column.render(item) : (item as any)[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
