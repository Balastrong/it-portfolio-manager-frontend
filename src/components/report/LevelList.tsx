import { component$, Signal } from '@builder.io/qwik';
import { ReportGroupedData } from '@models/report';
import { LevelListItem } from './LevelListItem';

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
		if (!items.value?.length) return null;

		return (
			<ul class={['mt-3 space-y-2', level > 1 ? 'ml-3 pl-3' : ''].join(' ')}>
				{items.value.map((item, index) => (
					<li key={index}>
						<LevelListItem
							item={item}
							level={level}
							index={index}
							l1Label={l1Label}
							l2Label={l2Label}
							l3Label={l3Label}
							showPlannedHours={showPlannedHours.value}
						/>

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
				))}
			</ul>
		);
	}
);
