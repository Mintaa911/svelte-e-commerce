<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	
	let activeUsers = Math.floor(Math.random() * 100) + 1;
	let interval: ReturnType<typeof setInterval>;

	function updateUsers() {
		activeUsers = Math.floor(Math.random() * 100) + 1;
	}

	interval = setInterval(updateUsers, 5000);

	onDestroy(() => clearInterval(interval));


</script>

<style>
.home-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 80vh;
}
.card {
	background: #fff;
	padding: 2rem 3rem;
	border-radius: 1rem;
	box-shadow: 0 4px 24px rgba(0,0,0,0.08);
	text-align: center;
}
.buttons {
	display: flex;
	gap: 1.5rem;
	margin-top: 1.5rem;
	justify-content: center;
}
button {
	padding: 0.75rem 2rem;
	border: none;
	border-radius: 0.5rem;
	background: #3b82f6;
	color: #fff;
	font-size: 1.1rem;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s, transform 0.2s;
}
button:hover {
	background: #2563eb;
	transform: translateY(-2px) scale(1.04);
}
</style>

<div class="home-container">
	<div class="card">
		<h1 style="margin-bottom: 1rem;">Welcome to Svelte E-Commerce</h1>
		<div style="margin-bottom: 1.5rem; font-size: 1.2rem;">
			<strong>Active users:</strong> {activeUsers}
		</div>
		<div class="buttons">
			<button onclick={() => goto('/products')}>Products</button>
			<button onclick={() => goto('/checkout')}>Checkout</button>
		</div>
	</div>
</div>
