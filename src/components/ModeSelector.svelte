<script lang="ts">
	import type { GameMode } from '../types';

	export let currentMode: GameMode;
	export let onModeChange: (mode: GameMode) => void;
</script>

<div class="mode-selector">
	<button
		class:active={currentMode === 'free'}
		on:click={() => onModeChange('free')}
		aria-label="自由モード"
	>
		自由モード
	</button>
	<button
		class:active={currentMode === 'timeAttack'}
		on:click={() => onModeChange('timeAttack')}
		aria-label="タイムアタックモード"
	>
		タイムアタック
	</button>
</div>

<style>
	.mode-selector {
		display: flex;
		gap: 10px;
		margin: 10px 0;
	}

	button {
		background: #ff9800;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 20px;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
	}

	button:hover {
		background: #f57c00;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	button.active {
		background: #ef6c00;
		transform: scale(1.1);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
	}

	@media (max-height: 600px) {
		.mode-selector {
			gap: 8px;
			margin: 5px 0;
		}

		button {
			padding: 6px 12px;
			font-size: 12px;
		}
	}
</style>
