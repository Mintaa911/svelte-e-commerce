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

<div class="product-card">
    <img
        class="product-img"
        src={product.image}
        alt={product.title}
    />
    <div class="product-title">{product.title}</div>
    <div class="product-price">${product.price}</div>
    <button
        class="add-btn"
        disabled={status[product.id] === "adding"}
        onclick={() => {
            addToCart(product);
        }}
    >
        {#if status[product.id] === "adding"}Adding to cart...{/if}
        {#if status[product.id] === "added"}Added!{/if}
        {#if !status[product.id] || status[product.id] === "idle"}
        Add to Cart
        {/if}
    </button>
</div>

<style>
	.product-card {
		background: #fff;
		border-radius: 1rem;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
		padding: 1.5rem 1rem 1.5rem 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition:
			box-shadow 0.2s,
			transform 0.2s;
	}
	.product-card:hover {
		box-shadow: 0 6px 24px rgba(59, 130, 246, 0.13);
		transform: translateY(-4px) scale(1.03);
	}
	.product-img {
		width: 90px;
		height: 90px;
		object-fit: contain;
		border-radius: 0.7rem;
		margin-bottom: 1rem;
		background: #f1f5f9;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
	}
	.product-title {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		text-align: center;
		min-height: 2.5em;
	}
	.product-price {
		font-size: 1.1rem;
		color: #2563eb;
		font-weight: 700;
		margin-bottom: 1rem;
	}
	.add-btn {
		padding: 0.6rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		background: #3b82f6;
		color: #fff;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.2s;
		margin-top: auto;
	}
	.add-btn:disabled {
		background: #a5b4fc;
		cursor: not-allowed;
	}
	.add-btn:hover:enabled {
		background: #2563eb;
		transform: translateY(-2px) scale(1.04);
	}
</style>
