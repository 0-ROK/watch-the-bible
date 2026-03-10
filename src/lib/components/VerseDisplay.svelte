<script lang="ts">
	import { hourProgress, themeColor } from '$lib/stores/clock';

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

<div class="verse-wrapper" style="--highlight-color: {$themeColor};">
	<!-- 베이스 레이어 (어두운 회갈색) -->
	<div class="verse-layer base-layer">
		{#each parsedParts as part (part.text + part.isKeyword)}
			{#if part.isKeyword}
				<!-- 베이스 레이어에서 키워드는 투명하게 처리하여 자리만 차지하도록 함 -->
				<span class="keyword-highlight invisible">{part.text}</span>
			{:else}
				<span class="base-text">{part.text}</span>
			{/if}
		{/each}
	</div>

	<!-- 컬러 레이어 (포인트 색상, clip-path 적용) -->
	<div class="verse-layer color-layer" style="clip-path: inset(0 {100 - $hourProgress}% 0 0);">
		{#each parsedParts as part (part.text + part.isKeyword)}
			{#if part.isKeyword}
				<span class="keyword-highlight invisible">{part.text}</span>
			{:else}
				<span class="colored-text">{part.text}</span>
			{/if}
		{/each}
	</div>

	<!-- 키워드 레이어 (무조건 상시 표시됨, 애니메이션 마스킹 제외) -->
	<div class="verse-layer keyword-layer">
		{#each parsedParts as part (part.text + part.isKeyword)}
			{#if part.isKeyword}
				<span class="keyword-highlight">{part.text}</span>
			{:else}
				<!-- 키워드가 아닌 글자는 투명 처리 -->
				<span class="base-text invisible">{part.text}</span>
			{/if}
		{/each}
	</div>
</div>

<style>
	.verse-wrapper {
		position: relative;
		width: 80%;
		max-width: 1200px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.verse-layer {
		font-size: 3rem;
		font-weight: 700;
		line-height: 1.6;
		word-break: keep-all; /* 단어 단위로 자연스럽게 끊기도록 유지 */
		overflow-wrap: break-word; /* 필요시 길면 줄바꿈 추가 허용 */
		text-align: center;
		width: 100%;
	}

	/* 컬러/키워드 레이어는 베이스 레이어 위로 완벽히 겹쳐지게 설정 */
	.color-layer,
	.keyword-layer {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none; /* 클릭 등의 이벤트 무시 */
	}

	.color-layer {
		transition: clip-path 0.1s linear;
	}

	/* 베이스 텍스트 색상 */
	.base-text {
		color: var(--text-color, #5b534b);
		transition: color 0.5s ease;
	}

	/* 마스킹되어 나타나는 밝은 테마 색상 텍스트 */
	.colored-text {
		color: var(--highlight-color);
	}

	/* 강조되는 키워드 텍스트: 가장 두껍고 크며 동적 테마 색상 적용 */
	.keyword-highlight {
		font-size: 6.5rem; /* 글씨를 이전보다 훨씬 더 크게 (4.5rem -> 6.5rem) */
		font-weight: 900;
		color: var(--highlight-color);
		text-shadow: 0 4px 15px color-mix(in srgb, var(--highlight-color) 40%, transparent);
		margin: 0 12px;
		display: inline-block;
		transform: translateY(10px); /* 커진 글씨체에 맞춘 수직 정렬 보정 */
	}

	/* 레이어 구조를 맞추기 위한 투명화 유틸리티 */
	.invisible {
		opacity: 0;
	}
</style>
