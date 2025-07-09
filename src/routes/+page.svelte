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

	// Sample products data
	const featuredProducts = [
		{
			id: 1,
			name: "Premium Wireless Headphones",
			price: "$299.99",
			image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
			rating: 4.8,
			reviews: 1247
		},
		{
			id: 2,
			name: "Smart Fitness Watch",
			price: "$199.99",
			image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
			rating: 4.6,
			reviews: 892
		},
		{
			id: 3,
			name: "Ultra HD Camera",
			price: "$599.99",
			image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
			rating: 4.9,
			reviews: 567
		},
		{
			id: 4,
			name: "Portable Speaker",
			price: "$149.99",
			image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
			rating: 4.7,
			reviews: 1034
		}
	];
</script>



<!-- Hero Section -->
<section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
		<div class="text-center">
			<h1 class="text-4xl md:text-6xl font-bold mb-6">
				Discover Amazing Tech Products
			</h1>
			<p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
				Shop the latest in technology with premium quality products and exceptional customer service. 
				Join <span class="font-bold text-3xl md:text-4xl text-white">{activeUsers}</span> active shoppers today!
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<button 
					onclick={() => goto('/products')}
					class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
				>
					Shop Now
				</button>
				<button 
					onclick={() => goto('/checkout')}
					class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300 transform hover:scale-105"
				>
					View Checkout
				</button>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="py-16 bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose TechStore?</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				We offer the best selection of tech products with competitive prices and excellent customer support.
			</p>
		</div>
		<div class="grid md:grid-cols-3 gap-8">
			<div class="text-center p-6">
				<div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
					</svg>
				</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
				<p class="text-gray-600">All our products are carefully selected and tested for quality assurance.</p>
			</div>
			<div class="text-center p-6">
				<div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
				<p class="text-gray-600">Get your products delivered within 2-3 business days with free shipping.</p>
			</div>
			<div class="text-center p-6">
				<div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"></path>
					</svg>
				</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
				<p class="text-gray-600">Our customer support team is available round the clock to help you.</p>
			</div>
		</div>
	</div>
</section>

<!-- Featured Products Section -->
<section class="py-16 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h2 class="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				Discover our most popular tech products that customers love
			</p>
		</div>
		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each featuredProducts as product}
				<div class="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
					<img src={product.image} alt={product.name} class="w-full h-48 object-cover rounded-t-lg">
					<div class="p-4">
						<h3 class="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
						<div class="flex gap-4 items-center mb-2">
							<div class="flex">
								<div class="flex text-yellow-400">
									{#each Array(5) as _, i}
										<svg class="w-4 h-4 {i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
										</svg>
									{/each}
								</div>
								<span class="text-sm text-gray-600 ml-2">({product.reviews})</span>
							</div>
							<span class="text-2xl font-bold text-blue-600 ml-auto">{product.price}</span>
						</div>

					</div>
				</div>
			{/each}
		</div>
		<div class="text-center mt-8">
			<button 
				onclick={() => goto('/products')}
				class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
			>
				View All Products
			</button>
		</div>
	</div>
</section>

<!-- Newsletter Section -->
<section class="bg-gray-900 text-white py-16">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
		<p class="text-lg text-gray-300 mb-8">
			Subscribe to our newsletter for the latest product releases and exclusive offers
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
			<input 
				type="email" 
				placeholder="Enter your email" 
				class="bg-white flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
			<button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
				Subscribe
			</button>
		</div>
	</div>
</section>


