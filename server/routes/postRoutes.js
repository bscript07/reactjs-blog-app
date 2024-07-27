const {Router} = require('express');

const { createPost, getPosts, getPost, getCategoryPosts, getUserPosts, editPost, deletePost } = require('../controllers/postControllers');
const authMiddleware = require('../middleware/authMiddleware');
const router = Router();

router.post('/', authMiddleware, createPost)
router.get('/', getPosts)
router.get('/:id', getPost)
router.get('/categories/:category', getCategoryPosts)
router.get('/users/:id', getUserPosts)
router.patch('/:id', authMiddleware, editPost)
router.delete('/:id', authMiddleware, deletePost)

module.exports = router;