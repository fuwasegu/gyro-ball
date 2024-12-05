<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { BallSize } from '../types';

	export let ballSize: BallSize;
	export let onStart: () => void;
	export let onTimeUp: () => void;

	const TIME_LIMITS = {
		small: 10 * 60, // 10分
		medium: 5 * 60, // 5分
		large: 2 * 60, // 2分
		xlarge: 1 * 60 // 1分
	};

	let isCountingDown = false;
	let countdown = 3;
	let timeLeft = 0;
	let timerId: ReturnType<typeof setInterval> | null = null;

	$: minutes = Math.floor(timeLeft / 60);
	$: seconds = timeLeft % 60;
	$: timeLimit = Math.floor(TIME_LIMITS[ballSize] / 60);

	function startCountdown() {
		isCountingDown = true;
		countdown = 3;
		const countdownId = setInterval(() => {
			countdown--;
			if (countdown === 0) {
				clearInterval(countdownId);
				startTimer();
			}
		}, 1000);
	}

	function startTimer() {
		isCountingDown = false;
		timeLeft = TIME_LIMITS[ballSize];
		onStart();
		timerId = setInterval(() => {
			timeLeft--;
			if (timeLeft === 0) {
				stopTimer();
				onTimeUp();
			}
		}, 1000);
	}

	export function stopTimer() {
		if (timerId) {
			clearInterval(timerId);
			timerId = null;
			timeLeft = 0;
			isCountingDown = false;
		}
	}

	onDestroy(() => {
		if (timerId) clearInterval(timerId);
	});
</script>

{#if !isCountingDown && timeLeft === 0}
	<button class="start-button" on:click={startCountdown}>
		スタート（{timeLimit}分）
	</button>
{/if}

{#if isCountingDown}
	<div class="countdown">{countdown}</div>
{/if}

{#if timeLeft > 0}
	<div class="timer">
		{minutes}:{seconds.toString().padStart(2, '0')}
	</div>
{/if}

<style>
	.start-button {
		background: #4caf50;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		margin: 10px 0;
	}

	.start-button:hover {
		background: #45a049;
	}

	.countdown {
		font-size: 48px;
		font-weight: bold;
		color: #333;
		margin: 10px 0;
	}

	.timer {
		font-size: 24px;
		font-weight: bold;
		color: #333;
		margin: 10px 0;
		font-family: monospace;
	}

	@media (max-height: 600px) {
		.start-button {
			padding: 8px 16px;
			font-size: 14px;
			margin: 5px 0;
		}

		.countdown {
			font-size: 36px;
			margin: 5px 0;
		}

		.timer {
			font-size: 20px;
			margin: 5px 0;
		}
	}
</style>
