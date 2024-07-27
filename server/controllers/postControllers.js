

const createPost = async (req, res, next) => {
    res.json('Create post')
}

const getPosts = async (req, res, next) => {
    res.json('Get all posts')
}

const getPost = async (req, res, next) => {
    res.json('Create post')
}

const getCategoryPosts = async (req, res, next) => {
    res.json('Create category post')
}

const getUserPosts = async (req, res, next) => {
    res.json('Create post')
}

const editPost = async (req, res, next) => {
    res.json('Edit post')
}

const deletePost = async (req, res, next) => {
    res.json('Delete post')
}

module.exports = { createPost, getPosts, getPost, getCategoryPosts, getUserPosts, editPost, deletePost }