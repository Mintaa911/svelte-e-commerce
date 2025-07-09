<script lang="ts">
	import { subscribeCart } from "$lib/cartService";
	import { onMount, onDestroy } from "svelte";
	import type { CartItem } from "$lib/types";
	import { goto } from "$app/navigation";
	
	let cart: CartItem[] = $state([]);
	let unsubCart: () => void;
	let currentPath = $state("");
	
	onMount(() => {
		unsubCart = subscribeCart((c) => {
			cart = c;
		});
		
		// Get current path for active link highlighting
		if (typeof window !== 'undefined') {
			currentPath = window.location.pathname;
		}
	});

	onDestroy(() => {
		if (unsubCart) unsubCart();
	});

	function openCart() {
		// This will be handled by the parent component
		// For now, we'll navigate to checkout
		goto('/checkout');
	}

	// Cart item count
	let cartItemCount = $derived.by(() => {
		return cart.reduce((sum, item) => sum + item.quantity, 0);
	});

	function isActive(path: string): boolean {
		return currentPath === path;
	}
</script>

<nav class="bg-white shadow-lg sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<div class="flex items-center">
				<h1 class="md:text-2xl font-bold text-gray-900">TechStore</h1>
			</div>
			<div class="">
				<div class="ml-10 flex items-baseline space-x-4">
					<a 
						href="/" 
						class="px-3 py-2 rounded-md text-sm font-medium transition-colors {isActive('/') ? 'text-gray-900' : 'text-gray-500 hover:text-blue-600'}"
					>
						Home
					</a>
					<a 
						href="/products" 
						class="px-3 py-2 rounded-md text-sm font-medium transition-colors {isActive('/products') ? 'text-gray-900' : 'text-gray-500 hover:text-blue-600'}"
					>
						Products
					</a>
					<a 
						href="/checkout" 
						class="px-3 py-2 rounded-md text-sm font-medium transition-colors {isActive('/checkout') ? 'text-gray-900' : 'text-gray-500 hover:text-blue-600'}"
					>
						Checkout
					</a>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<button 
					onclick={openCart}
					class="text-gray-500 hover:text-blue-600 relative transition-colors" 
					aria-label="Cart"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart">
						<circle cx="8" cy="21" r="1"/>
						<circle cx="19" cy="21" r="1"/>
						<path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
					</svg>
					{#if cartItemCount > 0}
						<span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
							{cartItemCount}
						</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
</nav> 