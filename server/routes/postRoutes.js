const {Router} = require('express');

const { createPost, getPosts, getPost, getCategoryPosts, getUserPosts, editPost, deletePost, likePost, commentPost } = require('../controllers/postControllers');
const authMiddleware = require('../middleware/authMiddleware');
const router = Router();

router.post('/', authMiddleware, createPost)
router.get('/', getPosts)
router.get('/:id', getPost)
router.get('/categories/:category', getCategoryPosts)
router.get('/users/:id', getUserPosts)
router.patch('/:id', authMiddleware, editPost)
router.delete('/:id', authMiddleware, deletePost)
router.post('/:id/like', authMiddleware, likePost)
router.post('/:id/comment', authMiddleware, commentPost);

module.exports = router;