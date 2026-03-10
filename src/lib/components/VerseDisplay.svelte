<script lang="ts">
	import { hourProgress } from '$lib/stores/clock';

	export let verseText: string = '';
	export let is12Hour: number = 1;

	// 시(Hour) 단위에 해당하는 키워드 매핑
	const hourKeywords: Record<number, string[]> = {
		1: ['하나', '한 '],
		2: ['두 ', '둘'],
		3: ['세 '],
		4: ['네 ', '넷째'],
		5: ['다섯'],
		6: ['여섯'],
		7: ['일곱'],
		8: ['여덟'],
		9: ['아홉', '구 '],
		10: ['열 '],
		11: ['열 한'],
		12: ['열 두']
	};

	// 텍스트를 파싱하여 키워드 부분을 분리하는 함수
	function parseVerse(text: string, currentHour: number) {
		if (!text) return [];

		const keywords = hourKeywords[currentHour] || [];
		let result = [{ text, isKeyword: false }];

		for (const keyword of keywords) {
			let newResult: { text: string; isKeyword: boolean }[] = [];
			for (const chunk of result) {
				if (chunk.isKeyword) {
					newResult.push(chunk);
					continue;
				}

				const parts = chunk.text.split(keyword);
				for (let i = 0; i < parts.length; i++) {
					if (parts[i]) newResult.push({ text: parts[i], isKeyword: false });
					if (i < parts.length - 1) newResult.push({ text: keyword, isKeyword: true });
				}
			}
			result = newResult;
		}

		return result;
	}

	$: parsedParts = parseVerse(verseText, is12Hour);
</script>

<div class="verse-container" style="--progress: {$hourProgress.toFixed(4)}%">
	{#each parsedParts as part (part.text + part.isKeyword)}
		{#if part.isKeyword}
			<span class="keyword-highlight">{part.text}</span>
		{:else}
			<span class="base-text">{part.text}</span>
		{/if}
	{/each}
</div>

<style>
	.verse-container {
		width: 80%;
		max-width: 1200px;
		font-size: 3rem;
		font-weight: 700;
		line-height: 1.6;
		word-break: keep-all;
		text-align: center;
		/* Custom property definition for smooth animation */
		transition: --progress 0.1s linear;
	}

	/* 일반 텍스트: 마스킹 그라데이션 적용 */
	.base-text {
		background-image: linear-gradient(
			to right,
			#d4af37 0%,
			#d4af37 var(--progress),
			#5b534b var(--progress),
			#5b534b 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	/* 강조 키워드: 마스킹 효과 제외, 거대한 크기, 상시 골드 색상 */
	.keyword-highlight {
		font-size: 4.5rem; /* 글씨를 훨씬 크게 */
		font-weight: 900; /* 더 두껍게 */
		color: #d4af37; /* 진행률과 무관하게 항상 하이라이트 색상 유지 */
		text-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
		margin: 0 8px;
		display: inline-block;
		transform: translateY(5px); /* 수직 정렬 보정 */
	}

	@property --progress {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 0%;
	}
</style>
