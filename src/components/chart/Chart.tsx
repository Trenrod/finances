import { Bar } from "react-chartjs-2";
import type { ICharData, IDataSetItemData } from "~/interfaces/ICharts";

import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(annotationPlugin);

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ChartAnnotation
);

export function Chart({ chartData, filterCallback, fixedIncome }: { chartData: ICharData, fixedIncome: number, filterCallback: (dataSetItem: IDataSetItemData) => void }) {

	console.log("Draw chart");

	const annotationBox: Record<string, ChartAnnotation.AnnotationOptions> = {};
	if (fixedIncome > 0) {
		annotationBox['lineIncome'] =
		{
			// Indicates the type of annotation
			type: 'line',
			xMin: -.5,
			xMax: 9.5,
			yMin: -1 * fixedIncome,
			yMax: -1 * fixedIncome,
			borderColor: 'rgba(0, 128, 0, 0.50)',
			borderDash: [6, 6],
		};
	}

	return <Bar
		datasetIdKey='id'
		data={chartData}
		options={{
			events: ['click'],
			interaction: {
				mode: 'point'
			},
			onClick(event, elements, chart) {
				if (elements.length > 0) {
					const dataSet = (elements[0].element as unknown as { $context: { raw: IDataSetItemData } }).$context.raw;
					filterCallback(dataSet);
				}
			},
			plugins: {
				annotation: {
					annotations: annotationBox,
				},
				title: {
					display: true,
					text: "Einnahmen und Ausgaben pro Monat",
				},
				legend: {
					onClick: (e, legendItem, legend) => {

						// Checkf if all other datasets are hidden except the selected one to allow toggling back to all visible
						let areAllHiddenExceptSelected = true;
						for (const dataset of legend.chart.data.datasets) {
							if (dataset.label !== legendItem.text && !dataset.hidden) {
								areAllHiddenExceptSelected = false;
								break;
							}
						};
						console.log("areAllHiddenExceptSelected", areAllHiddenExceptSelected);

						// Cast the native event to MouseEvent to access shiftKey
						const mouseEvent = e.native as MouseEvent;

						// If nothing is selected show all
						if (legendItem.datasetIndex === undefined) {
							legend.chart.data.datasets.forEach(dataset => {
								dataset.hidden = false;
							});

							// Update the chart
							legend.chart.update();
							return;
						}

						// When `shift-key` is pressed, toggle visibility of all other datasets
						if (mouseEvent?.shiftKey) {

							// Show the clicked dataset
							if (!legendItem.hidden && areAllHiddenExceptSelected) {
								// Hide datasets
								legend.chart.data.datasets.forEach(dataset => {
									dataset.hidden = false;
								});
							} else {
								legend.chart.data.datasets.forEach(dataset => {
									dataset.hidden = true;
								});
								legend.chart.data.datasets[legendItem.datasetIndex].hidden = false;
							}

							// Update the chart
							legend.chart.update();
						} else {
							// Show all datasets
							// legend.chart.data.datasets.forEach(dataset => {
							// 	dataset.hidden = false;
							// });

							// Show the clicked dataset
							if (legendItem.hidden) {
								// Hide datasets
								legend.chart.data.datasets[legendItem.datasetIndex].hidden = false;
							} else {
								legend.chart.data.datasets[legendItem.datasetIndex].hidden = true;
							}

							// Update the chart
							legend.chart.update();
						}
					}
				}
			},
			responsive: true,
			scales: {
				x: {
					stacked: true,
				},
				y: {
					stacked: true,
				},
			},
		}
		}
	/>
}