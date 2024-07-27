const {Router} = require('express');


const { createPost, getPosts, getPost, getCategoryPosts, getUserPosts, editPost, deletePost } = require('../controllers/postControllers')
const router = Router();

router.post('/', createPost)
router.get('/', getPosts)
router.get('/:id', getPost)
router.get('/categories/:category', getCategoryPosts)
router.get('/users/:id', getUserPosts)
router.patch('/:id', editPost)
router.delete('/:id', deletePost)

module.exports = router;