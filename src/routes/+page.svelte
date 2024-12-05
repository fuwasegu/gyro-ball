<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Ball from '../components/Ball.svelte';
	import Controls from '../components/Controls.svelte';
	import Canvas from '../components/Canvas.svelte';
	import Header from '../components/Header.svelte';
	import PermissionModal from '../components/PermissionModal.svelte';
	import { requestGyroscopePermission } from '../lib/gyroscope';
	import { calculateVelocity, updatePosition } from '../lib/physics';
	import type { BallSize, Position, Velocity } from '../types';

	let canvas: HTMLCanvasElement;
	let ball: Position = { x: 50, y: 50 };
	let paintPosition: Position = { x: 50, y: 50 };
	let velocity: Velocity = { x: 0, y: 0 };
	let ballSize: BallSize = 'medium';
	let paintedPercentage = 0;
	let isPermissionGranted = false;

	let canvasComponent: Canvas;

	const handleOrientation = (event: DeviceOrientationEvent) => {
		if (!isPermissionGranted) return;

		velocity = calculateVelocity(event.beta, event.gamma, velocity);
		ball = updatePosition(ball, velocity);
		paintPosition = ball;

		canvasComponent?.drawLine();
	};

	const handleSizeChange = (size: BallSize) => {
		ballSize = size;
	};

	const handleClear = () => {
		canvasComponent?.clearCanvas();
	};

	const handlePermissionRequest = async () => {
		isPermissionGranted = await requestGyroscopePermission();
	};

	onMount(() => {
		if (browser) {
			window.addEventListener('resize', () => canvasComponent?.initCanvas());
			window.addEventListener('deviceorientation', handleOrientation);
			canvasComponent?.initCanvas();
			return () => {
				window.removeEventListener('resize', () => canvasComponent?.initCanvas());
				window.removeEventListener('deviceorientation', handleOrientation);
			};
		}
	});
</script>

<svelte:head>
	<style>
		html,
		body {
			margin: 0;
			padding: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;
			position: fixed;
			touch-action: none;
		}
	</style>
</svelte:head>

<Header />

<div class="container">
	<Controls
		{paintedPercentage}
		currentSize={ballSize}
		onSizeChange={handleSizeChange}
		onClear={handleClear}
	/>

	<div class="game-area">
		<Canvas
			bind:this={canvasComponent}
			bind:canvas
			position={paintPosition}
			{ballSize}
			onPaintedAreaChange={(percentage) => (paintedPercentage = percentage)}
		/>
		<Ball position={ball} size={ballSize} />
	</div>
</div>

{#if !isPermissionGranted}
	<PermissionModal onRequestPermission={handlePermissionRequest} />
{/if}

<style>
	.container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
		padding: 10px;
		padding-top: 60px;
		box-sizing: border-box;
	}

	.game-area {
		width: 90vmin;
		height: 90vmin;
		border: 2px solid #333;
		border-radius: 8px;
		position: relative;
		background: #f0f0f0;
		overflow: hidden;
	}

	@media (max-height: 600px) {
		.container {
			gap: 5px;
			padding: 5px;
			padding-top: 40px;
		}

		.game-area {
			width: 85vmin;
			height: 85vmin;
		}
	}
</style>
