import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {addComment, addNewPost, bookMarkPost, deletePost, disLikePost, getAllPosts, getCommentsOfPost, getUserPosts, likePost } from '../controllers/post.controller.js';
import upload from '../middlewares/multer.js';


const router = express.Router();

router.route('/addpost').post(isAuthenticated,upload.single('image'), addNewPost);
router.route('/all').get(isAuthenticated, getAllPosts);
router.route('/userposts/all').get(isAuthenticated, getUserPosts);
router.route('/:id/like').get(isAuthenticated,likePost);
router.route('/:id/dislike').get(isAuthenticated,disLikePost);
router.route('/:id/comment').post(isAuthenticated,addComment);
router.route('/:id/comment/all').post(isAuthenticated,getCommentsOfPost);
router.route('/delete/:id').delete(isAuthenticated, deletePost);
router.route('/:id/bookmark').post(isAuthenticated,bookMarkPost);

export default router;