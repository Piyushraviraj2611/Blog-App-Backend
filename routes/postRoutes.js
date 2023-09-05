const express = require("express");
const multer = require("../middlewares/multer");
const { createPost, deletePost, updatePost, getPost, getFeaturedPosts, getPosts, searchPosts, getRelatedPosts, uploadImage } = require("../controllers/postController");
const { validate, postValidator } = require("../middlewares/postValidator");
const { parseData } = require("../middlewares/parseData");

const router = express.Router();


router.route("/create").post(
   // console.log("hello world"),
    multer.single("thumbnail"),
    parseData,
    postValidator,
    validate,
    createPost);

router.route("/update/:postId").put(
    multer.single("thumbnail"),
    parseData,
    postValidator,
    validate,
    updatePost);

router.route("/single/:slug").get(getPost);

router.route("/:postId").delete(deletePost);

router.route("/featured-posts").get(getFeaturedPosts);

router.route("/get-posts").get(getPosts);

router.route("/related-posts/:postId").get(getRelatedPosts);

router.route("/search").get(searchPosts);

router.route("/upload-image").post(multer.single("image"), uploadImage);

module.exports = router;