import { PostModel } from '../schemas/post.schema.js';

import getError from '../lib/errorhandler.js';

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
	//TODO verify that req.body.author is the same as req.auth._id

	const post = new PostModel(req.body);

	post.save((err, dat) => {
		if(err) return res.status(400).json({ error: getError(err) });
		res.status(201).json({ message: 'Post added', user: dat});
	});
};

export const addComment = async (req, res, next) => {
	//TODO verify that req.body.author is the same as req.auth._id
	
	const { id } = req.params;

	const post = PostModel.findById(id);
	if (post === undefined) {
		res.status(404).json({ message: 'Post not found' });
	} else {
		post.comments.push(req.body);
		post.save((err, dat) => {
			if(err) return res.status(400).json({ error: getError(err) });
			res.status(201).json({ message: 'Comment added', user: dat});
		});
	}
};
