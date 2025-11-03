import { ICharData, IDataSetItemData } from "~/interfaces/ICharts";
import { TMonth } from "~/interfaces/TMonth";
import { IExtendedBankTransactionsPerMonth } from "~/interfaces/ICSVData";
import { TConfig } from "~/interfaces/Config";
import { getColorByLabel } from "./label";

type TDataSetName = string; // [Label]
type TXAxisLabel = TMonth;

type TDataSet = {
	label: TDataSetName;
	data: IDataSetItemData;
};

export function createDataTableForChart(bankTransactionsPerMonth: IExtendedBankTransactionsPerMonth, config: TConfig): ICharData {
	const charDataMaps: Map<TDataSetName, Map<TXAxisLabel, TDataSet>> = new Map();
	const xAxisLabels: TMonth[] = Array.from(Object.keys(bankTransactionsPerMonth));

	for (const tMonth of xAxisLabels) {
		const bankTransactionsMonth = bankTransactionsPerMonth[tMonth];
		bankTransactionsMonth.forEach(entry => {
			const dataSetName: TDataSetName = entry.label as TDataSetName;
			const dataMapItem = charDataMaps.get(dataSetName);
			if (!dataMapItem) {
				const xAxisGroup: Map<TXAxisLabel, TDataSet> = new Map();
				xAxisGroup.set(tMonth, { label: dataSetName, data: { month: tMonth, value: entry.Betrag, label: dataSetName } });
				charDataMaps.set(dataSetName, xAxisGroup);
			} else {
				const xAxisGroup = dataMapItem.get(tMonth);
				if (!xAxisGroup) {
					dataMapItem.set(tMonth, { label: dataSetName, data: { month: tMonth, value: entry.Betrag, label: dataSetName } });
				} else {
					xAxisGroup.data.value += entry.Betrag;
				}
			}
		});
	};

	const chartData: ICharData = {
		labels: Array.from(xAxisLabels).sort().map(m => m.toString()),
		datasets: []
	};
	charDataMaps.forEach((categories, label) => {
		const data: IDataSetItemData[] = [];
		categories.forEach((value, key) => {
			data.push(value.data);
		});

		chartData.datasets.push({
			label: label,
			data: data,
			backgroundColor: getColorByLabel(config, label),
			parsing: {
				xAxisKey: 'month',
				yAxisKey: 'value'
			}
		});
	});

	return chartData;
}
