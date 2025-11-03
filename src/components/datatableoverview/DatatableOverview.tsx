import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useMemo } from "react";
import { TConfig } from "~/interfaces/Config";
import type { IExtendedBankTransactionsPerMonth } from "~/interfaces/ICSVData"
import { getColorByLabel } from "~/lib/label";

// Prepare data for table
type TTransactionOverviewPerCategory = {
	category: string,
	averagePerMonth: number,
	total: number,
	percentageOfIncome: number,
}

export function DataTableOverview({ transactionsPerMonth, config }: { transactionsPerMonth: IExtendedBankTransactionsPerMonth, config: TConfig }) {

	console.log("Draw DataTableOverview with data");
	const transactionOverviewPerCategory = useMemo(() => {
		// Months
		const months: number = Object.keys(transactionsPerMonth).length;

		// Calculate total costs per category
		const costsPerCategory: Map<string, { total: number, average: number }> = new Map();
		Object.values(transactionsPerMonth).forEach((transactions) => {
			transactions.forEach(transaction => {
				const currentTotal = Math.abs(costsPerCategory.get(transaction.label)?.total ?? 0);
				costsPerCategory.set(transaction.label, { total: currentTotal + Math.abs(transaction.Betrag), average: 0 });
			});
		});
		// Update coste per category with average
		costsPerCategory.forEach((value, key) => {
			const average = value.total / months;
			costsPerCategory.set(key, { total: value.total, average });
		});

		const transactionOverviewPerCategory: TTransactionOverviewPerCategory[] = [];
		costsPerCategory.forEach((value, key) => {
			transactionOverviewPerCategory.push({
				category: key,
				averagePerMonth: value.average,
				total: value.total,
				// Rouneded to 2 decimals
				percentageOfIncome: Math.round((value.total / (config.fixedIncome * months)) * 10000) / 100,
			});
		});

		// Sort by percentage of income descending
		transactionOverviewPerCategory.sort((a, b) => b.percentageOfIncome - a.percentageOfIncome);
		return transactionOverviewPerCategory;
	}, [transactionsPerMonth]);

	// Table
	const columnHelper = createColumnHelper<TTransactionOverviewPerCategory>()
	const columns = [
		columnHelper.accessor("category", {
			header: 'Kategorie',
			cell: info => info.getValue(),
		}),
		columnHelper.accessor('averagePerMonth', {
			header: 'Monatlicher durchschnitt',
			cell: info => `${Math.abs(info.getValue()).toFixed(2)} €`,
		}),
		columnHelper.accessor('total', {
			header: "Gesamtausgaben",
			cell: info => `${Math.abs(info.getValue()).toFixed(2)} €`,
		}),
		columnHelper.accessor('percentageOfIncome', {
			header: '% vom Einkommen',
			cell: (info) => `${Math.abs(info.getValue()).toFixed(2)} %`,
		}),
	]

	const table = useReactTable({
		data: transactionOverviewPerCategory,
		columns,
		getCoreRowModel: getCoreRowModel(), //row model
	})

	return <div className="p-2">
		<table style={{ border: 'solid 1px lightgray', width: '100%' }}>
			<thead>
				{table.getHeaderGroups().map(headerGroup => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map(header => (
							<th key={header.id} style={{
								minWidth: header.column.columnDef.size,
								maxWidth: header.column.columnDef.size,
								borderBottom: 'solid 3px gray',
								borderRight: 'solid 1px lightgray',
							}}>
								{header.isPlaceholder
									? null
									: flexRender(
										header.column.columnDef.header,
										header.getContext()
									)}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map(row => (
					<tr key={row.id}>
						{row.getVisibleCells().map(cell => {
							const textAlign = cell.column.id === 'category' ? 'left' : 'right';
							return (
								<td key={cell.id} style={{
									backgroundColor: `${getColorByLabel(config, row.getValue('category'))}30`,
									textAlign: textAlign,
									borderRight: 'solid 1px lightgray',
									paddingInline: '0.5rem',
								}}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							)
						})}
					</tr>
				))}
			</tbody>
			<tfoot>
				{table.getFooterGroups().map(footerGroup => (
					<tr key={footerGroup.id}>
						{footerGroup.headers.map(header => (
							<th key={header.id}>
								{header.isPlaceholder
									? null
									: flexRender(
										header.column.columnDef.footer,
										header.getContext()
									)}
							</th>
						))}
					</tr>
				))}
			</tfoot>
		</table>
	</div>
}