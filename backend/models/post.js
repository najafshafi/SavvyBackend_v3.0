import mongoose from "mongoose";

// mongoose.connect("mongodb://127.0.0.1:27017/zopoapp");


const PostSchema = new mongoose.Schema({
    postContent: String,
    username: String,
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: { // Reference to the user who made the comment
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: { // The actual comment text
            type: String,
            required: true
        },
        timestamp: { // When the comment was created
            type: Date,
            default: Date.now
        }
    }]
});

export default mongoose.model("Post", PostSchema); 