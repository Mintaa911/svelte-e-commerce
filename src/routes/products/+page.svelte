<script lang="ts">
	import ProductItem from "./product-item.svelte";
	import Cart from "./cart.svelte";
	import { goto } from "$app/navigation";
	import { subscribeCart } from "$lib/cartService";
	import { onMount, onDestroy } from "svelte";
	import type { CartItem } from "$lib/types";
	
	let { data } = $props();

	let products: any[] = $state(data.products || []);
	let totalProducts = $state(data.totalProducts || 0);
	let currentPage = $state(data.currentPage || 1);
	let limit = $state(data.limit || 8);
	let search = $state("");
	let debouncedSearch = $state("");
	let isCartOpen = $state(false);
	let cart: CartItem[] = $state([]);
	let unsubCart: () => void;
	
	let debounceTimeout: ReturnType<typeof setTimeout>;

	onMount(() => {
		unsubCart = subscribeCart((c) => {
			cart = c;
		});
	});

	onDestroy(() => {
		if (unsubCart) unsubCart();
	});

	function onSearchInput(e: Event) {
		const target = e.target as HTMLInputElement;
		search = target.value;
		
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			debouncedSearch = search;
		}, 300);
	}

	function navigateToPage(page: number, searchTerm: string = search) {
		const params = new URLSearchParams();
		if (page > 1) params.set('page', page.toString());
		
		const url = params.toString() ? `?${params.toString()}` : '';
		goto(`/products${url}`);
	}

	function goToNextPage() {
		if (currentPage * limit < totalProducts) {
			navigateToPage(currentPage + 1);
		}
	}

	function goToPrevPage() {
		if (currentPage > 1) {
			navigateToPage(currentPage - 1);
		}
	}

	function openCart() {
		isCartOpen = true;
	}

	function closeCart() {
		isCartOpen = false;
	}

	// Update local state when data changes
	$effect(() => {
		products = data.products || [];
		totalProducts = data.totalProducts || 0;
		currentPage = data.currentPage || 1;
	});
	
	// Client-side filtered products
	let filteredProducts = $derived.by(() => {
		if (!debouncedSearch.trim()) return products;
		return products.filter((product) =>
			product.title.toLowerCase().includes(debouncedSearch.toLowerCase())
		);
	});
	
	// Reactive pagination calculations based on filtered products
	let totalPages = $derived.by(() => {
		if (debouncedSearch.trim()) {
			return Math.ceil(filteredProducts.length / limit);
		} else {
			return Math.ceil(totalProducts / limit);
		}
	});
	let hasNextPage = $derived.by(() => currentPage < totalPages);
	let hasPrevPage = $derived.by(() => currentPage > 1);

	// Cart item count
	let cartItemCount = $derived.by(() => {
		return cart.reduce((sum, item) => sum + item.quantity, 0);
	});
</script>

<div class="products-container">
	<div class="header">
		<h1 style="text-align:center; margin-bottom: 2rem;">Products</h1>
		<button class="cart-button" onclick={openCart}>
			🛒 Cart ({cartItemCount})
		</button>
	</div>
	
	<div class="search-bar">
		<input
			type="text"
			placeholder="Search products..."
			oninput={onSearchInput}
			value={search}
		/>
	</div>

	<div class="products-grid">
		{#each filteredProducts as product}
			<ProductItem product={product} />
		{/each}
	</div>
	
	<!-- Pagination -->
	<div class="pagination">
		<button disabled={!hasPrevPage} onclick={goToPrevPage}>Prev</button>
		<span>Page {currentPage} of {totalPages} ({debouncedSearch.trim() ? filteredProducts.length : totalProducts} products)</span>
		<button disabled={!hasNextPage} onclick={goToNextPage}>Next</button>
	</div>
</div>

<!-- Cart Modal -->
<Cart isOpen={isCartOpen} onClose={closeCart} />

<style>
	.products-container {
		max-width: 1100px;
		margin: 2rem auto;
		padding: 2rem;
		background: #f8fafc;
		border-radius: 1rem;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.header h1 {
		margin: 0;
		flex: 1;
		text-align: center;
	}

	.cart-button {
		padding: 0.75rem 1.5rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s, transform 0.2s;
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
	}

	.cart-button:hover {
		background: #2563eb;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
	}

	.search-bar {
		margin-bottom: 2rem;
		display: flex;
		justify-content: center;
	}
	input[type="text"],
	input[placeholder] {
		padding: 0.7rem 1.2rem;
		border-radius: 0.5rem;
		border: 1px solid #cbd5e1;
		font-size: 1rem;
		width: 350px;
		transition: border 0.2s;
		outline: none;
	}
	input[type="text"]:focus {
		border: 1.5px solid #3b82f6;
	}
	.products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}
	.pagination {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 2rem;
	}
	.pagination button {
		padding: 0.5rem 1.2rem;
		border-radius: 0.4rem;
		border: none;
		background: #e0e7ef;
		color: #222;
		font-weight: 500;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}
	.pagination button:disabled {
		background: #f1f5f9;
		color: #b0b0b0;
		cursor: not-allowed;
	}
	.pagination button:hover:enabled {
		background: #c7d2fe;
	}
</style>
