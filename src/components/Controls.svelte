<script lang="ts">
	import type { BallSize } from '../types';

	export let paintedPercentage: number;
	export let currentSize: BallSize;
	export let onSizeChange: (size: BallSize) => void;
	export let onClear: () => void;
	export let disabled = false;
</script>

<div class="controls">
	<div class="progress">塗られた面積: {paintedPercentage}%</div>
	<div class="control-buttons">
		<div class="size-controls">
			<button
				class:active={currentSize === 'small'}
				on:click={() => onSizeChange('small')}
				aria-label="小サイズ"
				{disabled}
			>
				小
			</button>
			<button
				class:active={currentSize === 'medium'}
				on:click={() => onSizeChange('medium')}
				aria-label="中サイズ"
				{disabled}
			>
				中
			</button>
			<button
				class:active={currentSize === 'large'}
				on:click={() => onSizeChange('large')}
				aria-label="大サイズ"
				{disabled}
			>
				大
			</button>
			<button
				class:active={currentSize === 'xlarge'}
				on:click={() => onSizeChange('xlarge')}
				aria-label="特大サイズ"
				{disabled}
			>
				特大
			</button>
		</div>
		<button class="clear-button" on:click={onClear} aria-label="軌跡をリセット" {disabled}>
			リセット
		</button>
	</div>
</div>

<style>
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

	.size-controls button:disabled {
		background: #ccc;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.size-controls button:not(:disabled):hover {
		background: #f57c00;
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.size-controls button.active:not(:disabled) {
		background: #ef6c00;
		transform: scale(1.1);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
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

	.clear-button:disabled {
		background: #ccc;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.clear-button:not(:disabled):hover {
		background: #ff1744;
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.clear-button:not(:disabled):active {
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

	@media (max-height: 600px) {
		.controls {
			gap: 5px;
		}

		.size-controls button,
		.clear-button {
			height: 40px;
		}

		.size-controls button {
			width: 40px;
			font-size: 14px;
		}

		.clear-button {
			width: 80px;
		}

		.progress {
			padding: 6px 12px;
			font-size: 12px;
		}
	}
</style>
