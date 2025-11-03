import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import type { IExtendedBankTransaction } from "~/interfaces/ICSVData"
import { getColorByLabel } from "~/lib/label"
import { FilterDialog } from "../filterdialog/FilterDialog";
import { CommentDialog } from "../filterdialog/CommentDialog";
import { TConfig } from "~/interfaces/Config";

export function DataTable({ dataTables, config, refreshAll }: { dataTables: IExtendedBankTransaction[], config: TConfig, refreshAll: () => Promise<void> }) {
	console.log("Draw DataTable with data");

	dataTables.sort((a, b) => {
		// Sort by Buchungstag descending
		return (Math.abs(b.Betrag) - Math.abs(a.Betrag));
	});

	type TColumMeta = {
		textAlign?: "right" | "left" | "center"
	}

	const columnHelper = createColumnHelper<IExtendedBankTransaction>()
	const columns = [
		columnHelper.accessor('Buchungstag', {
			header: 'Buchungstag',
			cell: info => info.getValue(),
		}),
		columnHelper.accessor('NameZahlungsbeteiligter', {
			header: 'Zahlungsbeteiligter',
			cell: info => info.getValue(),
			size: 200,
		}),
		columnHelper.accessor('Verwendungszweck', {
			header: "Verwendungszweck",
			enableResizing: false,
			cell: info => info.getValue(),
			size: 250,
		}),
		columnHelper.accessor('Betrag', {
			header: 'Betrag',
			cell: (info) => `${info.getValue().toFixed(2)} €`,
			meta: {
				textAlign: "right"
			}
		}),
		columnHelper.accessor('label', {
			header: 'Label',
			cell: (info) => info.getValue(),
			meta: {
				textAlign: "center"
			}
		}),
		columnHelper.accessor('comment', {
			header: 'Comment',
			cell: (info) => info.row.original.comment,
			meta: {
				textAlign: "center"
			}
		}),
		columnHelper.display({
			header: "Action",
			cell: info => <div className="flex flex-row gap-2 justify-center">
				<CommentDialog bankTransaction={info.row.original} refreshAll={refreshAll}></CommentDialog>
				<FilterDialog bankTransaction={info.row.original} refreshAll={refreshAll} config={config}></FilterDialog>
			</div>,
			meta: {
				textAlign: "center"
			}
		})
	]

	const table = useReactTable({
		data: dataTables,
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
							return (
								<td key={cell.id} style={{
									backgroundColor: `${getColorByLabel(config, row.getValue('label'))}30`,
									textAlign: (cell.column.columnDef.meta as TColumMeta)?.textAlign,
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
};