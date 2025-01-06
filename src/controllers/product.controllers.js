import mongoose from "mongoose";
import Product from "../models/product.model.js";

// import cloudinary from "../middleware/cloudinary.config.js"
// Function to upload image to Cloudinary and return the URL
// const uploadImageToCloudinary = async (localPath) => {
//     try {
//         // Upload the image to Cloudinary
//         const uploadResult = await cloudinary.uploader.upload(localPath, {
//             resource_type: "image", // Ensure we upload only images
//         });

//         // Uncomment to delete the local file after upload
//         // fs.unlinkSync(localPath);

//         return uploadResult.url;  // Return the URL of the uploaded image
//     } catch (error) {
//         console.error("Cloudinary Upload Error:", error);
//         // Uncomment to delete the local file on error
//         // fs.unlinkSync(localPath);
//         return null;
//     }
// };

const createProduct = async (req, res) => {
    try {
        const { name, descriptions, price, postedBy } = req.body;
        // const userId = req.user._id;

        //* Validate inputs
        if (!name) return res.status(400).json({ message: "Name is required" });
        if (!descriptions) return res.status(400).json({ message: "Descriptions are required" });
        if (!price) return res.status(400).json({ message: "Price is required" });
        // if (!postedBy) return res.status(400).json({ message: "Posted By is required" });

        // if (!req.file) {
        //     return res.status(400).json({ error: "Product should have an image" });
        // }

        //* Upload image to Cloudinary 
        // const imageUrl = await uploadImageToCloudinary(req.file.path);
        // // console.log(req.file.path);
        // if (!imageUrl) {
        //     return res.status(500).json({ message: "Error uploading image to Cloudinary" });
        // }

        //* Create the new product in the database
        const product = await Product.create({
            name,
            descriptions,
            price,
            postedBy,
            // imageUrl,  //* Store the Cloudinary URL in the database

        });
        //* Respond with success
        res.status(201).json({
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





//* List all products with pagination:
const allProducts = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 1;
        const skip = (page - 1) * limit;

        const products = await Product.find({}).skip(skip).limit(limit).populate("author", "image");
        res.status(200).json({
            message: "All products with images",
            data: products,
            length: products.length,
        });
    } catch (error) {
        console.error("Error fetching products with  images:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


//* Update a product by its ID.
//* Only the user who created the product can update it.
const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, descriptions, price } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(
            id, {
            name,
            descriptions,
            price
        },
            { new: true }
        );

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ message: "Server error" });

    }
};



const singleProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Product not found" });
    }
    try {

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({
            message: "Product found successfully",
            data: product,
        });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ message: "Server error" });
    }

};



const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({
            message: "Product deleted successfully",
            data: product,
        });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}




export { createProduct, allProducts, editProduct, singleProduct, deleteProduct }