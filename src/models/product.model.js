import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        descriptions: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        // postedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        //     required: true,
        // },
        // imageUrl: {
        //     type: String,
        //     required: true,
        // },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
// Automatically adds createdAt and updatedAt fields
