import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: { // Corrected the typo here
        type: String,
        required: [true, "User  name is required"],

    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
});

//* Pre-save hook: Executes before saving the user document to the database
userSchema.pre("save", async function (next) {
    //* Check if the password field has been modified
    if (!this.isModified("password")) {
        //* If the password is not modified, skip the hashing process and proceed to the next middleware
        return next();
    }
    //* Hash the password using bcrypt with a salt factor of 10
    this.password = await bcrypt.hash(this.password, 10);
    //* Proceed to the next middleware or save operation
    next();
});


//* Changed model name to singular
export default mongoose.model("User ", userSchema); 