<script lang="ts">
	export let isSuccess: boolean;
	export let percentage: number;
	export let onClose: () => void;
</script>

<div class="modal-overlay">
	<div class="modal">
		{#if isSuccess}
			<h2>おめでとうございます！</h2>
			<p>100%塗りつぶすことができました！</p>
		{:else}
			<h2>残念！</h2>
			<p>あと{100 - percentage}%でした！</p>
		{/if}
		<button on:click={onClose}>閉じる</button>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2000;
	}

	.modal {
		background: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		max-width: 90%;
		width: 400px;
		text-align: center;
	}

	h2 {
		margin: 0 0 15px 0;
		color: #333;
		font-size: 24px;
		font-weight: bold;
	}

	p {
		margin: 0 0 20px 0;
		color: #666;
		font-size: 18px;
		line-height: 1.5;
	}

	button {
		background: #4caf50;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background: #45a049;
	}

	@media (max-height: 600px) {
		.modal {
			padding: 15px;
		}

		h2 {
			font-size: 20px;
			margin-bottom: 10px;
		}

		p {
			font-size: 16px;
			margin-bottom: 15px;
		}

		button {
			padding: 8px 16px;
			font-size: 14px;
		}
	}
</style>
