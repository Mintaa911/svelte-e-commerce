<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { subscribeCart, removeFromCart, clearCart } from "$lib/cartService";
	import type { CartItem } from "$lib/types";
	import { goto } from "$app/navigation";

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
			checkoutCooldown = checkoutCooldown - 1;
			if (checkoutCooldown <= 0) {
				clearInterval(countdownInterval);
				checkoutCooldown = 0;
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



<!-- Hero Section -->
<section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="text-center">
			<h1 class="text-4xl md:text-5xl font-bold mb-6">
				Checkout
			</h1>
			<p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
				Review your cart and complete your purchase with our secure checkout process.
			</p>
		</div>
	</div>
</section>

<!-- Checkout Section -->
<section class="py-16 bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="bg-white rounded-lg shadow-lg p-8">
			{#if cart.length === 0 && checkoutCooldown === 0}
				<div class="text-center py-12">
					<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
					<p class="mt-1 text-sm text-gray-500">Add some products to your cart to get started.</p>
					<div class="mt-6">
						<button 
							onclick={() => goto('/products')}
							class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
						>
							Browse Products
						</button>
					</div>
				</div>
			{:else}
				<div class="space-y-6">
					<!-- Cart Items -->
					<div class="space-y-4">
						<h2 class="text-2xl font-bold text-gray-900 mb-4">Cart Items</h2>
						{#each cart as item}
							<div 
								class="flex items-center justify-between bg-gray-50 rounded-lg p-4 transition-opacity duration-200"
								class:opacity-50={deleting[item.id]}
							>
								<div class="flex-1">
									<h3 class="text-lg font-semibold text-gray-900">{item.title}</h3>
									<p class="text-sm text-gray-600">Quantity: {item.quantity}</p>
								</div>
								<div class="flex items-center space-x-4">
									<span class="text-lg font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
									<button
										class="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={deleting[item.id]}
										onclick={() => removeItem(item.id)}
									>
										{#if deleting[item.id]}
											Removing...
										{:else}
											Remove
										{/if}
									</button>
								</div>
							</div>
						{/each}
					</div>

					<!-- Total -->
					<div class="border-t pt-6">
						<div class="flex justify-between items-center">
							<span class="text-2xl font-bold text-gray-900">Total:</span>
							<span class="text-3xl font-bold text-blue-600">${total}</span>
						</div>
					</div>

					<!-- Checkout Button -->
					<div class="pt-6">
						<!-- Debug: Countdown value: {checkoutCooldown} -->
						{#if checkoutCooldown > 0}
							<button 
								disabled={true}
								class="w-full bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold text-lg cursor-not-allowed"
							>
								Checkout available in {checkoutCooldown}s
							</button>
						{:else}
							<button 
								onclick={checkout}
								class="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
							>
								Proceed to Checkout
							</button>
						{/if}
					</div>

					<!-- Success Message -->
					{#if success}
						<div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
							<div class="flex items-center">
								<svg class="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
								</svg>
								<p class="text-green-800 font-medium">Checkout successful! Your order has been placed.</p>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>
