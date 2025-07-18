
export interface CartItem {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
}


export interface CartStatus {
    [productId: number]: 'idle' | 'adding' | 'added';
}
