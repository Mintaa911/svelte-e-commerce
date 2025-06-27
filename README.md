Assessment Task
Create an e-commerce app with Svelte 5 including the following features:
1. Homepage
● Two buttons: "Products" and "Checkout"
● Display a live counter of active users (simulate with random updates every 5
seconds)
2. Products Page
● Fetch products from a dummy api (example: https://fakestoreapi.com/products)
● Implement real-time search with debouncing (300ms)
● Pagination (10 products per page) with URL parameters
● Show loader while fetching
● Preload data before navigation
● "Add to Cart" functionality
3. Cart Management
Implement a Cart Service with Message Queue pattern:
● Queue processes cart updates asynchronously (simulate 500ms delay)
● UI shows queue status ("Adding to cart..." → "Added!")
● Important: NO Svelte stores allowed - use Svelte 5 Runes or custom reactive
system
4. Checkout Page
● List all products in cart
● Implement optimistic updates when deleting items
● Rate limiting: Max 1 checkout per 10 seconds (show countdown)
● Display total price
● Checkout button with success messag
