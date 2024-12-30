import Post from "../models/post.js";
import mongoose from 'mongoose';
import userChats from "../models/userChats.js";
import upload from "../middleware/middleware.js";

export const getAllPosts = async (req, res) => {
    try {
        const LoginUser = req.auth.userId;
        const postData = await Post.find().populate('user', 'username imageUrl');
        const posts = postData.map(post => ({
            postID: post._id,
            content: post.postContent,
            username: post.username,
            users: post.user ? post.user.map(u => ({
                id: u._id,
                username: u.username,
                imageUrl: u.imageUrl
            })) : [],
            likes: post.likes || []
        }));
        // res.render("index.ejs", { posts, LoginUser });
        res.status(200).json({ posts, LoginUser });

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Internal Server Error");
    }
};


export const createPost = async (req, res) => {
    try {
        const user = await userChats.findOne({ _id: req.auth.userId });
        // console.log(user);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const { postContent } = req.body;
        const post = await Post.create({
            postContent,
            username: user.username,
            user: user._id,
        });

        user.posts.push(post._id);
        await user.save();

        // res.redirect("/posts");
        res.status(201).send("Post created successfully");
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("Server Error");
    }
};


export const addLikes = async (req, res) => {
    try {
        // Find the post by ID
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = req.auth.userId;
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex === -1) {

            post.likes.push(userId);
        } else {

            post.likes.splice(likeIndex, 1);
        }

        // Save the updated post
        await post.save();


        res.status(200).json({ likesCount: post.likes.length, message: "Like updated successfully!" });
    } catch (error) {
        console.error("Error updating likes:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


export const addComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Comment content is required" });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({
            user: req.auth.userid,
            content: content
        });

        await post.save();

        res.status(200).json({ message: "Comment added successfully", comments: post.comments });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


export const editPost = async (req, res) => {
    try {
        const { postContent } = req.body;

        // Validate input
        if (!postContent) {
            return res.status(400).json({ message: "Post content is required" });
        }

        // Find the post by ID
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the logged-in user is the owner of the post
        if (post.user.toString() !== req.auth.userid) {
            return res.status(403).json({ message: "You are not authorized to edit this post" });
        }

        // Update the post content
        post.postContent = postContent;
        await post.save();

        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


export const deletePost = async (req, res) => {
    try {
        // Find the post by ID
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the logged-in user is the owner of the post
        if (post.user.toString() !== req.auth.userid) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        // Delete the post
        await post.remove();

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'username imageUrl');

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId }).populate('user', 'username imageUrl');

        if (!posts) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server Error" });
    }
}


export const Uploadapplication = async (req, res) => {
    upload.single("file")(req, res, async (err) => {
        if (err) {
            // Handle Multer error
            return res.status(400).json({ message: err.message });
        }

        try {
            // Your main logic here
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            post.applications.push({
                user: req.auth.userid,
                filePath: req.file.path,
            });

            await post.save();

            res.status(200).json({ message: "Application submitted successfully" });
        } catch (error) {
            console.error("Error uploading file:", error);
            res.status(500).json({ message: "Server Error" });
        }
    });
};

export const getApplications = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("applications.user");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the logged-in user is the owner of the post
        if (post.user.toString() !== req.auth.userid) {
            return res.status(403).json({ message: "You are not authorized to view this" });
        }

        res.status(200).json({ applications: post.applications });
    } catch (error) {
        console.error("Error fetching recruits:", error);
        res.status(500).json({ message: "Server Error" });
    }
};