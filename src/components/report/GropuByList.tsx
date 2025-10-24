import { $, component$, Signal, useComputed$, useSignal } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';
import { useGroupList } from 'src/hooks/report/useGroupList';
import { t } from 'src/locale/labels';
import { formatDateStringMDY } from 'src/utils/dates';
import { handlePrint } from 'src/utils/handlePrint';
import { UUID } from 'src/utils/uuid';
import { OptionDropdown } from '../form/OptionDropdown';
import { Select } from '../form/Select';
import { ToggleSwitch } from '../form/ToggleSwitch';
import { getIcon } from '../icons';
import { LevelList } from './LevelList';

interface GroupByListProps {
	data: Signal<ReportTimeEntry[]>;
	from: Signal<Date>;
	to: Signal<Date>;
}

export const GroupByList = component$<GroupByListProps>(({ data, from, to }) => {
	const {
		results,
		valueL1Selected,
		valueL2Selected,
		valueL3Selected,
		onChangeGroupL1,
		onChangeGroupL2,
		onChangeGroupL3,
		selectOptions,
		handlerDownloadCSV,
	} = useGroupList(data, from, to);

	const _selectOptions = useSignal(selectOptions);
	const showPlannedHours = useSignal(false);
	const groupByRef = useSignal<HTMLElement>();

	const maxLevel = useComputed$(() =>
		valueL2Selected.value === t('NONE_LABEL')
			? 1
			: valueL3Selected.value === t('NONE_LABEL')
				? 2
				: 3
	);

	return (
		<div ref={groupByRef} class='py-3'>
			<div class='brickly-logo-pdf-download hidden justify-end'>
				<div class='px-6 py-4 sm:text-center [&_svg]:sm:inline'>
					{getIcon('BricklyRedLogo')}
				</div>
			</div>
			<div class='hide-on-pdf-download mb-4 flex items-center justify-between'>
				<h2 class='text-2xl font-bold text-darkgray-900'>Summary report</h2>
				<div class='flex flex-none flex-row items-center gap-2'>
					<OptionDropdown
						id='download-dropdown-groupby'
						icon={getIcon('Download')}
						label={t('REPORT_DOWNLOAD_LABEL')}
						options={[
							{
								value: t('CSV_LABEL'),
								onChange: handlerDownloadCSV,
							},
							{
								value: t('PDF_LABEL'),
								onChange: $(() => handlePrint(groupByRef)),
							},
						]}
					/>
				</div>
			</div>

			<div class='text-darkgray-700 mb-3 text-sm'>
				<span class='text-[12px] text-[#464650]'>{t('TIME_PERIOD_LABEL')}</span>
				<div class='mt-1 font-bold'>
					{formatDateStringMDY(from.value)} - {formatDateStringMDY(to.value)}
				</div>
			</div>
			<div class='hide-on-pdf-download flex items-center gap-2 sm:flex-col md:flex-row md:justify-between lg:flex-row lg:justify-between'>
				<div class='flex items-center gap-2 sm:w-full sm:flex-col md:flex-auto md:flex-row lg:flex-auto lg:flex-row'>
					<span class='mr-4'>{t('GROUP_BY_LABEL')}</span>

					<Select
						id={UUID()}
						value={valueL1Selected}
						options={_selectOptions}
						onChange$={onChangeGroupL1}
						size='s'
					/>

					<Select
						id={UUID()}
						value={valueL2Selected}
						options={_selectOptions}
						onChange$={onChangeGroupL2}
						size='s'
					/>

					{valueL2Selected.value != t('NONE_LABEL') && (
						<Select
							id={UUID()}
							value={valueL3Selected}
							options={_selectOptions}
							onChange$={onChangeGroupL3}
							size='s'
						/>
					)}
				</div>

				<div
					data-tooltip-target='tooltip-planned-hours'
					class='hide-on-pdf-download flex flex-row gap-1'
				>
					<ToggleSwitch isChecked={showPlannedHours} label='Show Planned' />
					<div
						id='tooltip-planned-hours'
						role='tooltip'
						class='text-sx tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-700 px-3 py-2 font-normal text-white opacity-0 shadow-sm transition-opacity duration-300'
					>
						{t('PLANNED_HOURS_DESCRIPTION')}
						<div class='tooltip-arrow' data-popper-arrow></div>
					</div>
				</div>
			</div>

			<div class='mt-4'>
				<LevelList
					items={results}
					level={1}
					maxLevel={maxLevel.value}
					l1Label={valueL1Selected.value}
					l2Label={valueL2Selected.value}
					l3Label={valueL3Selected.value}
					showPlannedHours={showPlannedHours}
				/>
			</div>
		</div>
	);
});
