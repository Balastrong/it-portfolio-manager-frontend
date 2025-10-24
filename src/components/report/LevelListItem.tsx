import { component$ } from '@builder.io/qwik';
import { ReportGroupedData } from '@models/report';
import { t } from 'src/locale/labels';
import { formatHours } from 'src/utils/report';
import { ProgressBar } from './ProgressBar';
import { TimeStats } from './TimeStats';

interface LevelListItemProps {
	item: ReportGroupedData;
	level: number;
	index: number;
	l1Label: string;
	l2Label: string;
	l3Label: string;
	showPlannedHours: boolean;
}

export const LevelListItem = component$<LevelListItemProps>(
	({ item, level, index, l1Label, l2Label, l3Label, showPlannedHours }) => {
		const planned = Number(item?.plannedHours || 0);
		const spent = Number(item?.duration || 0);
		const isProjectLevel = l1Label === t('PROJECT_LABEL');

		if (level === 1) {
			return (
				<div class='flex flex-col gap-2 border-b border-[#d7dee3] bg-white p-3'>
					<div class='flex items-start justify-between gap-4'>
						<div class='min-w-0 flex-1'>
							<div class='text-[12px] text-[#464650]'>{l1Label}</div>
							<div class='truncate text-[16px] font-bold text-[#393941]'>
								{item?.key ?? '-'}
							</div>
						</div>
						<div class='flex flex-none flex-col gap-2'>
							{isProjectLevel ? (
								<div class='flex items-end gap-6'>
									{showPlannedHours && (
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
									<ProgressBar planned={planned} spent={spent} />
								</div>
							) : (
								<TimeStats
									planned={planned}
									spent={spent}
									showPlanned={showPlannedHours}
								/>
							)}
						</div>
					</div>
				</div>
			);
		}

		return (
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
					{showPlannedHours && (
						<div class='w-[140px] text-right'>
							{level === 2 && isProjectLevel && (
								<div class='text-[12px] text-[#464650]'>
									{t('PLANNED_HOURS_LABEL') ?? 'Planned hours'}
								</div>
							)}
							<div class='text-[16px] text-[#464650]'>
								{formatHours(item?.plannedHours)}
							</div>
						</div>
					)}
					<div class='w-[140px] text-right'>
						{level === 2 && isProjectLevel && (
							<div class='text-[12px] text-[#464650]'>{t('TIME_SPENT_LABEL')}</div>
						)}
						<div class='text-[16px] text-[#464650]'>{formatHours(item?.duration)}</div>
					</div>
				</div>
			</div>
		);
	}
);
