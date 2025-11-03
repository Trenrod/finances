import type { Color } from "chart.js";
import type { TLabels } from "~/lib/label";
import { TMonth } from "./TMonth";

export interface IDataSetItemData { month: TMonth, value: number, label: TLabels }

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

