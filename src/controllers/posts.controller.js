import { PostModel } from '../schemas/post.schema.js';

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
	res.status(501).json({ message: 'Not implemented' });
};
