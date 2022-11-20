import { PostModel } from '../schemas/post.schema.js';

import getError from '../lib/errorhandler.js';
import { CommentModel } from '../schemas/comment.schema.js';
import { UserModel } from '../schemas/user.schema.js';

export const getPosts = async (req, res, next) => {
	const { userId } = req.query;
	if (userId === undefined) {
		// TODO get posts for user's timeline
		res.status(501).json({ message: 'Not implemented' });
		return;
	} else {
		const posts = PostModel.find({ author: userId });

		if (posts.length === 0) {
			res.status(204).json({ message: 'No posts found' });
		} else {
			res.status(200).json({ posts });
		}
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
