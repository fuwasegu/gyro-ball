<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	type DeviceOrientationWithPermission = {
		requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
	};

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
	const BALL_RADIUS = 20;

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
		ctx.lineWidth = BALL_RADIUS * 3 * (canvas.width / 900);
		ctx.lineCap = 'round';
		ctx.stroke();

		lastX = currentX;
		lastY = currentY;

		calculatePaintedArea();
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

	const requestPermission = async () => {
		if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
			try {
				const permission = await (DeviceOrientationEvent as any).requestPermission();
				isPermissionGranted = permission === 'granted';
			} catch (err) {
				console.error('権限の取得に失敗しました:', err);
			}
		} else {
			isPermissionGranted = true;
		}
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
	<div class="progress">塗られた面積: {paintedPercentage}%</div>
	<div class="game-area">
		<canvas bind:this={canvas} class="paint-canvas"></canvas>
		<div class="ball" style="left: {ball.x}%; top: {ball.y}%; transform: translate(-50%, -50%);"></div>
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
		gap: 20px;
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

	.progress {
		background: #333;
		color: white;
		padding: 8px 16px;
		border-radius: 20px;
		font-size: 16px;
		font-weight: bold;
	}

	.ball {
		width: 40px;
		height: 40px;
		background: #ff4444;
		border-radius: 50%;
		position: absolute;
		transform: translate(-50%, -50%);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
</style>
