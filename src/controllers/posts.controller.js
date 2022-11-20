import { PostModel } from '../schemas/post.schema.js';

import getError from '../lib/errorhandler.js';
import { CommentModel } from '../schemas/comment.schema.js';
import { UserModel } from '../schemas/user.schema.js';
import { NotificationModel } from '../schemas/notification.schema.js';
import winston from 'winston';

export const getPosts = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.user.id);
		if(!user) return res.status(401).json({ message: 'Unauthorized' });
		const posts = (await PostModel.find()).filter(post => user.friends.includes(post.authorId));
		
		return res.status(200).json({ message: 'Posts retrieved successfully', posts });
	} catch (err) {
		return res.status(500).json({error: getError(err)});
	}
};

export const getUserPosts = async (req, res, next) => {
	const { id } = req.params;

	const posts = await PostModel.find({ authorId: id });

	if (posts.length === 0) {
		res.status(204).json({ message: 'No posts found' });
	} else {
		res.status(200).json({ posts });
	}
};

export const getPost = async (req, res, next) => {
	const { id } = req.params;

	const post = PostModel.findById(id);
	if (post === undefined) {
		res.status(404).json({ message: 'Post not found' });
	} else {
		res.status(200).json(post);
	}
};

export const createPost = async (req, res, next) => {
	//TODO: data validation on request body
	const post = new PostModel({
		authorId: req.user.id,
		...req.body}
	);

	post.save((err, dat) => {
		if(err) return res.status(400).json({ error: getError(err) });
		res.status(201).json({ message: 'Post added', user: dat});
	});
};

export const addComment = async (req, res, next) => {
	const { id } = req.params;

	//TODO: data validation on request body
	const post = await PostModel.findById(id);
	if (post === undefined) {
		res.status(404).json({ message: 'Post not found' });
	} else {
		const comment = new CommentModel({
			authorId: req.user.id,
			...req.body
		});

		NotificationModel.findOneAndUpdate({type: 'new-comments', user: post.authorId, target: post._id}, {viewed: false}, {upsert: true}, (err) => {
			if(err) winston.error(err.message);
		});

		post.comments.push(comment);
		post.save((err, dat) => {
			if(err) return res.status(400).json({ error: getError(err) });
			res.status(201).json({ message: 'Comment added', user: dat});
		});
	}
};

// TODO likely requires extensive testing :O
export const likePost = async (req, res, next) => {
	const { id } = req.params;

	const post = PostModel.findById(id);
	if (post === undefined) {
		res.status(404).json({ message: 'Post not found' });
	} else {
		if (post.likes.includes(req.user.id)) {
			res.status(400).json({ message: 'User already liked post' });
			return;
		}

		// Indicate that user has liked the post
		post.likes.push(req.user.id);
		post.save((postErr, postDat) => {
			if(postErr) return res.status(400).json({ error: getError(postErr) });

			// For the author ---
			const user = UserModel.findById(post.authorId);
			if (user === undefined) {
				res.status(404).json({ message: 'User no longer exists' });
			} else {
				NotificationModel.findOneAndUpdate({type: 'new-likes', user: post.authorId, target: post._id}, {viewed: false}, {upsert: true}, (err) => {
					if(err) winston.error(err.message);
				});

				// Increment the user's point count
				user.points += 1;
				user.save((err) => {
					if(err) return res.status(400).json({ error: getError(err) });
					// Send the updated post
					res.status(201).json({ message: 'User points updated', user: postDat});
				});
			}
		});
	}
};
