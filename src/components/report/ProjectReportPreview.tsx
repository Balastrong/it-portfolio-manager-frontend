import { component$, Signal, useComputed$, useSignal } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';
import { t } from 'src/locale/labels';
import {
	burndownChartAdapter,
	columnChartSeriesAdapter,
	donutChartGroupByProjectsAdapter,
	listGroupByProjectsAdapter,
} from 'src/utils/chart';
import { REPORT_LIST_RESULTS_PER_PAGE } from 'src/utils/constants';
import { BurndownChart } from '../charts/BurndownChart';
import { ColumnChart } from '../charts/ColumnChart';
import { DonutChart } from '../charts/DonutChart';
import { ReportList } from './ReportList';

interface ProjectReportPreviewProps {
	data: ReportTimeEntry[];
	from: Signal<Date>;
	to: Signal<Date>;
}

export const ProjectReportPreview = component$<ProjectReportPreviewProps>(({ data, from, to }) => {
	const showBurndownChart = useSignal(false);

	const daysSeries = useComputed$(() => {
		return columnChartSeriesAdapter(data, from.value, to.value);
	});

	const burndownSeries = useComputed$(() => {
		return burndownChartAdapter(data, from.value, to.value);
	});

	// ____ PROJECTS _____ //
	const groupByProjectSeries = useComputed$(() => {
		return donutChartGroupByProjectsAdapter(data);
	});

	const listGroupByProjectSeries = useComputed$(() => {
		return listGroupByProjectsAdapter(data);
	});

	return (
		<div class='flex flex-col'>
			<div class='flex sm:flex-col md:flex-row lg:flex-row'>
				<div class='flex-1'>
					<DonutChart data={groupByProjectSeries} />
				</div>

				<div class='flex-auto'>
					<ReportList
						data={listGroupByProjectSeries}
						resultsPerPage={REPORT_LIST_RESULTS_PER_PAGE}
					/>
				</div>
			</div>

			<ColumnChart data={daysSeries} />

			<div class='py-3'>
				<label class='flex cursor-pointer items-center gap-2'>
					<input
						type='checkbox'
						checked={showBurndownChart.value}
						onChange$={(e) =>
							(showBurndownChart.value = (e.target as HTMLInputElement).checked)
						}
						class='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500'
					/>
					<span class='text-sm font-medium text-dark-grey'>
						{t('SHOW_BURNDOWN_CHART')}
					</span>
				</label>
			</div>

			{showBurndownChart.value && (
				<div class='py-3'>
					<h3 class='mb-4 text-xl font-bold text-dark-grey'>
						{t('BURNDOWN_CHART_TITLE')}
					</h3>
					<BurndownChart data={burndownSeries} />
				</div>
			)}
		</div>
	);
});
