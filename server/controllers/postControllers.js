const Post = require('../models/postModel')
const User = require('../models/userModel')
const fs = require('fs')
const path = require('path')
const{v4: uuid} = require('uuid')
const HttpError = require('../models/errorModel')

const createPost = async (req, res, next) => {
    try {
        let{title, category, description } = req.body;

        if (!title || !category || !description || !req.files) {
            return next(new HttpError('Missing required fields', 422))
        }

        const {thumbnail} = req.files;
        // check the file size

        if (thumbnail.size > 2000000) {
            return next(new HttpError('Thumbnail file size exceeds 2MB', 422))
        }

        let fileName = thumbnail.name
        let splittedFileName = fileName.split('.')
        let newFileName = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1]

        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFileName), async (err) => {
            if (err) {
                return next(new HttpError(err))
            } else {
                const newPost = await Post.create({title, category, description, thumbnail: newFileName, creator: req.user.id})

                if (!newPost) {
                    return next(new HttpError('Failed to create post', 422))
                }

                // find user and increase post count
                const currentUser = await User.findById(req.user.id)
                const userPostCount = currentUser.posts + 1

                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})

                res.status(201).json(newPost)
            }
        })
    } catch (error) {
        return next(new HttpError(error))
    }
}

const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({updatedAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
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