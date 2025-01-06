import mongoose from "mongoose";
import Order from "../models/order.model.js";

//* Create a new order
const createOrder = async (req, res) => {
    // Extract data from the request body
    const { user, products, totalPrice } = req.body;

    // Check if all required fields are provided
    if (!user || !products || !totalPrice) {
        return res.status(400).json({ message: "Please provide user, products, and total price." });
    }

    // Ensure products is an array with at least one item
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Products must be a list with at least one product." });
    }

    try {
        // Create a new order with the provided data
        const newOrder = await Order.create({ user, products, totalPrice });

        // Respond with success
        res.status(201).json({
            message: "Order created successfully.",
            order: newOrder,
        });
    } catch (error) {
        // Handle errors during order creation
        console.error("Error creating order:", error.message);
        res.status(500).json({ message: "Failed to create order.", error: error.message });
    }
};

//* List all orders for a specific user
const listOrders = async (req, res) => {
    try {
        // Make sure the user is logged in
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "You must be logged in to see your orders." });
        }

        // Find all orders that belong to the logged-in user
        const orders = await Order.find({ user: req.user._id });

        // If no orders are found, respond with a message
        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        // Respond with the list of orders
        res.status(200).json({ message: "Orders retrieved successfully.", orders });
    } catch (error) {
        // Handle errors during order retrieval
        console.error("Error fetching orders:", error.message);
        res.status(500).json({ message: "Failed to fetch orders.", error: error.message });
    }
};

//* Get details of a specific order
const getSingleOrder = async (req, res) => {
    const { id } = req.params; // Extract the order ID from the URL

    // Check if the provided ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid order ID." });
    }

    try {
        // Find the order by its ID
        const order = await Order.findById(id);

        // If no order is found, respond with an error
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Respond with the order details
        res.status(200).json({ message: "Order found successfully.", order });
    } catch (error) {
        // Handle errors during order retrieval
        console.error("Error fetching order:", error.message);
        res.status(500).json({ message: "Failed to fetch order.", error: error.message });
    }
};

export { createOrder, listOrders, getSingleOrder };
