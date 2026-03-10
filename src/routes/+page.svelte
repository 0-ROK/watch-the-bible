<script lang="ts">
	import { onMount } from 'svelte';
	import { currentTime, isDebugMode, displayTime } from '$lib/stores/clock';
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

	onMount(() => {
		loadBibleData();
		// 10분마다 갱신 확인
		const dataInterval = setInterval(loadBibleData, 10 * 60 * 1000);

		// 매 프레임/타이머 시간 업데이트 루프
		let frame: number;
		const loop = () => {
			if (!$isDebugMode) {
				currentTime.set(new Date());
			}
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);

		return () => {
			clearInterval(dataInterval);
			cancelAnimationFrame(frame);
		};
	});

	// 화면 시각 정보(displayTime)가 변경될 때마다 화면의 구절 동기화 (반응성)
	$: if ($displayTime) {
		updateVerse();
	}
</script>

<div class="app-container">
	<div class="main-content">
		<VerseDisplay verseText={currentVerse.text} is12Hour={$displayTime.is12Hour} />

		<div class="info-footer">
			<div class="reference">{currentVerse.reference}</div>
			<div class="time-display">{$displayTime.formatted}</div>
		</div>
	</div>

	<MinuteScale on:toggleSettings={toggleSettings} />

	<!-- 디버그/설정 패널 (하단 눈금표를 탭하여 활성화) -->
	<DebugPanel isVisible={isSettingsVisible} />
</div>

<style>
	/* 전역 스타일 */
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #fdfbf7; /* 고급 베이지 톤 */
		color: #2c2925;
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
		color: #8c7f70;
		letter-spacing: 0.5px;
	}

	.time-display {
		font-size: 1.2rem;
		letter-spacing: 3px;
		font-family: 'Courier New', Courier, monospace;
		color: #a39c93;
		font-weight: bold;
	}
</style>
