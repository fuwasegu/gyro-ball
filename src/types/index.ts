export type BallSize = 'small' | 'medium' | 'large' | 'xlarge';
export type GameMode = 'free' | 'timeAttack';

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

export interface TimeLimit {
	small: number;
	medium: number;
	large: number;
	xlarge: number;
}
