const Post = require('../models/Post');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { cloudinary } = require('../utils/cloudinary');
const ErrorHandler = require('../utils/errorHandler');
const FeaturedPost = require('../models/FeaturedPost');
const uploadImagetoCloudinary = require('../utils/uploadImageToCloudinary');

const FEATURED_POSTS_LIMIT = 4;
const RELATED_POSTS_LIMIT = 5;

const addToFeatured = catchAsyncErrors(async (postId) => {
	// if more than 4 featured posts are already present, remove the oldest one and add the new one
	const numberOfFeaturedPosts = await FeaturedPost.countDocuments();
	if (numberOfFeaturedPosts >= FEATURED_POSTS_LIMIT) {
		const oldestFeaturedPost = await FeaturedPost.findOne().sort({
			createdAt: 1,
		});
		await FeaturedPost.findByIdAndDelete(oldestFeaturedPost._id);
	}

	const isAlreadyFeatured = await FeaturedPost.findOne({ post: postId });
	if (isAlreadyFeatured) {
		return;
	}

	await FeaturedPost.create({ post: postId }); // Create a new featured post

	const featuredPosts = await FeaturedPost.find({}).sort({ createdAt: -1 }); // Sort by createdAt in descending order
	featuredPosts.forEach(async (post, index) => {
		if (index >= FEATURED_POSTS_LIMIT) {
			await FeaturedPost.findByIdAndDelete(post._id);
		}
	});
});

const removeFromFeatured = catchAsyncErrors(async (postId) => {
	const featuredPost = await FeaturedPost.findOne({ post: postId });
	if (!featuredPost) return;

	await featuredPost.remove();
});

// Create a new post => /api/v1/post/create
exports.createPost = catchAsyncErrors(async (req, res, next) => {
	const { title, meta, content, slug, author, tags, featured, userID } =
		req.body;
	const { file } = req;
	
	const post = await Post.create({
		title,
		meta,
		content,
		slug,
		author,
		tags,
		userID,
	});

	if (file) {
		// Upload image to cloudinary
		const result = await uploadImagetoCloudinary(file.path);

		post.thumbnail = {
			public_id: result.public_id,
			url: result.secure_url,
		};

		await post.save();
	}

	if (featured) addToFeatured(post._id);

	res.status(201).json({
		success: true,
		message: 'Post created successfully',
		post,
	});
});

// Get a single post => /api/v1/post/single/:postId
exports.getPost = catchAsyncErrors(async (req, res, next) => {
	const post = await Post.findOne({ slug: req.params.slug });

	if (!post) {
		return next(new ErrorHandler('Post not found', 404));
	}

	const featuredPost = await FeaturedPost.findOne({ post: post._id });

	res.status(200).json({ success: true, post, featured: !!featuredPost }); // !!featuredPost will return true if post is featured
});

// Update a post => /api/v1/post/update/:postId
exports.updatePost = catchAsyncErrors(async (req, res, next) => {
	const { title, meta, content, slug, author, tags, featured } = req.body;
	const { file } = req;

	const post = await Post.findById(req.params.postId);
	if (!post) {
		return next(new ErrorHandler('Post not found', 404));
	}

	// Check if the post has public_id
	if (post?.thumbnail?.public_id && file) {
		// Delete image from cloudinary
		await cloudinary.uploader.destroy(post.thumbnail.public_id);

		// Upload image to cloudinary
		const result = await uploadImagetoCloudinary(file.path);

		post.thumbnail = {
			public_id: result.public_id,
			url: result.secure_url,
		};

		await post.save();
	} else if (file) {
		const result = await uploadImagetoCloudinary(file.path);

		post.thumbnail = {
			public_id: result.public_id,
			url: result.secure_url,
		};

		await post.save();
	}

	post.title = title;
	post.meta = meta;
	post.content = content;
	post.slug = slug;
	post.author = author;
	post.tags = tags;

	await post.save();

	if (featured) addToFeatured(post._id);
	else removeFromFeatured(post._id);

	res.status(200).json({
		success: true,
		message: 'Post updated successfully',
		post,
	});
});

// Delete a post => /api/v1/post/:id
exports.deletePost = catchAsyncErrors(async (req, res, next) => {
	const post = await Post.findById(req.params.postId);
	if (!post) {
		return next(new ErrorHandler('Post not found', 404));
	}

	if (post?.thumbnail?.public_id) {
		await cloudinary.uploader.destroy(post.thumbnail.public_id);
	}

	// remove from featured posts
	removeFromFeatured(post?._id);

	await post.remove();

	res.status(200).json({
		success: true,
		message: 'Post deleted successfully',
	});
});

// Get all featured posts => /api/v1/posts/featured-posts
exports.getFeaturedPosts = catchAsyncErrors(async (req, res, next) => {
	const featuredPosts = await FeaturedPost.find({})
		.sort({ createdAt: -1 })
		.limit(FEATURED_POSTS_LIMIT)
		.populate('post')
		.exec()
		.then((posts) => {
			return posts.map((post) => post.post); // Get only post from featured post
		});

	res.status(200).json({ success: true, featuredPosts });
});

// Get all posts => /api/v1/post/get-posts
exports.getPosts = catchAsyncErrors(async (req, res, next) => {
	const { pageNo = 1, limit = 10 } = req.query;

	// parse query params
	const page = parseInt(pageNo);
	const limitPerPage = parseInt(limit);

	const posts = await Post.find({})
		.sort({ createdAt: -1 })
		.skip((page - 1) * limitPerPage)
		.limit(limitPerPage);

	const postsCount = await Post.countDocuments();

	res.status(200).json({ success: true, postsCount, posts });
});

// Search posts => /api/v1/post/search
exports.searchPosts = catchAsyncErrors(async (req, res, next) => {
	const { query } = req.query;

	const posts = await Post.find({ title: { $regex: query, $options: 'i' } });

	res.status(200).json({ success: true, posts });
});

// Get related posts => /api/v1/post/related-posts/:postId
exports.getRelatedPosts = catchAsyncErrors(async (req, res, next) => {
	const post = await Post.findById(req.params.postId);

	if (!post) {
		return next(new ErrorHandler('Post not found', 404));
	}

	const relatedPosts = await Post.find({
		_id: { $ne: post._id },
		tags: { $in: post.tags },
	})
		.sort({ createdAt: -1 })
		.limit(RELATED_POSTS_LIMIT); // get posts that are not equal to current post and have same tags as current post

	res.status(200).json({ success: true, relatedPosts });
});

// Upload Image => /api/v1/post/upload-image
exports.uploadImage = catchAsyncErrors(async (req, res, next) => {
	const { file } = req;

	if (!file) return next(new ErrorHandler('Please upload an image', 400));

	const result = await uploadImagetoCloudinary(file.path);

	res.status(200).json({ success: true, image: result.secure_url });
});
