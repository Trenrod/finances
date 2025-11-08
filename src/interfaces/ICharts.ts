import type { Color } from "chart.js";
import { TMonth } from "./TMonth";

export interface IDataSetItemData { month: TMonth, value: number, label: string }

export interface IDataSetItem {
	data: IDataSetItemData[],
	parsing: {
		xAxisKey: 'month',
		yAxisKey: 'value'
	}
}

export interface ICharData {
	labels: string[];
	datasets: {
		label: string;
		data: IDataSetItemData[];
		backgroundColor: Color;
		parsing: {
			xAxisKey: 'month';
			yAxisKey: 'value';
		};
	}[];
};

