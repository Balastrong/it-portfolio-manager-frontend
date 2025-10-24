import { component$, Signal } from '@builder.io/qwik';
import { ReportGroupedData } from '@models/report';
import { t } from 'src/locale/labels';

interface LevelListProps {
	items: Signal<ReportGroupedData[]>;
	level: number;
	maxLevel: number;
	l1Label: string;
	l2Label: string;
	l3Label: string;
	showPlannedHours: Signal<boolean>;
}

export const LevelList = component$<LevelListProps>(
	({ items, level, maxLevel, l1Label, l2Label, l3Label, showPlannedHours }) => {
		const toHHMM = (n: number) => {
			const totalMin = Math.round(Math.max(n, 0) * 60);
			const h = Math.floor(totalMin / 60);
			const m = totalMin % 60;
			return `${h}:${String(m).padStart(2, '0')}`;
		};

		const formatHours = (n?: number) => (typeof n === 'number' ? `${toHHMM(n)} h` : '-');

		if (!items.value?.length) return null;

		return (
			<ul class={['mt-3 space-y-2', level > 1 ? 'ml-3 pl-3' : ''].join(' ')}>
				{items.value.map((item, index) => {
					// progress values for level 1
					const planned = Number(item?.plannedHours || 0);
					const spent = Number(item?.duration || 0);
					const pctSpent =
						planned > 0 ? Math.min(100, Math.round((spent / planned) * 100)) : 0;
					const pctLeft = planned > 0 ? 100 - pctSpent : 0;

					return (
						<li>
							{level === 1 ? (
								<div class='flex flex-col gap-2 border-b border-[#d7dee3] bg-white p-3'>
									<div class='flex items-start justify-between gap-4'>
										<div class='min-w-0 flex-1'>
											<div class='text-[12px] text-[#464650]'>{l1Label}</div>
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
																{t('TOTAL_TIME_PLANNED_LABEL') ??
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
																		background: '#3F8D81',
																	}}
																/>
																<span class='text-[12px] text-[#464650]'>
																	{t('TOTAL_TIME_SPENT_LABEL')}
																</span>
																<span class='text-[12px] font-bold text-[#464650]'>
																	{`${formatHours(spent)} (${Math.round(spent / 8)} days)`}
																</span>
															</div>
															<div class='flex items-center gap-2'>
																<span
																	class='inline-block h-3 w-3 rounded-full ring-2 ring-white'
																	style={{
																		background: '#B1DED3',
																	}}
																/>
																<span class='text-[12px] text-[#464650]'>
																	{t('TOTAL_TIME_LEFT_LABEL')}
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
																	width: pctSpent + '%',
																}}
															>
																{pctSpent}%
															</div>
															<div
																class='relative flex items-center justify-center bg-[#B1DED3] text-[14px] text-[#464650]'
																style={{
																	width: pctLeft + '%',
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
																{t('PLANNED_HOURS_LABEL') ??
																	'Planned hours'}
															</div>
															<div class='text-[16px] font-bold text-[#464650]'>
																{formatHours(item?.plannedHours)}
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
												{level === 2 && l1Label === t('PROJECT_LABEL') && (
													<div class='text-[12px] text-[#464650]'>
														{t('PLANNED_HOURS_LABEL') ??
															'Planned hours'}
													</div>
												)}
												<div class='text-[16px] text-[#464650]'>
													{formatHours(item?.plannedHours)}
												</div>
											</div>
										)}
										<div class='w-[140px] text-right'>
											{level === 2 && l1Label === t('PROJECT_LABEL') && (
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

							{level < maxLevel && item?.subGroups?.length ? (
								<LevelList
									items={{ value: item.subGroups }}
									level={level + 1}
									maxLevel={maxLevel}
									l1Label={l1Label}
									l2Label={l2Label}
									l3Label={l3Label}
									showPlannedHours={showPlannedHours}
								/>
							) : null}
						</li>
					);
				})}
			</ul>
		);
	}
);
