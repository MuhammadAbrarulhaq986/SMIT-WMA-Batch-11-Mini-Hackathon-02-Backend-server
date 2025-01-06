import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Cancelled", "Shipped"], // Enum values
            default: "Pending", // Match enum case
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.model("Order", orderSchema);
