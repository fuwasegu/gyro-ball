<script lang="ts">
	import type { BallSize, Position } from '../types';
	import { BALL_SIZES } from '../lib/physics';

	export let canvas: HTMLCanvasElement;
	export let position: Position;
	export let ballSize: BallSize;
	export let onPaintedAreaChange: (percentage: number) => void;

	let ctx: CanvasRenderingContext2D;
	let lastX: number;
	let lastY: number;

	export function initCanvas() {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		ctx = canvas.getContext('2d')!;
		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'black';
		lastX = (position.x / 100) * canvas.width;
		lastY = (position.y / 100) * canvas.height;
	}

	export function clearCanvas() {
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		lastX = (position.x / 100) * canvas.width;
		lastY = (position.y / 100) * canvas.height;
		onPaintedAreaChange(0);
	}

	export function drawLine() {
		if (!ctx) return;
		const currentX = (position.x / 100) * canvas.width;
		const currentY = (position.y / 100) * canvas.height;

		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(currentX, currentY);
		ctx.lineWidth = BALL_SIZES[ballSize].lineWidth * (canvas.width / 900);
		ctx.lineCap = 'round';
		ctx.stroke();

		lastX = currentX;
		lastY = currentY;

		calculatePaintedArea();
	}

	function calculatePaintedArea() {
		if (!ctx) return;
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const pixels = imageData.data;
		let paintedPixels = 0;

		for (let i = 3; i < pixels.length; i += 4) {
			if (pixels[i] > 0) paintedPixels++;
		}

		onPaintedAreaChange(Math.floor((paintedPixels / (canvas.width * canvas.height)) * 100));
	}
</script>

<canvas bind:this={canvas} class="paint-canvas"></canvas>

<style>
	.paint-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
</style>
