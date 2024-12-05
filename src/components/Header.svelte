<script lang="ts">
	// ヘッダーコンポーネント
</script>

<header>
	<h1>ボール転がし</h1>
</header>

<style>
	header {
		width: 100%;
		background: #4caf50;
		color: white;
		padding: 10px 0;
		text-align: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
	}

	h1 {
		margin: 0;
		font-size: 24px;
		font-weight: bold;
	}

	@media (max-height: 600px) {
		header {
			padding: 5px 0;
		}

		h1 {
			font-size: 20px;
		}
	}
</style>
