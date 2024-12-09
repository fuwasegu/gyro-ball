<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Ball from '../components/Ball.svelte';
	import Controls from '../components/Controls.svelte';
	import Canvas from '../components/Canvas.svelte';
	import Header from '../components/Header.svelte';
	import PermissionModal from '../components/PermissionModal.svelte';
	import ModeSelector from '../components/ModeSelector.svelte';
	import TimeAttack from '../components/TimeAttack.svelte';
	import ResultModal from '../components/ResultModal.svelte';
	import { requestGyroscopePermission } from '../lib/gyroscope';
	import { calculateVelocity, updatePosition } from '../lib/physics';
	import type { BallSize, Position, Velocity, GameMode } from '../types';

	let canvas: HTMLCanvasElement;
	let ball: Position = { x: 50, y: 50 };
	let paintPosition: Position = { x: 50, y: 50 };
	let velocity: Velocity = { x: 0, y: 0 };
	let ballSize: BallSize = 'medium';
	let paintedPercentage = 0;
	let isPermissionGranted = false;
	let gameMode: GameMode = 'free';
	let showResultModal = false;
	let isGameSuccess = false;
	let isTimeAttackActive = false;
	let timeAttackComponent: TimeAttack;

	let canvasComponent: Canvas;

	const handleOrientation = (event: DeviceOrientationEvent) => {
		if (!isPermissionGranted || (gameMode === 'timeAttack' && !isTimeAttackActive)) return;

		velocity = calculateVelocity(event.beta, event.gamma, velocity);
		ball = updatePosition(ball, velocity);
		paintPosition = ball;

		canvasComponent?.drawLine();
	};

	const handleSizeChange = (size: BallSize) => {
		if (gameMode === 'timeAttack' && isTimeAttackActive) return;
		ballSize = size;
	};

	const handleClear = () => {
		if (gameMode === 'timeAttack' && isTimeAttackActive) return;
		canvasComponent?.clearCanvas();
	};

	const handlePermissionRequest = async () => {
		isPermissionGranted = await requestGyroscopePermission();
	};

	const handleModeChange = (mode: GameMode) => {
		if (isTimeAttackActive) return;
		gameMode = mode;
		canvasComponent?.clearCanvas();
		ball = { x: 50, y: 50 };
		paintPosition = { x: 50, y: 50 };
		velocity = { x: 0, y: 0 };
	};

	const handleTimeAttackStart = () => {
		isTimeAttackActive = true;
		ball = { x: 50, y: 50 };
		paintPosition = { x: 50, y: 50 };
		velocity = { x: 0, y: 0 };
		canvasComponent?.clearCanvas();
	};

	const handleTimeUp = () => {
		isTimeAttackActive = false;
		isGameSuccess = paintedPercentage >= 100;
		showResultModal = true;
	};

	$: if (paintedPercentage >= 100) {
		if (gameMode === 'free') {
			isGameSuccess = true;
			showResultModal = true;
		} else if (gameMode === 'timeAttack' && isTimeAttackActive) {
			isTimeAttackActive = false;
			isGameSuccess = true;
			showResultModal = true;
			timeAttackComponent?.stopTimer();
		}
	}

	const handleResultModalClose = () => {
		showResultModal = false;
		canvasComponent?.clearCanvas();
		ball = { x: 50, y: 50 };
		paintPosition = { x: 50, y: 50 };
		velocity = { x: 0, y: 0 };
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
	<title>ボール転がし</title>
</svelte:head>

<Header />

<div class="container">
	<ModeSelector currentMode={gameMode} onModeChange={handleModeChange} />

	<Controls
		{paintedPercentage}
		currentSize={ballSize}
		onSizeChange={handleSizeChange}
		onClear={handleClear}
		disabled={gameMode === 'timeAttack' && isTimeAttackActive}
	/>

	{#if gameMode === 'timeAttack'}
		<TimeAttack
			bind:this={timeAttackComponent}
			{ballSize}
			onStart={handleTimeAttackStart}
			onTimeUp={handleTimeUp}
		/>
	{/if}

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

{#if showResultModal}
	<ResultModal
		isSuccess={isGameSuccess}
		percentage={paintedPercentage}
		onClose={handleResultModalClose}
	/>
{/if}

<style>
	.container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		gap: 10px;
		padding: 10px;
		padding-top: 50px;
		box-sizing: border-box;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.game-area {
		width: 90vmin;
		height: 90vmin;
		border: 2px solid #333;
		border-radius: 8px;
		position: relative;
		background: #f0f0f0;
		overflow: hidden;
		margin-bottom: 10px;
	}

	@media (max-height: 600px) {
		.container {
			gap: 5px;
			padding: 5px;
			padding-top: 35px;
		}

		.game-area {
			width: 85vmin;
			height: 85vmin;
			margin-bottom: 5px;
		}
	}
</style>
