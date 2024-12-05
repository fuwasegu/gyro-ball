<script lang="ts">
	import type { BallSize, Position } from '../types';
	import { BALL_SIZES } from '../lib/physics';

	export let position: Position;
	export let size: BallSize;
</script>

<div
	class="ball"
	style="
		left: {position.x}%;
		top: {position.y}%;
		width: {BALL_SIZES[size].radius * 2}px;
		height: {BALL_SIZES[size].radius * 2}px;
	"
></div>

<style>
	.ball {
		background: #ff4444;
		border-radius: 50%;
		position: absolute;
		transform: translate(-50%, -50%);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		transition:
			width 0.3s ease,
			height 0.3s ease;
	}
</style>
