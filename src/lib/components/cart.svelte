<script lang="ts">
	import { subscribeCart, updateQuantity, removeFromCart, clearCart } from "$lib/cartService";
	import { onMount, onDestroy } from "svelte";
	import type { CartItem } from "$lib/types";
	import { goto } from "$app/navigation";
	
	let { isOpen = false, onClose } = $props<{ isOpen: boolean; onClose: () => void }>();
	
	let cart: CartItem[] = $state([]);
	let unsubCart: () => void;

	onMount(() => {
		unsubCart = subscribeCart((c) => {
			cart = c;
		});
	});

	onDestroy(() => {
		if (unsubCart) unsubCart();
	});

	function increaseQuantity(item: CartItem) {
		updateQuantity(item.id, item.quantity + 1);
	}

	function decreaseQuantity(item: CartItem) {
		updateQuantity(item.id, item.quantity - 1);
	}

	function removeItem(productId: number) {
		removeFromCart(productId);
	}

	function handleClearCart() {
		clearCart();
	}

	function handleOverlayClick(e: Event) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}

	let totalPrice = $derived.by(() => {
		return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
	});
</script>

{#if isOpen}
	<div 
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
		onclick={handleOverlayClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="cart-title"
		tabindex="-1"
	>
		<div 
			class="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
			role="document"
		>
			<div class="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
				<h2 id="cart-title" class="text-xl font-bold text-gray-900">Shopping Cart</h2>
				<button 
					class="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors"
					onclick={onClose}
					aria-label="Close cart"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			{#if cart.length === 0}
				<div class="flex flex-col items-center justify-center py-12">
					<svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
					</svg>
					<p class="text-gray-500 text-lg">Your cart is empty</p>
					<button 
						onclick={onClose}
						class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
					>
						Continue Shopping
					</button>
				</div>
			{:else}
				<div class="flex-1 overflow-y-auto p-6">
					{#each cart as item}
						<div class="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
							<img 
								src={item.image} 
								alt={item.title} 
								class="w-16 h-16 object-cover rounded-lg bg-gray-100"
							/>
							<div class="flex-1 min-w-0">
								<h3 class="text-sm font-semibold text-gray-900 truncate">{item.title}</h3>
								<p class="text-blue-600 font-semibold">${item.price}</p>
							</div>
							<div class="flex items-center gap-2">
								<button 
									class="w-8 h-8 border border-gray-300 bg-white rounded flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									onclick={() => decreaseQuantity(item)}
									disabled={item.quantity <= 1}
									aria-label="Decrease quantity"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
									</svg>
								</button>
								<span class="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
								<button 
									class="w-8 h-8 border border-gray-300 bg-white rounded flex items-center justify-center text-gray-600 hover:bg-gray-50"
									onclick={() => increaseQuantity(item)}
									aria-label="Increase quantity"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
									</svg>
								</button>
							</div>
							<button 
								class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
								onclick={() => removeItem(item.id)}
								aria-label="Remove {item.title} from cart"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
								</svg>
							</button>
						</div>
					{/each}
				</div>

				<div class="p-6 border-t border-gray-200 bg-gray-50">
					<div class="flex justify-between items-center mb-4">
						<span class="text-lg font-semibold text-gray-900">Total:</span>
						<span class="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
					</div>
					<div class="flex gap-3">
						<button 
							class="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
							onclick={handleClearCart}
						>
							Clear Cart
						</button>
						<button 
							class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
							onclick={() => goto('/checkout')}
						>
							Go to Checkout
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if} 