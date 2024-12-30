import Post from "../models/post.js";
import mongoose from 'mongoose';
import userChats from "../models/userChats.js";


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
