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
		class="cart-overlay" 
		onclick={handleOverlayClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="cart-title"
		tabindex="-1"
	>
		<div 
			class="cart-modal" 
			role="document"
		>
			<div class="cart-header">
				<h2 id="cart-title">Shopping Cart</h2>
				<button 
					class="close-btn" 
					onclick={onClose}
					aria-label="Close cart"
				>
					×
				</button>
			</div>

			{#if cart.length === 0}
				<div class="empty-cart">
					<p>Your cart is empty</p>
				</div>
			{:else}
				<div class="cart-items">
					{#each cart as item}
						<div class="cart-item">
							<img src={item.image} alt={item.title} class="item-image" />
							<div class="item-details">
								<h3 class="item-title">{item.title}</h3>
								<p class="item-price">${item.price}</p>
							</div>
							<div class="quantity-controls">
								<button 
									class="quantity-btn" 
									onclick={() => decreaseQuantity(item)}
									disabled={item.quantity <= 1}
									aria-label="Decrease quantity"
								>
									-
								</button>
								<span class="quantity" aria-label="Quantity">{item.quantity}</span>
								<button 
									class="quantity-btn" 
									onclick={() => increaseQuantity(item)}
									aria-label="Increase quantity"
								>
									+
								</button>
							</div>
							<button 
								class="remove-btn" 
								onclick={() => removeItem(item.id)}
								aria-label="Remove {item.title} from cart"
							>
								Remove
							</button>
						</div>
					{/each}
				</div>

				<div class="cart-footer">
					<div class="cart-total">
						<strong>Total: ${totalPrice.toFixed(2)}</strong>
					</div>
					<div class="cart-actions">
						<button class="clear-btn" onclick={handleClearCart}>
							Clear Cart
						</button>
						<button class="checkout-btn" onclick={() => goto('/checkout')}>
							Go to Checkout
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.cart-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.cart-modal {
		background: white;
		border-radius: 1rem;
		width: 90%;
		max-width: 600px;
		max-height: 80vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}

	.cart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e2e8f0;
		background: #f8fafc;
	}

	.cart-header h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #1e293b;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: #64748b;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background-color 0.2s;
	}

	.close-btn:hover {
		background: #e2e8f0;
	}

	.empty-cart {
		padding: 3rem;
		text-align: center;
		color: #64748b;
	}

	.cart-items {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.cart-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border-bottom: 1px solid #f1f5f9;
	}

	.cart-item:last-child {
		border-bottom: none;
	}

	.item-image {
		width: 60px;
		height: 60px;
		object-fit: contain;
		border-radius: 0.5rem;
		background: #f1f5f9;
	}

	.item-details {
		flex: 1;
	}

	.item-title {
		margin: 0 0 0.25rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #1e293b;
	}

	.item-price {
		margin: 0;
		color: #2563eb;
		font-weight: 600;
	}

	.quantity-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.quantity-btn {
		width: 2rem;
		height: 2rem;
		border: 1px solid #cbd5e1;
		background: white;
		border-radius: 0.25rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		transition: all 0.2s;
	}

	.quantity-btn:hover:enabled {
		background: #f1f5f9;
		border-color: #94a3b8;
	}

	.quantity-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.quantity {
		min-width: 2rem;
		text-align: center;
		font-weight: 600;
	}

	.remove-btn {
		padding: 0.5rem 1rem;
		border: 1px solid #ef4444;
		background: white;
		color: #ef4444;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.remove-btn:hover {
		background: #ef4444;
		color: white;
	}

	.cart-footer {
		padding: 1.5rem;
		border-top: 1px solid #e2e8f0;
		background: #f8fafc;
	}

	.cart-total {
		text-align: right;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		color: #1e293b;
	}

	.cart-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}

	.clear-btn {
		padding: 0.75rem 1.5rem;
		border: 1px solid #64748b;
		background: white;
		color: #64748b;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s;
	}

	.clear-btn:hover {
		background: #64748b;
		color: white;
	}

	.checkout-btn {
		padding: 0.75rem 1.5rem;
		border: none;
		background: #3b82f6;
		color: white;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: 600;
		transition: background 0.2s;
	}

	.checkout-btn:hover {
		background: #2563eb;
	}
</style> 