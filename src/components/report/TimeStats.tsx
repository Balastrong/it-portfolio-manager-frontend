import { component$ } from '@builder.io/qwik';
import { t } from 'src/locale/labels';
import { formatHours } from 'src/utils/report';

interface TimeStatsProps {
	planned?: number;
	spent: number;
	showPlanned: boolean;
	showAsProject?: boolean;
}

export const TimeStats = component$<TimeStatsProps>(
	({ planned, spent, showPlanned, showAsProject }) => {
		return (
			<div class='flex items-end gap-6'>
				{showPlanned && (
					<div class={showAsProject ? 'text-right' : 'w-[200px] text-right'}>
						<div class='text-[12px] text-[#464650]'>
							{showAsProject
								? t('TOTAL_TIME_PLANNED_LABEL') ?? 'Total time planned hours'
								: t('PLANNED_HOURS_LABEL') ?? 'Planned hours'}
						</div>
						<div class='text-[16px] font-bold text-[#464650]'>
							{showAsProject
								? `${formatHours(planned)} (${Math.round((planned || 0) / 8)} days)`
								: formatHours(planned)}
						</div>
					</div>
				)}
				<div class='w-[140px] text-right'>
					<div class='text-[12px] text-[#464650]'>{t('TIME_SPENT_LABEL')}</div>
					<div class='text-[16px] font-bold text-[#464650]'>{formatHours(spent)}</div>
				</div>
			</div>
		);
	}
);
