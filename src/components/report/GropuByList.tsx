import { $, component$, Signal, useSignal } from '@builder.io/qwik';
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

			<div id='grouped-results' class='mt-4'>
				{(() => {
					// decide how many levels to render based on selected groups
					const maxLevel =
						valueL2Selected.value === t('NONE_LABEL')
							? 1
							: valueL3Selected.value === t('NONE_LABEL')
								? 2
								: 3;

					const toHHMM = (n: number) => {
						const totalMin = Math.round(Math.max(n, 0) * 60);
						const h = Math.floor(totalMin / 60);
						const m = totalMin % 60;
						return `${h}:${String(m).padStart(2, '0')}`;
					};
					const formatHours = (n?: number) =>
						typeof n === 'number' ? `${toHHMM(n)} h` : '-';

					const l1Label = valueL1Selected.value;
					const l2Label = valueL2Selected.value;
					const l3Label = valueL3Selected.value;

					const LevelList = (items: any[], level: number) => {
						if (!items?.length) return null;
						return (
							<ul class={['mt-3 space-y-2', level > 1 ? 'ml-3 pl-3' : ''].join(' ')}>
								{items.map((item, index) => {
									// progress values for level 1
									const planned = Number(item?.plannedHours || 0);
									const spent = Number(item?.duration || 0);
									const pctSpent =
										planned > 0
											? Math.min(100, Math.round((spent / planned) * 100))
											: 0;
									const pctLeft = planned > 0 ? 100 - pctSpent : 0;

									return (
										<li>
											{level === 1 ? (
												<div class='flex flex-col gap-2 border-b border-[#d7dee3] bg-white p-3'>
													<div class='flex items-start justify-between gap-4'>
														<div class='min-w-0 flex-1'>
															<div class='text-[12px] text-[#464650]'>
																{l1Label}
															</div>
															<div class='truncate text-[16px] font-bold text-[#393941]'>
																{item?.key ?? '-'}
															</div>
														</div>
														<div class='flex flex-none flex-col gap-2'>
															{l1Label === t('PROJECT_LABEL') ? (
																<div class='flex items-end gap-6'>
																	{showPlannedHours.value && (
																		<div class='text-right'>
																			<div class='text-[12px] text-[#464650]'>
																				{t(
																					'TOTAL_TIME_PLANNED_LABEL'
																				) ??
																					'Total time planned hours'}
																			</div>
																			<div class='text-[16px] font-bold text-[#464650]'>
																				{`${formatHours(planned)} (${Math.round(planned / 8)} days)`}
																			</div>
																		</div>
																	)}
																	<div class='flex w-[480px] flex-col gap-2'>
																		<div class='flex items-center justify-between gap-5'>
																			<div class='flex items-center gap-2'>
																				<span
																					class='inline-block h-3 w-3 rounded-full ring-2 ring-white'
																					style={{
																						background:
																							'#3F8D81',
																					}}
																				/>
																				<span class='text-[12px] text-[#464650]'>
																					{t(
																						'TOTAL_TIME_SPENT_LABEL'
																					)}
																				</span>
																				<span class='text-[12px] font-bold text-[#464650]'>
																					{`${formatHours(spent)} (${Math.round(spent / 8)} days)`}
																				</span>
																			</div>
																			<div class='flex items-center gap-2'>
																				<span
																					class='inline-block h-3 w-3 rounded-full ring-2 ring-white'
																					style={{
																						background:
																							'#B1DED3',
																					}}
																				/>
																				<span class='text-[12px] text-[#464650]'>
																					{t(
																						'TOTAL_TIME_LEFT_LABEL'
																					)}
																				</span>
																				<span class='text-[12px] font-bold text-[#464650]'>
																					{`${formatHours(Math.max(planned - spent, 0))} (${Math.max(Math.round((planned - spent) / 8), 0)} days)`}
																				</span>
																			</div>
																		</div>
																		<div class='relative flex h-[28px] w-full overflow-hidden'>
																			<div
																				class='relative flex items-center justify-center bg-[#3F8D81] text-[14px] text-white'
																				style={{
																					width:
																						pctSpent +
																						'%',
																				}}
																			>
																				{pctSpent}%
																			</div>
																			<div
																				class='relative flex items-center justify-center bg-[#B1DED3] text-[14px] text-[#464650]'
																				style={{
																					width:
																						pctLeft +
																						'%',
																				}}
																			>
																				{pctLeft}%
																			</div>
																		</div>
																	</div>
																</div>
															) : (
																<div class='flex items-end gap-6'>
																	{showPlannedHours.value && (
																		<div class='w-[200px] text-right'>
																			<div class='text-[12px] text-[#464650]'>
																				{t(
																					'PLANNED_HOURS_LABEL'
																				) ??
																					'Planned hours'}
																			</div>
																			<div class='text-[16px] font-bold text-[#464650]'>
																				{formatHours(
																					item?.plannedHours
																				)}
																			</div>
																		</div>
																	)}
																	<div class='w-[140px] text-right'>
																		<div class='text-[12px] text-[#464650]'>
																			{t('TIME_SPENT_LABEL')}
																		</div>
																		<div class='text-[16px] font-bold text-[#464650]'>
																			{formatHours(spent)}
																		</div>
																	</div>
																</div>
															)}
														</div>
													</div>
												</div>
											) : (
												<div class='flex items-end justify-between gap-4 border-b border-[#d7dee3] bg-white px-3 py-1'>
													<div class='min-w-0'>
														{index === 0 && (
															<div class='text-[12px] text-[#464650]'>
																{level === 2 ? l2Label : l3Label}
															</div>
														)}
														<div class='truncate text-[14px] font-bold text-[#464650]'>
															{item?.key ?? '-'}
														</div>
													</div>
													<div class='flex flex-none items-center gap-6'>
														{showPlannedHours.value && (
															<div class='w-[140px] text-right'>
																{level === 2 &&
																	l1Label ===
																		t('PROJECT_LABEL') && (
																		<div class='text-[12px] text-[#464650]'>
																			{t(
																				'PLANNED_HOURS_LABEL'
																			) ?? 'Planned hours'}
																		</div>
																	)}
																<div class='text-[16px] text-[#464650]'>
																	{formatHours(
																		item?.plannedHours
																	)}
																</div>
															</div>
														)}
														<div class='w-[140px] text-right'>
															{level === 2 &&
																l1Label === t('PROJECT_LABEL') && (
																	<div class='text-[12px] text-[#464650]'>
																		{t('TIME_SPENT_LABEL')}
																	</div>
																)}
															<div class='text-[16px] text-[#464650]'>
																{formatHours(item?.duration)}
															</div>
														</div>
													</div>
												</div>
											)}

											{level < maxLevel && item?.subGroups?.length
												? LevelList(item.subGroups, level + 1)
												: null}
										</li>
									);
								})}
							</ul>
						);
					};

					return LevelList(results.value, 1);
				})()}
			</div>
		</div>
	);
});
