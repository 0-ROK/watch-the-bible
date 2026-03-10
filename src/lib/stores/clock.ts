import { writable, derived } from 'svelte/store';

// 전역 시계 상태
export const currentTime = writable(new Date());

// 디버그 모드 상태
export const isDebugMode = writable(false);

// 디버그 모드 시 사용할 슬라이더 값 (0 ~ 86399 초)
export const debugSliderValue = writable(0);

// 실제 애플리케이션에서 사용할 최종 계산된 시간 정보
export const displayTime = derived(
	[currentTime, isDebugMode, debugSliderValue],
	([$currentTime, $isDebugMode, $debugSliderValue]) => {
		if ($isDebugMode) {
			const h = Math.floor($debugSliderValue / 3600);
			const m = Math.floor(($debugSliderValue % 3600) / 60);
			const s = $debugSliderValue % 60;
			return {
				hours: h,
				minutes: m,
				seconds: s,
				milliseconds: 0,
				totalSeconds: $debugSliderValue,
				is12Hour: h % 12 === 0 ? 12 : h % 12,
				formatted: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
			};
		} else {
			const h = $currentTime.getHours();
			const m = $currentTime.getMinutes();
			const s = $currentTime.getSeconds();
			const ms = $currentTime.getMilliseconds();
			const totalSec = h * 3600 + m * 60 + s + ms / 1000;
			return {
				hours: h,
				minutes: m,
				seconds: s,
				milliseconds: ms,
				totalSeconds: totalSec,
				is12Hour: h % 12 === 0 ? 12 : h % 12,
				formatted: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
			};
		}
	}
);

// 1시간(3600초) 기준 진행률 계산 (0% ~ 100%)
export const hourProgress = derived(displayTime, ($displayTime) => {
	// 현재 분/초/밀리초가 해당 시간 내에서 차지하는 비율
	const currentHourSeconds =
		$displayTime.minutes * 60 + $displayTime.seconds + $displayTime.milliseconds / 1000;
	return (currentHourSeconds / 3600) * 100;
});
