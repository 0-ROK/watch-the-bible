<script lang="ts">
	import {
		useNetworkTime,
		debugSliderValue,
		displayTime,
		themeColors,
		themeColor,
		showMinuteScale,
		showVerseInfo,
		showClock,
		isDarkMode
	} from '$lib/stores/clock';

	export let isVisible: boolean = false;
</script>

{#if isVisible}
	<div class="debug-panel">
		<!-- 테마 색상 선택기 -->
		<div class="theme-selector">
			<span class="theme-label">테마 색상:</span>
			<div class="swatches">
				{#each themeColors as theme (theme.hex)}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="swatch {$themeColor === theme.hex ? 'active' : ''}"
						style="background-color: {theme.hex};"
						title={theme.name}
						role="button"
						tabindex="0"
						on:click={() => ($themeColor = theme.hex)}
					></div>
				{/each}
			</div>
		</div>

		<hr class="divider" />

		<div class="toggle-group">
			<label class="debug-label">
				<input type="checkbox" bind:checked={$isDarkMode} />
				다크 모드
			</label>
			<label class="debug-label">
				<input type="checkbox" bind:checked={$showMinuteScale} />
				분침 눈금 표시
			</label>
			<label class="debug-label">
				<input type="checkbox" bind:checked={$showVerseInfo} />
				성경 구절 정보 표시
			</label>
			<label class="debug-label">
				<input type="checkbox" bind:checked={$showClock} />
				디지털 시계 표시
			</label>
		</div>

		<hr class="divider" />

		<label class="debug-label">
			<input type="checkbox" bind:checked={$useNetworkTime} />
			네트워크 시간 사용 (해제 시 수동 조작)
		</label>

		<input
			type="range"
			min="0"
			max="86399"
			bind:value={$debugSliderValue}
			disabled={$useNetworkTime}
			class="debug-slider"
			style="accent-color: {$themeColor}"
		/>

		<div class="debug-time" style="color: {$themeColor}">{$displayTime.formatted}</div>
	</div>
{/if}

<style>
	.debug-panel {
		position: fixed;
		bottom: 2rem;
		left: 2rem;
		background: rgba(40, 35, 30, 0.9);
		padding: 1.5rem;
		border-radius: 12px;
		border: 1px solid rgba(212, 175, 55, 0.3);
		display: flex;
		flex-direction: column;
		gap: 12px;
		z-index: 1000;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10px);
		color: #fdfbf7;
	}

	.theme-selector {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.theme-label {
		font-size: 0.85rem;
		color: #a39c93;
	}

	.swatches {
		display: flex;
		gap: 10px;
	}

	.swatch {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		cursor: pointer;
		border: 2px solid transparent;
		transition:
			transform 0.2s,
			border-color 0.2s;
	}

	.swatch:hover {
		transform: scale(1.1);
	}

	.swatch.active {
		border-color: #fdfbf7;
		transform: scale(1.15);
		box-shadow: 0 0 8px rgba(253, 251, 247, 0.5);
	}

	.divider {
		border: none;
		border-top: 1px solid rgba(253, 251, 247, 0.1);
		margin: 4px 0;
	}

	.toggle-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.debug-label {
		font-size: 0.95rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.debug-slider {
		width: 250px;
		cursor: pointer;
	}

	.debug-slider:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.debug-time {
		font-size: 1.2rem;
		font-family: monospace;
		text-align: center;
		font-weight: bold;
	}
</style>
