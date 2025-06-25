export const load = async ({ fetch, url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 8;
	
	const offset = (page - 1) * limit;
	
	// Get all products for search functionality
	const res = await fetch('https://fakestoreapi.com/products');
	const allProducts = await res.json();
	

	// Apply pagination
	const paginatedProducts = allProducts.slice(offset, offset + limit);
	
	return { 
		products: paginatedProducts,
		totalProducts: allProducts.length,
		currentPage: page,
		limit,
	};
};