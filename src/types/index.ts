export type BallSize = 'small' | 'medium' | 'large';

export interface Position {
	x: number;
	y: number;
}

export interface Velocity {
	x: number;
	y: number;
}

export interface BallSizeConfig {
	radius: number;
	lineWidth: number;
}

export interface DeviceOrientationEventStatic extends EventTarget {
	requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
}
