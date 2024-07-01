import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!user || !user.cart) return;

            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/carts/${user.cart}`);
                if (!response.ok) {
                    throw new Error('Error fetching cart items');
                }
                const cart = await response.json();
                setCartItems(cart.products);
            } catch (error) {
                setError(error.message);
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [user]);

    const addToCart = async (productId) => {
        if (!user || !user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/carts/${user.cart}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error adding product to cart');
            }
            const updatedCart = await response.json();
            setCartItems(updatedCart.products);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProductQuantity = async (productId, quantity) => {
        if (!user || !user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/carts/${user.cart}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });

            if (!response.ok) {
                throw new Error('Error updating product quantity');
            }

            const updatedCartItems = [...cartItems]; // Create a copy of the current cartItems array
            const index = updatedCartItems.findIndex(item => item.product._id === productId);
            if (index !== -1) {
                updatedCartItems[index].quantity = quantity;
            }
            setCartItems(updatedCartItems);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProductFromCart = async (productId) => {
        if (!user || !user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/carts/${user.cart}/products/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error deleting product from cart');
            }

            const updatedCartItems = [...cartItems]; // Create a copy of the current cartItems array
            const index = updatedCartItems.findIndex(item => item.product._id === productId);
            if (index !== -1) {
                updatedCartItems.splice(index, 1);
            }
            setCartItems(updatedCartItems);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCart = async () => {
        if (!user || !user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/carts/${user.cart}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error deleting cart');
            }

            setCartItems([]);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, error, loading, addToCart, deleteCart, deleteProductFromCart, updateProductQuantity }}>
            {children}
        </CartContext.Provider>
    );
};