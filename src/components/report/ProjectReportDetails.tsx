import { component$, Signal, useComputed$, useSignal } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';
import { t } from 'src/locale/labels';
import {
	burndownChartAdapter,
	columnChartSeriesAdapter,
	donutChartGroupByProjectsAdapter,
	donutChartGroupByTaskAdapter,
	donutChartGroupByUsesAdapter,
	listGroupByProjectsAdapter,
	listGroupByTaskAdapter,
	listGroupByUsersAdapter,
} from 'src/utils/chart';
import { REPORT_LIST_RESULTS_PER_PAGE } from 'src/utils/constants';
import { BurndownChart } from '../charts/BurndownChart';
import { ColumnChart } from '../charts/ColumnChart';
import { DonutChart } from '../charts/DonutChart';
import { ReportList } from './ReportList';

interface ProjectReportDetailsProps {
	data: ReportTimeEntry[];
	from: Signal<Date>;
	to: Signal<Date>;
}

export const ProjectReportDetails = component$<ProjectReportDetailsProps>(({ data, from, to }) => {
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

	// ____ USERS _____ //

	const groupByUserSeries = useComputed$(() => {
		return donutChartGroupByUsesAdapter(data);
	});

	const listGroupByUserSeries = useComputed$(() => {
		return listGroupByUsersAdapter(data);
	});

	// ____ TASK _____ //

	const groupByTaskSeries = useComputed$(() => {
		return donutChartGroupByTaskAdapter(data);
	});

	const listGroupByTaskSeries = useComputed$(() => {
		return listGroupByTaskAdapter(data);
	});

	return (
		<div class='flex flex-col divide-y divide-surface-70 p-3'>
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

			{/* ____ PROJECTS _____  */}

			{groupByProjectSeries.value.series.length > 0 &&
				listGroupByProjectSeries.value.length > 0 && (
					<div class='flex gap-1 py-6 sm:flex-col md:flex-row md:justify-between lg:flex-row lg:justify-between'>
						<div class='flex-none'>
							<h3 class='text-xl font-bold text-dark-grey'>{t('PROJECT_LABEL')}</h3>
						</div>

						<div class='flex-1 items-center text-center'>
							<div class='max-w-lg'>
								<DonutChart data={groupByProjectSeries} />
							</div>
						</div>

						<div class='flex-1 sm:w-full'>
							<ReportList
								data={listGroupByProjectSeries}
								resultsPerPage={REPORT_LIST_RESULTS_PER_PAGE}
							/>
						</div>
					</div>
				)}

			{/* ____ USERS _____  */}

			{groupByUserSeries.value.series.length > 0 &&
				listGroupByUserSeries.value.length > 0 && (
					<div class='flex gap-1 py-6 sm:flex-col md:flex-row md:justify-between lg:flex-row lg:justify-between'>
						<div class='flex-none'>
							<h3 class='text-xl font-bold text-dark-grey'>{t('USER_LABEL')}</h3>
						</div>

						<div class='flex-1 items-center text-center'>
							<div class='max-w-lg'>
								<DonutChart data={groupByUserSeries} />
							</div>
						</div>

						<div class='flex-1 sm:w-full'>
							<ReportList
								data={listGroupByUserSeries}
								resultsPerPage={REPORT_LIST_RESULTS_PER_PAGE}
							/>
						</div>
					</div>
				)}

			{/* ____ TASK _____  */}

			{groupByTaskSeries.value.series.length > 0 &&
				listGroupByTaskSeries.value.length > 0 && (
					<div class='flex gap-1 py-6 sm:flex-col md:flex-row md:justify-between lg:flex-row lg:justify-between'>
						<div class='flex-none'>
							<h3 class='text-xl font-bold text-dark-grey'>{t('TASK_LABEL')}</h3>
						</div>

						<div class='flex-1 items-center text-center'>
							<div class='max-w-lg'>
								<DonutChart data={groupByTaskSeries} />
							</div>
						</div>

						<div class='flex-1 sm:w-full'>
							<ReportList
								data={listGroupByTaskSeries}
								resultsPerPage={REPORT_LIST_RESULTS_PER_PAGE}
							/>
						</div>
					</div>
				)}
		</div>
	);
});
