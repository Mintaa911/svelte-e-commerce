<script lang="ts">
    import { addToCart, subscribeStatus } from "$lib/cartService";
	import { onMount, onDestroy } from "svelte";
	import type { CartStatus } from "$lib/types";

    let { product } = $props();
    let status: CartStatus = $state({});
	let unsubStatus: () => void;

	onMount(() => {
		
		unsubStatus = subscribeStatus((s) => {
			status = { ...s };
		});
	});

	onDestroy(() => {
		if (unsubStatus) unsubStatus();
	});

</script>

<div class="flex flex-col justify-between bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
	<img 
		src={product.image} 
		alt={product.title} 
		class="w-full h-48 object-cover rounded-t-lg"
	/>
	<div class="p-4">
		<h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
		<div class="flex justify-between items-center mb-4">
			<span class="text-2xl font-bold text-blue-600">${product.price}</span>
			{#if product.rating}
				<div class="flex items-center">
					<div class="flex text-yellow-400">
						{#each Array(5) as _, i}
							<svg class="w-4 h-4 {i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
							</svg>
						{/each}
					</div>
					{#if product.reviews}
						<span class="text-sm text-gray-600 ml-2">({product.reviews})</span>
					{/if}
				</div>
			{/if}
		</div>
		
		<div class="">
			<button
			class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={status[product.id] === "adding"}
			onclick={() => {
				addToCart(product);
			}}
		>
			{#if status[product.id] === "adding"}
				<div class="flex items-center justify-center">
					<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Adding...
				</div>
			{:else if status[product.id] === "added"}
				<div class="flex items-center justify-center">
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
					</svg>
					Added!
				</div>
			{:else}
				Add to Cart
			{/if}
		</button>
		</div>
	</div>
</div>


