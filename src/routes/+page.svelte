<script lang="ts">
	import { onMount } from 'svelte';
	import {
		currentTime,
		useNetworkTime,
		debugSliderValue,
		displayTime,
		showMinuteScale,
		showVerseInfo,
		showClock,
		isDarkMode
	} from '$lib/stores/clock';
	import VerseDisplay from '$lib/components/VerseDisplay.svelte';
	import DebugPanel from '$lib/components/DebugPanel.svelte';
	import MinuteScale from '$lib/components/MinuteScale.svelte';

	let isSettingsVisible = false;

	function toggleSettings() {
		isSettingsVisible = !isSettingsVisible;
	}

	type BibleData = {
		hour: number;
		text: string;
		reference: string;
	};

	let bibleData: BibleData[] = [];
	let currentVerse: BibleData = {
		hour: 1,
		text: '로딩 중...',
		reference: ''
	};

	// JSON 데이터 비동기 로드
	async function loadBibleData() {
		try {
			const response = await fetch('/data.json');
			if (response.ok) {
				const newData = await response.json();
				if (newData && newData.length > 0) {
					bibleData = newData;
					updateVerse();
				}
			}
		} catch (error) {
			console.error('Failed to load bible data:', error);
			// Fallback 기본 데이터 탑재 방어 코드 (생략)
		}
	}

	// 시간에 맞는 구절로 컴포넌트를 갱신
	function updateVerse() {
		if (bibleData.length === 0) return;
		const matchingVerse = bibleData.find((d) => d.hour === $displayTime.is12Hour);
		if (matchingVerse) {
			currentVerse = matchingVerse;
		} else {
			currentVerse = bibleData[0];
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key.toLowerCase() === 'd') {
			toggleSettings();
		} else if (event.key.toLowerCase() === 'f') {
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen().catch(() => {});
			} else {
				document.exitFullscreen();
			}
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		loadBibleData();
		// 10분마다 갱신 확인
		const dataInterval = setInterval(loadBibleData, 10 * 60 * 1000);

		// 매 프레임/타이머 시간 업데이트 루프
		let frame: number;
		let lastTimestamp: number | null = null;
		const loop = (timestamp: number) => {
			if ($useNetworkTime) {
				currentTime.set(new Date());
			} else {
				// 네트워크 시간 미사용 시에도 실제 경과 시간만큼 슬라이더 값을 증가시켜 시간이 흐르도록 함
				if (lastTimestamp !== null) {
					const deltaSeconds = (timestamp - lastTimestamp) / 1000;
					debugSliderValue.update((v) => {
						const newValue = v + deltaSeconds;
						return newValue >= 86400 ? newValue - 86400 : newValue;
					});
				}
			}
			lastTimestamp = timestamp;
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			clearInterval(dataInterval);
			cancelAnimationFrame(frame);
		};
	});

	// 화면 시각 정보(displayTime)가 변경될 때마다 화면의 구절 동기화 (반응성)
	$: if ($displayTime) {
		updateVerse();
	}
</script>

<!-- 다크 모드 활성화 시 최상위 div 컨테이너를 통해 body에 스타일이 상속되도록 설정 -->
<div class="app-container {$isDarkMode ? 'dark-mode' : ''}">
	<div class="main-content">
		<VerseDisplay verseText={currentVerse.text} is12Hour={$displayTime.is12Hour} />

		{#if $showVerseInfo || $showClock}
			<div class="info-footer">
				{#if $showVerseInfo}
					<div class="reference">{currentVerse.reference}</div>
				{/if}
				{#if $showClock}
					<div class="time-display">{$displayTime.formatted}</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- 타임라인의 히트박스는 항상 렌더링하되, Ticks 요소만 보였다 감췄다 처리 -->
	<MinuteScale visible={$showMinuteScale} on:toggleSettings={toggleSettings} />

	<!-- 디버그/설정 패널 (하단 눈금표를 탭하거나 'd' 키로 활성화) -->
	<DebugPanel isVisible={isSettingsVisible} />
</div>

<style>
	/* 테마 CSS 변수 */
	:global(:root) {
		--bg-color: #fdfbf7;
		--text-color: #5b534b; /* 기본 성경 구절 색상 */
		--reference-color: #8c7f70;
		--clock-color: #a39c93;
		--tick-bg: rgba(91, 83, 75, 0.2);
	}

	:global(.dark-mode) {
		--bg-color: #1a1816;
		--text-color: #d1cbc3; /* 다크 모드 성경 구절 색상 */
		--reference-color: #7a7066;
		--clock-color: #635b52;
		--tick-bg: rgba(253, 251, 247, 0.15);
	}

	/* 전역 스타일 */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Noto Serif KR', serif;
		overflow: hidden;
	}

	.app-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
		position: relative;
		background-color: var(--bg-color);
		color: var(--text-color);
		transition:
			background-color 0.5s ease,
			color 0.5s ease;
	}

	.main-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 10;
		width: 100%;
		padding: 0 5%;
	}

	.info-footer {
		margin-top: 5vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		opacity: 0.8;
	}

	.reference {
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--reference-color);
		letter-spacing: 0.5px;
		transition: color 0.5s ease;
	}

	.time-display {
		font-size: 1.2rem;
		letter-spacing: 3px;
		font-family: 'Courier New', Courier, monospace;
		color: var(--clock-color);
		font-weight: bold;
		transition: color 0.5s ease;
	}
</style>
