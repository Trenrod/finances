// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { parseCSV } from '~/lib/csv';
import { Chart } from '~/components/chart/Chart';
import { DataTable } from '~/components/datatable/DataTable';
import { ICharData, IDataSetItemData } from '~/interfaces/ICharts';
import { IExtendedBankTransaction, IExtendedBankTransactionsPerMonth } from '~/interfaces/ICSVData';
import { createDataTableData } from '~/lib/datatable';
import React from 'react';
import { DataTableOverview } from '~/components/datatableoverview/DatatableOverview';
import { PersistanceClient } from '~/lib/persistance';
import { DataPicker } from '~/components/dataPicker/DataPicker';
import { TBankTransaction, zsBankTransaction } from '~/interfaces/IBankData';
import z from 'zod';
import { createDataTableForChart } from '~/lib/chart';
import { TConfig, zsConfig } from '~/interfaces/Config';
import { readFile } from 'fs/promises';
import path from 'path';

interface IGetAllDataResponse {
	config: TConfig,
	transactionsPerMonth: IExtendedBankTransactionsPerMonth;
}

const getAllData = createServerFn({
	method: 'POST',
})
	.validator(z.array(zsBankTransaction))
	.handler(async ({ data }): Promise<IGetAllDataResponse> => {
		// Read env for config path
		const rootConfigPath = process.env.CONFIG_PATH || './';

		// Get config
		const configFileData = await readFile(path.join(rootConfigPath, 'config.json'), "utf-8");
		const config = zsConfig.parse(JSON.parse(configFileData));

		// Read category rules from file categoryRulesFromDB.json
		const categoryRulesFromDB = await PersistanceClient.getInstance().getAllCategoryRules(rootConfigPath);
		const categoryRules = Object.values(categoryRulesFromDB);

		// Get comments
		const transactionCommentsFromDB = await PersistanceClient.getInstance().getAllTransactionComments(rootConfigPath);

		// Write to file transactionCommentsFromDB.json
		const transactionsPerMonth = await parseCSV(data as unknown as TBankTransaction[], categoryRules, transactionCommentsFromDB);

		return { transactionsPerMonth, config };
	})

export const Route = createFileRoute('/')({
	component: Home
})

function Home() {
	const [backendData, setBackendData] = React.useState<IGetAllDataResponse | undefined>(undefined);
	const [bankTransactions, setBankTransactions] = React.useState<TBankTransaction[] | undefined>(undefined);

	const [chartData, setChartData] = React.useState<ICharData>();
	const [dataDableData, setDataDableData] = React.useState<IExtendedBankTransaction[]>([]);
	const [dataSetItem, setDataSetItem] = React.useState<IDataSetItemData | undefined>(undefined);

	const updateData = () => {
		if (bankTransactions != null) {
			getAllData({
				data: bankTransactions
			}).then((data: IGetAllDataResponse) => {
				console.log("Received processed data from server:", bankTransactions);
				setChartData(createDataTableForChart(data.transactionsPerMonth, data.config));
				setDataDableData(createDataTableData(data.transactionsPerMonth, dataSetItem));
				setBackendData(data);
			}).catch((error) => {
				console.log("Error processing CSV and category rules:", error);
				alert("Fehler beim Verarbeiten der CSV- und Kategorisierungsregeln.");
			});
		}
	}

	// Selet bankTransaction and categoryRulesAndCommentsFolder
	if (bankTransactions == null && backendData == null)
		return <DataPicker onValidCSV={(bankTransactions: TBankTransaction[]) => {
			setBankTransactions(bankTransactions);
		}} />
	else if (bankTransactions != null && backendData == null) {
		updateData();
		return <div>Processing data...</div>;
	}

	if (backendData == null || chartData == null || dataDableData == null) {
		return <div>Loading...</div>;
	}

	const filterCallback = (dataSetItem: IDataSetItemData) => {
		setDataSetItem(dataSetItem);
		setDataDableData(createDataTableData(backendData.transactionsPerMonth, dataSetItem));
	};

	return <div className="p-1 flex flex-col">
		<Chart chartData={chartData} filterCallback={filterCallback} fixedIncome={backendData.config.fixedIncome} />
		{
			dataSetItem
				? <DataTable dataTables={dataDableData} config={backendData.config} refreshAll={async () => {
					updateData();
				}} />
				: <DataTableOverview transactionsPerMonth={backendData.transactionsPerMonth} config={backendData.config} />
		}
	</div >;
}
