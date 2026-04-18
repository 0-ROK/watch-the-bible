import { writable, derived } from 'svelte/store';

// 전역 시계 상태
export const currentTime = writable(new Date());

// 네트워크 시간 사용 여부 (true: 현재 시스템 시간, false: 수동 디버그 시간)
export const useNetworkTime = writable(true);

// 설정 옵션 스토어
export const showMinuteScale = writable(true); // 분침 표시 여부
export const showVerseInfo = writable(true); // 성경 구절 정보 표시 여부
export const showClock = writable(true); // 시계 표시 여부
export const isDarkMode = writable(false); // 다크 모드 활성화 여부

// 디버그 모드 시 사용할 슬라이더 값 (0 ~ 86399 초)
export const debugSliderValue = writable(0);

// 색상 테마 정의
export const themeColors = [
	{ name: '금색 (Original)', hex: '#d4af37' },
	{ name: '세지 그린 (Sage Green)', hex: '#7ca48b' },
	{ name: '버건디 (Burgundy)', hex: '#8b3a3a' },
	{ name: '스틸 블루 (Steel Blue)', hex: '#4682b4' },
	{ name: '테라코타 (Terracotta)', hex: '#e2725b' }
];

// 현재 선택된 테마 색상 (초기값: 세지 그린)
export const themeColor = writable(themeColors[1].hex);

// 실제 애플리케이션에서 사용할 최종 계산된 시간 정보
export const displayTime = derived(
	[currentTime, useNetworkTime, debugSliderValue],
	([$currentTime, $useNetworkTime, $debugSliderValue]) => {
		if (!$useNetworkTime) {
			const totalSec = $debugSliderValue;
			const h = Math.floor(totalSec / 3600);
			const m = Math.floor((totalSec % 3600) / 60);
			const s = Math.floor(totalSec % 60);
			const ms = Math.round((totalSec % 1) * 1000);
			return {
				hours: h,
				minutes: m,
				seconds: s,
				milliseconds: ms,
				totalSeconds: totalSec,
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
