<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	type BallSize = 'small' | 'medium' | 'large';

	interface DeviceOrientationEventStatic extends EventTarget {
		requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
	}

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let lastX: number;
	let lastY: number;
	let paintedPercentage = 0;

	let ball: { x: number; y: number } = { x: 50, y: 50 };
	let paintPosition: { x: number; y: number } = { x: 50, y: 50 };
	let velocity = { x: 0, y: 0 };
	const friction = 0.98;
	const sensitivity = 0.5;

	let ballSize: BallSize = 'medium';
	const BALL_SIZES = {
		small: { radius: 10, lineWidth: 20 },
		medium: { radius: 20, lineWidth: 40 },
		large: { radius: 35, lineWidth: 70 }
	};

	const changeBallSize = (size: BallSize) => {
		ballSize = size;
	};

	let isPermissionGranted = false;

	const initCanvas = () => {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		ctx = canvas.getContext('2d')!;
		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'black';
		lastX = (paintPosition.x / 100) * canvas.width;
		lastY = (paintPosition.y / 100) * canvas.height;
	};

	const calculatePaintedArea = () => {
		if (!ctx) return;
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const pixels = imageData.data;
		let paintedPixels = 0;

		for (let i = 3; i < pixels.length; i += 4) {
			if (pixels[i] > 0) paintedPixels++;
		}

		paintedPercentage = Math.floor((paintedPixels / (canvas.width * canvas.height)) * 100);
	};

	const drawLine = () => {
		if (!ctx) return;
		const currentX = (paintPosition.x / 100) * canvas.width;
		const currentY = (paintPosition.y / 100) * canvas.height;

		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(currentX, currentY);
		ctx.lineWidth = BALL_SIZES[ballSize].lineWidth * (canvas.width / 900);
		ctx.lineCap = 'round';
		ctx.stroke();

		lastX = currentX;
		lastY = currentY;

		calculatePaintedArea();
	};

	const requestPermission = async () => {
		const orientationEvent = DeviceOrientationEvent as unknown as DeviceOrientationEventStatic;
		if (typeof orientationEvent.requestPermission === 'function') {
			try {
				const permission = await orientationEvent.requestPermission();
				isPermissionGranted = permission === 'granted';
			} catch (err) {
				console.error('権限の取得に失敗しました:', err);
			}
		} else {
			isPermissionGranted = true;
		}
	};

	const handleOrientation = (event: DeviceOrientationEvent) => {
		if (!isPermissionGranted) return;

		const beta = event.beta ? event.beta * (Math.PI / 180) : 0;
		const gamma = event.gamma ? event.gamma * (Math.PI / 180) : 0;

		velocity.x += Math.sin(gamma) * sensitivity;
		velocity.y += Math.sin(beta) * sensitivity;

		velocity.x *= friction;
		velocity.y *= friction;

		ball.x = Math.max(0, Math.min(100, ball.x + velocity.x));
		ball.y = Math.max(0, Math.min(100, ball.y + velocity.y));

		paintPosition.x = ball.x;
		paintPosition.y = ball.y;

		drawLine();
	};

	const clearCanvas = () => {
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		paintedPercentage = 0;
		lastX = (ball.x / 100) * canvas.width;
		lastY = (ball.y / 100) * canvas.height;
	};

	onMount(() => {
		if (browser) {
			window.addEventListener('resize', initCanvas);
			window.addEventListener('deviceorientation', handleOrientation);
			initCanvas();
			return () => {
				window.removeEventListener('resize', initCanvas);
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

<div class="container">
	{#if !isPermissionGranted}
		<button on:click={requestPermission}>ジャイロセンサーへのアクセスを許可する</button>
	{/if}
	<div class="controls">
		<div class="progress">塗られた面積: {paintedPercentage}%</div>
		<div class="control-buttons">
			<div class="size-controls">
				<button
					class:active={ballSize === 'small'}
					on:click={() => changeBallSize('small')}
					aria-label="小サイズ"
				>
					小
				</button>
				<button
					class:active={ballSize === 'medium'}
					on:click={() => changeBallSize('medium')}
					aria-label="中サイズ"
				>
					中
				</button>
				<button
					class:active={ballSize === 'large'}
					on:click={() => changeBallSize('large')}
					aria-label="大サイズ"
				>
					大
				</button>
			</div>
			<button class="clear-button" on:click={clearCanvas} aria-label="軌跡をリセット">
				リセット
			</button>
		</div>
	</div>
	<div class="game-area">
		<canvas bind:this={canvas} class="paint-canvas"></canvas>
		<div
			class="ball"
			style="
				left: {ball.x}%; 
				top: {ball.y}%; 
				transform: translate(-50%, -50%);
				width: {BALL_SIZES[ballSize].radius * 2}px;
				height: {BALL_SIZES[ballSize].radius * 2}px;
			"
		></div>
	</div>
</div>

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
		box-sizing: border-box;
	}

	.controls {
		width: 100%;
		max-width: 90vmin;
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
	}

	.control-buttons {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		padding: 0 10px;
	}

	.size-controls {
		display: flex;
		gap: 8px;
	}

	.size-controls button {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background: #ff9800;
		color: white;
		border: none;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		transition: all 0.3s ease;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
	}

	.size-controls button:hover {
		background: #f57c00;
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.size-controls button.active {
		background: #ef6c00;
		transform: scale(1.1);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
	}

	.ball {
		background: #ff4444;
		border-radius: 50%;
		position: absolute;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		transition:
			width 0.3s ease,
			height 0.3s ease;
	}

	button {
		margin-bottom: 20px;
		padding: 10px 20px;
		font-size: 16px;
		background: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background: #45a049;
	}

	.clear-button {
		width: 90px;
		height: 45px;
		border-radius: 22.5px;
		background: #ff5252;
		color: white;
		border: none;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		transition: all 0.3s ease;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
		white-space: nowrap;
	}

	.clear-button:hover {
		background: #ff1744;
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.clear-button:active {
		transform: translateY(0);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.progress {
		background: #333;
		color: white;
		padding: 8px 16px;
		border-radius: 20px;
		font-size: 14px;
		font-weight: bold;
		white-space: nowrap;
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

	.paint-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	@media (max-height: 600px) {
		.container {
			gap: 5px;
			padding: 5px;
		}

		.controls {
			gap: 5px;
		}

		.size-controls button,
		.clear-button {
			height: 40px;
		}

		.size-controls button {
			width: 40px;
		}

		.clear-button {
			width: 80px;
		}

		.progress {
			padding: 6px 12px;
			font-size: 12px;
		}

		.game-area {
			width: 85vmin;
			height: 85vmin;
		}
	}
</style>
