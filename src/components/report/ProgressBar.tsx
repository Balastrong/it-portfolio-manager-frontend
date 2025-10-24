import { component$ } from '@builder.io/qwik';
import { t } from 'src/locale/labels';
import { formatHours } from 'src/utils/report';

interface ProgressBarProps {
	planned: number;
	spent: number;
}

export const ProgressBar = component$<ProgressBarProps>(({ planned, spent }) => {
	const pctSpent = planned > 0 ? Math.min(100, Math.round((spent / planned) * 100)) : 0;
	const pctLeft = planned > 0 ? 100 - pctSpent : 0;
	const timeLeft = Math.max(planned - spent, 0);

	return (
		<div class='flex w-[480px] flex-col gap-2'>
			<div class='flex items-center justify-between gap-5'>
				<div class='flex items-center gap-2'>
					<span
						class='inline-block h-3 w-3 rounded-full ring-2 ring-white'
						style={{ background: '#3F8D81' }}
					/>
					<span class='text-[12px] text-[#464650]'>{t('TOTAL_TIME_SPENT_LABEL')}</span>
					<span class='text-[12px] font-bold text-[#464650]'>
						{`${formatHours(spent)} (${Math.round(spent / 8)} days)`}
					</span>
				</div>
				<div class='flex items-center gap-2'>
					<span
						class='inline-block h-3 w-3 rounded-full ring-2 ring-white'
						style={{ background: '#B1DED3' }}
					/>
					<span class='text-[12px] text-[#464650]'>{t('TOTAL_TIME_LEFT_LABEL')}</span>
					<span class='text-[12px] font-bold text-[#464650]'>
						{`${formatHours(timeLeft)} (${Math.max(Math.round(timeLeft / 8), 0)} days)`}
					</span>
				</div>
			</div>
			<div class='relative flex h-[28px] w-full overflow-hidden'>
				<div
					class='relative flex items-center justify-center bg-[#3F8D81] text-[14px] text-white'
					style={{ width: pctSpent + '%' }}
				>
					{pctSpent}%
				</div>
				<div
					class='relative flex items-center justify-center bg-[#B1DED3] text-[14px] text-[#464650]'
					style={{ width: pctLeft + '%' }}
				>
					{pctLeft}%
				</div>
			</div>
		</div>
	);
});
