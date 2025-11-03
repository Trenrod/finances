import { IExtendedBankTransaction, IExtendedBankTransactionsPerMonth } from "~/interfaces/ICSVData";
import { IDataSetItemData } from "~/interfaces/ICharts";
import { TMonth } from "~/interfaces/TMonth";

export function createDataTableData(transactionsPerMonth: IExtendedBankTransactionsPerMonth, dataSetItem?: IDataSetItemData): IExtendedBankTransaction[] {
	// Used for datatables
	const extendBankDataList: IExtendedBankTransaction[] = [];
	const tMonths: TMonth[] = Array.from(Object.keys(transactionsPerMonth));

	if (dataSetItem) {
		const monthData = transactionsPerMonth[dataSetItem.month];
		monthData.forEach(entry => {
			if (entry.label === dataSetItem.label) {
				extendBankDataList.push(entry);
			}
		});
	} else {
		for (const tMonth of tMonths) {
			const monthData = transactionsPerMonth[tMonth];
			monthData.forEach(entry => {
				extendBankDataList.push(entry);
			});
		};
	}
	return extendBankDataList;
}
