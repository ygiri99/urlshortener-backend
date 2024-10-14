import mongoose from "mongoose";

const urlSchema = mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },

    shortUrl: {
        type: String,
        required: true
    },

    clicked: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


export default mongoose.model('Urls', urlSchema);
