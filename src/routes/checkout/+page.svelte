<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { subscribeCart, removeFromCart, clearCart } from "$lib/cartService";
	import type { CartItem } from "$lib/types";

	let cart: CartItem[] = $state([]);
	let unsubCart: () => void;
	let success = $state(false);
	let deleting: Record<number, boolean> = $state({});
	let checkoutCooldown = $state(0);
	let countdownInterval: ReturnType<typeof setInterval>;

	onMount(() => {
		unsubCart = subscribeCart((c) => {
			cart = [...c];
		});
	});

	onDestroy(() => {
		if (unsubCart) unsubCart();
		if (countdownInterval) clearInterval(countdownInterval);
	});

	function removeItem(id: number) {
		deleting[id] = true;
		setTimeout(() => {
			removeFromCart(id);
			deleting[id] = false;
		}, 400); // Optimistic UI
	}

	function checkout() {
		if (checkoutCooldown > 0) return;
		success = true;
		clearCart();
		checkoutCooldown = 10;
		countdownInterval = setInterval(() => {
			checkoutCooldown -= 1;
			if (checkoutCooldown <= 0) {
				clearInterval(countdownInterval);
			}
		}, 1000);
		setTimeout(() => {
			success = false;
		}, 10000);
	}

	let total = $derived.by(() =>
		cart
			.reduce((sum, item) => sum + item.price * item.quantity, 0)
			.toFixed(2),
	);
</script>

<div class="checkout-container">
	<h1 style="text-align:center; margin-bottom: 2rem;">Checkout</h1>

	{#if cart.length === 0}
		<p class="empty-msg">Your cart is empty.</p>
	{:else}
		<ul class="cart-list">
			{#each cart as item}
				<li
					class="cart-item"
					style="opacity: {deleting[item.id] ? 0.5 : 1};"
				>
					<div>
						<span class="item-title">{item.title}</span>
						<span class="item-qty">x {item.quantity}</span>
					</div>
					<span class="item-total">${item.price * item.quantity}</span
					>
					<button
						class="remove-btn"
						disabled={deleting[item.id]}
						onclick={() => removeItem(item.id)}
					>
						{#if deleting[item.id]}
							Removing...
						{:else}
							Remove
						{/if}
					</button>
				</li>
			{/each}
		</ul>
		<div class="total-row">
			Total: ${total}
		</div>
	{/if}
	{#if cart.length > 0}
		<button class="checkout-btn" onclick={checkout}> Checkout </button>
	{/if}
	{#if checkoutCooldown > 0}
		<button disabled ={ checkoutCooldown > 0} class="checkout-btn" onclick={checkout}> Checkout available in {checkoutCooldown}s </button>
	{/if}

	{#if success}
		<p class="success-msg">Checkout successful!</p>
	{/if}
</div>

<style>
	.checkout-container {
		max-width: 600px;
		margin: 2.5rem auto;
		padding: 2.5rem 2rem 2rem 2rem;
		background: #f8fafc;
		border-radius: 1.2rem;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
	}
	.cart-list {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem 0;
		max-height: 60vh;

		overflow-y: auto;
	}
	.cart-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		border-radius: 0.8rem;
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
		margin-bottom: 1.1rem;
		padding: 1.1rem 1.2rem;
		transition: opacity 0.2s;
	}
	.cart-item .item-title {
		font-weight: 600;
		font-size: 1.05rem;
		margin-bottom: 0.2rem;
	}
	.cart-item .item-qty {
		font-size: 0.98rem;
		color: #64748b;
		margin-left: 0.5rem;
	}
	.cart-item .item-total {
		font-weight: 600;
		color: #2563eb;
		margin-left: 1.2rem;
	}
	.remove-btn {
		padding: 0.4rem 1.1rem;
		border: none;
		border-radius: 0.4rem;
		background: #f87171;
		color: #fff;
		font-size: 0.98rem;
		font-weight: 500;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.2s;
		margin-left: 1.2rem;
	}
	.remove-btn:disabled {
		background: #fca5a5;
		cursor: not-allowed;
	}
	.remove-btn:hover:enabled {
		background: #dc2626;
		transform: translateY(-2px) scale(1.04);
	}
	.total-row {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 1.7rem;
		font-size: 1.2rem;
		font-weight: 700;
		color: #2563eb;
	}
	.checkout-btn {
		padding: 0.8rem 2.2rem;
		border: none;
		border-radius: 0.6rem;
		background: #3b82f6;
		color: #fff;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.2s;
		display: block;
		margin: 0 auto;
	}
	.checkout-btn:disabled {
		background: #a5b4fc;
		cursor: not-allowed;
	}
	.checkout-btn:hover:enabled {
		background: #2563eb;
		transform: translateY(-2px) scale(1.04);
	}
	.success-msg {
		color: #16a34a;
		text-align: center;
		margin-top: 1.5rem;
		font-size: 1.1rem;
		font-weight: 600;
	}
	.empty-msg {
		color: #64748b;
		text-align: center;
		margin: 2.5rem 0 1.5rem 0;
		font-size: 1.1rem;
	}
</style>
