import type { Position, Velocity } from '../types';

export const FRICTION = 0.98;
export const SENSITIVITY = 0.5;

export const BALL_SIZES = {
	small: { radius: 10, lineWidth: 20 },
	medium: { radius: 20, lineWidth: 40 },
	large: { radius: 35, lineWidth: 70 },
	xlarge: { radius: 70, lineWidth: 140 }
} as const;

export function updatePosition(
	currentPosition: Position,
	velocity: Velocity,
	friction: number = FRICTION
): Position {
	const newVelocity = {
		x: velocity.x * friction,
		y: velocity.y * friction
	};

	return {
		x: Math.max(0, Math.min(100, currentPosition.x + newVelocity.x)),
		y: Math.max(0, Math.min(100, currentPosition.y + newVelocity.y))
	};
}

export function calculateVelocity(
	beta: number | null,
	gamma: number | null,
	currentVelocity: Velocity,
	sensitivity: number = SENSITIVITY,
	friction: number = FRICTION
): Velocity {
	const betaRad = beta ? beta * (Math.PI / 180) : 0;
	const gammaRad = gamma ? gamma * (Math.PI / 180) : 0;

	return {
		x: currentVelocity.x * friction + Math.sin(gammaRad) * sensitivity,
		y: currentVelocity.y * friction + Math.sin(betaRad) * sensitivity
	};
}
