<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	type DeviceOrientationWithPermission = {
		requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
	};

	let ball: { x: number; y: number } = { x: 50, y: 50 };
	let velocity = { x: 0, y: 0 };
	const friction = 0.98;
	const sensitivity = 0.5;
	const BALL_RADIUS = 20; // ボールの半径（px）
	let ballRadiusPercent = 5; // 初期値

	// ボールの半径のパーセント値を計算
	const calculateBallRadiusPercent = () => {
		if (browser) {
			const vmin = Math.min(window.innerWidth, window.innerHeight);
			const gameAreaSize = vmin * 0.9; // 90vmin
			ballRadiusPercent = (BALL_RADIUS / gameAreaSize) * 100;
		}
	};

	let isPermissionGranted = false;

	const requestPermission = async () => {
		const DeviceOrientationWithPermission =
			DeviceOrientationEvent as unknown as DeviceOrientationWithPermission;
		if (typeof DeviceOrientationWithPermission.requestPermission === 'function') {
			try {
				const permission = await DeviceOrientationWithPermission.requestPermission();
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

		ball.x = Math.max(ballRadiusPercent, Math.min(100 - ballRadiusPercent, ball.x + velocity.x));
		ball.y = Math.max(ballRadiusPercent, Math.min(100 - ballRadiusPercent, ball.y + velocity.y));
	};

	onMount(() => {
		if (browser) {
			calculateBallRadiusPercent();
			window.addEventListener('resize', calculateBallRadiusPercent);
			window.addEventListener('deviceorientation', handleOrientation);
			return () => {
				window.removeEventListener('resize', calculateBallRadiusPercent);
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
	<div class="game-area">
		<div class="ball" style="left: {ball.x}%; top: {ball.y}%;"></div>
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
	}

	.game-area {
		width: 90vmin;
		height: 90vmin;
		border: 2px solid #333;
		border-radius: 8px;
		position: relative;
		background: #f0f0f0;
	}

	.ball {
		width: 40px; /* BALL_RADIUSの2倍 */
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
