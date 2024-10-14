import { Schema, model } from "mongoose";

const userSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    hashedPassword: {
        type: String,
        required: true,
        trim: true
    },

    active: {
        type: Boolean,
        required: true,
        default: false
    }
})

export default model('Users', userSchema);