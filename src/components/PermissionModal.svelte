<script lang="ts">
	export let onRequestPermission: () => void;
</script>

<div class="modal-overlay">
	<div class="modal">
		<h2>ジャイロセンサーの使用許可</h2>
		<p>
			このアプリはジャイロセンサーを使用してボールを操作します。<br />
			続けるにはジャイロセンサーへのアクセスを許可してください。
		</p>
		<button on:click={onRequestPermission}>許可する</button>
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
		font-size: 20px;
	}

	p {
		margin: 0 0 20px 0;
		color: #666;
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
			font-size: 18px;
			margin-bottom: 10px;
		}

		p {
			font-size: 14px;
			margin-bottom: 15px;
		}

		button {
			padding: 8px 16px;
			font-size: 14px;
		}
	}
</style>
