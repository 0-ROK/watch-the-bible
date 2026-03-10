<script lang="ts">
	import { isDebugMode, debugSliderValue, displayTime } from '$lib/stores/clock';
	import { onMount, onDestroy } from 'svelte';

	let isVisible = false;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key.toLowerCase() === 'd') {
			isVisible = !isVisible;
		} else if (event.key.toLowerCase() === 'f') {
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen().catch((err) => {
					console.log(`Error attempting to enable full-screen mode: ${err.message}`);
				});
			} else {
				document.exitFullscreen();
			}
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeydown);
		}
	});
</script>

{#if isVisible}
	<div class="debug-panel">
		<label class="debug-label">
			<input type="checkbox" bind:checked={$isDebugMode} />
			Debug 타임라인 활성화
		</label>

		<input
			type="range"
			min="0"
			max="86399"
			bind:value={$debugSliderValue}
			disabled={!$isDebugMode}
			class="debug-slider"
		/>

		<div class="debug-time">{$displayTime.formatted}</div>
		<div class="debug-shortcut">(단축키 'd'로 창 닫기/열기, 'f'로 전체화면)</div>
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
		accent-color: #d4af37;
	}

	.debug-slider:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.debug-time {
		font-size: 1.2rem;
		font-family: monospace;
		text-align: center;
		color: #d4af37;
		font-weight: bold;
	}

	.debug-shortcut {
		font-size: 0.75rem;
		color: #a39c93;
		text-align: center;
		margin-top: -4px;
	}
</style>
