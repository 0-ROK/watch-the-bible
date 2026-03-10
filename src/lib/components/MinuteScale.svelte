<script lang="ts">
	import { displayTime, themeColor } from '$lib/stores/clock';
	import { createEventDispatcher } from 'svelte';

	export let visible = true;

	const dispatch = createEventDispatcher();

	// 총 60개의 눈금 배열 생성
	const ticks = Array.from({ length: 60 }, (_, i) => i);

	function handleClick() {
		dispatch('toggleSettings');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="minute-scale-container"
	role="button"
	tabindex="0"
	on:click={handleClick}
	title="설정 열기/닫기"
>
	<div class="scale-track" style="opacity: {visible ? 1 : 0}; pointer-events: none;">
		{#each ticks as tick (tick)}
			<div
				class="tick {tick < $displayTime.minutes ? 'active' : ''} {tick === $displayTime.minutes
					? 'current'
					: ''}"
				style="--active-color: {$themeColor}"
			></div>
		{/each}
	</div>

	<!-- 터치/클릭 영영 확장을 위한 눈에 보이지 않는 힛박스 -->
	<div class="hitbox"></div>
</div>

<style>
	.minute-scale-container {
		width: 100%;
		max-width: 800px;
		height: 40px;
		position: absolute;
		bottom: 5vh;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		opacity: 0.6;
		transition: opacity 0.3s;
		z-index: 50; /* Verse 보다는 위, DebugPanel 보다는 아래 */
	}

	.minute-scale-container:hover {
		opacity: 1;
	}

	.scale-track {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: flex-end;
		height: 20px;
		padding: 0 20px;
		transition: opacity 0.3s;
	}

	.tick {
		width: 2px;
		height: 8px;
		background-color: var(--tick-bg, rgba(91, 83, 75, 0.2)); /* 지나지 않은 미래 시간 */
		border-radius: 1px;
		transition: all 0.3s ease;
	}

	/* 매 5분마다 조금 더 길게 눈금 표시 */
	.tick:nth-child(5n + 1) {
		height: 14px;
	}

	/* 자정(0분), 30분은 가장 길게 눈금 표시 */
	.tick:nth-child(30n + 1) {
		height: 20px;
	}

	/* 이미 지나간 시간의 눈금: 선택된 테마 색상으로 점등 */
	.tick.active {
		background-color: var(--active-color);
		box-shadow: 0 0 4px color-mix(in srgb, var(--active-color) 40%, transparent);
	}

	/* 현재 진행중인 1분의 눈금: 살짝 더 밝게 점멸 효과(옵션) 혹은 뚜렷하게 */
	.tick.current {
		background-color: var(--active-color);
		height: 16px; /* 현재 분침을 살짝 강조 */
		transform: scaleX(1.5);
		box-shadow: 0 0 8px var(--active-color);
	}

	/* 마우스/터치 인식 영역을 넓히기 위한 투명 박스 */
	.hitbox {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
	}
</style>
