import { PropFunction, component$ } from '@builder.io/qwik';

export const SfIconStar = component$<{ onClick$: PropFunction }>(
	({ onClick$ }) => {
		return (
			<svg
				data-qwik-inspector='../../../packages/qwik-storefront-ui/src/components/SfIconBase/SfIconBase.tsx:29:7'
				xmlns='http://www.w3.org/2000/svg'
				aria-hidden='true'
				data-testid='star-filled'
				viewBox='0 0 24 24'
				class='inline-block fill-current w-6 h-6 w-[1.5em] h-[1.5em]'
				onClick$={onClick$}
			>
				<path
					data-qwik-inspector='../../../packages/qwik-storefront-ui/src/components/SfIcons/SfIconStar.tsx:18:9'
					d='m8.85 17.825 3.15-1.9 3.15 1.925-.825-3.6 2.775-2.4-3.65-.325-1.45-3.4-1.45 3.375-3.65.325 2.775 2.425-.825 3.575Zm3.15.45-4.15 2.5a.908.908 0 0 1-.575.15.966.966 0 0 1-.525-.2 1.2 1.2 0 0 1-.35-.437.876.876 0 0 1-.05-.588l1.1-4.725L3.775 11.8a.955.955 0 0 1-.312-.513.99.99 0 0 1 .037-.562 1.07 1.07 0 0 1 .3-.45c.133-.117.317-.192.55-.225l4.85-.425 1.875-4.45c.083-.2.213-.35.388-.45.175-.1.354-.15.537-.15.183 0 .363.05.538.15.175.1.304.25.387.45l1.875 4.45 4.85.425c.233.033.417.108.55.225.133.117.233.267.3.45a.961.961 0 0 1-.275 1.075l-3.675 3.175 1.1 4.725a.875.875 0 0 1-.05.588 1.2 1.2 0 0 1-.35.437.966.966 0 0 1-.525.2.908.908 0 0 1-.575-.15l-4.15-2.5Z'
				></path>
			</svg>
		);
	}
);
