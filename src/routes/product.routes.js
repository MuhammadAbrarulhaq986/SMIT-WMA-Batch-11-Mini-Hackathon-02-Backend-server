import express from "express"
import { allProducts, createProduct, deleteProduct, editProduct, singleProduct } from "../controllers/product.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();

// router.post("/createProduct", upload.single("image"), (req, res, next) => {
//     console.log(req.file); // Should log file details
//     next();
// }, createProduct);

router.post("/createProduct", createProduct);
router.get("/allProducts", allProducts);
router.get("/singleProduct/:id", singleProduct);
router.delete("/deleteProduct/:id", deleteProduct);
router.put("/editProduct/:id", editProduct);

export default router;