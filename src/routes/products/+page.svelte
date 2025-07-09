<script lang="ts">
	import ProductItem from "../../lib/components/product-item.svelte";
	import { goto } from "$app/navigation";
	
	let { data } = $props();

	let products: any[] = $state(data.products || []);
	let totalProducts = $state(data.totalProducts || 0);
	let currentPage = $state(data.currentPage || 1);
	let limit = $state(data.limit || 8);
	let search = $state("");
	let debouncedSearch = $state("");
	
	let debounceTimeout: ReturnType<typeof setTimeout>;

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
</script>



<!-- Hero Section -->
<section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="text-center">
			<h1 class="text-4xl md:text-5xl font-bold mb-6">
				Browse Our Products
			</h1>
			<p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
				Discover amazing tech products with premium quality and competitive prices. 
				Find exactly what you're looking for from our extensive collection.
			</p>
			
			<!-- Search Bar -->
			<div class="max-w-2xl mx-auto mb-8">
				<div class="relative">
					<input
						type="text"
						placeholder="Search products..."
						oninput={onSearchInput}
						value={search}
						class="w-full bg-white px-6 py-4 text-lg text-gray-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
					/>
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Products Section -->
<section class="py-16 bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Results Info -->
		<div class="text-center mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-2">
				{debouncedSearch.trim() ? 'Search Results' : 'All Products'}
			</h2>
			<p class="text-lg text-gray-600">
				{debouncedSearch.trim() ? `Found ${filteredProducts.length} products` : `Showing ${totalProducts} products`}
			</p>
		</div>

		<!-- Products Grid -->
		<div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
			{#each filteredProducts as product}
				<ProductItem product={product} />
			{/each}
		</div>

		<!-- No Results Message -->
		{#if debouncedSearch.trim() && filteredProducts.length === 0}
			<div class="text-center py-12">
				<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
				<p class="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
			</div>
		{/if}
		
		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex items-center justify-center space-x-4">
				<button 
					onclick={goToPrevPage} 
					disabled={!hasPrevPage}
					class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
				>
					Previous
				</button>
				
				<div class="flex items-center space-x-2">
					<span class="text-sm text-gray-700">
						Page {currentPage} of {totalPages}
					</span>
					<span class="text-sm text-gray-500">
						({debouncedSearch.trim() ? filteredProducts.length : totalProducts} products)
					</span>
				</div>
				
				<button 
					onclick={goToNextPage} 
					disabled={!hasNextPage}
					class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
				>
					Next
				</button>
			</div>
		{/if}
	</div>
</section>


