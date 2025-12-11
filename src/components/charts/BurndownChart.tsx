import { component$, Signal, useComputed$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import ApexCharts from 'apexcharts';
import { format } from 'date-fns';
import { getFormattedHours } from 'src/utils/timesheet';

export type BurndownChartData = {
	dates: string[]; // Array of date strings (YYYY-MM-DD)
	plannedHours: number[]; // Cumulative planned hours remaining
	actualHours: number[]; // Cumulative actual hours worked
};

interface BurndownChartProps {
	data: Signal<BurndownChartData>;
}

export const BurndownChart = component$<BurndownChartProps>(({ data }) => {
	const ref = useSignal<HTMLElement>();

	const options = useComputed$(() => {
		return {
			series: [
				{
					name: 'Planned Hours',
					data: data.value.plannedHours,
					color: '#3b82f6', // blue
				},
				{
					name: 'Actual Hours',
					data: data.value.actualHours,
					color: '#10b981', // green
				},
			],
			chart: {
				type: 'line',
				height: '400px',
				fontFamily: 'Inter, sans-serif',
				toolbar: {
					show: false,
				},
				zoom: {
					enabled: false,
				},
			},
			stroke: {
				curve: 'smooth',
				width: 3,
			},
			markers: {
				size: 4,
				hover: {
					size: 6,
				},
			},
			grid: {
				show: true,
				strokeDashArray: 4,
				padding: {
					left: 2,
					right: 2,
					top: -14,
				},
			},
			dataLabels: {
				enabled: false,
			},
			legend: {
				show: true,
				position: 'top',
				horizontalAlign: 'left',
				fontFamily: 'Inter, sans-serif',
			},
			xaxis: {
				categories: data.value.dates,
				labels: {
					show: true,
					style: {
						fontFamily: 'Inter, sans-serif',
						cssClass: 'text-xs font-normal fill-dark-grey',
					},
					formatter: (value: string) => {
						return format(new Date(value), 'MMM d');
					},
				},
				axisBorder: {
					show: true,
				},
				axisTicks: {
					show: true,
				},
			},
			yaxis: {
				show: true,
				labels: {
					style: {
						fontFamily: 'Inter, sans-serif',
						cssClass: 'text-xs font-normal fill-darkgray-300',
					},
					formatter: (value: number) => {
						return getFormattedHours(value) + ' h';
					},
				},
			},
			tooltip: {
				shared: true,
				intersect: false,
				style: {
					fontFamily: 'Inter, sans-serif',
				},
				y: {
					formatter: (value: number) => {
						return getFormattedHours(value) + ' h';
					},
				},
			},
		};
	});

	useVisibleTask$(async ({ track }) => {
		track(() => data.value.dates);
		track(() => data.value.plannedHours);
		track(() => data.value.actualHours);

		const chart = new ApexCharts(ref.value, options.value);
		chart.render();
		return () => chart.destroy();
	});

	return <div ref={ref} class='w-full py-6' />;
});
