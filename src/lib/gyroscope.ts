import type { DeviceOrientationEventStatic } from '../types';

export async function requestGyroscopePermission(): Promise<boolean> {
	const orientationEvent = DeviceOrientationEvent as unknown as DeviceOrientationEventStatic;

	if (typeof orientationEvent.requestPermission === 'function') {
		try {
			const permission = await orientationEvent.requestPermission();
			return permission === 'granted';
		} catch (err) {
			console.error('ジャイロセンサーの権限取得に失敗しました:', err);
			return false;
		}
	}

	return true;
}
