const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');
const User = require('../models/userModel')

const registerUser = async (req, res, next) => {
    try {
        const {name, email, password, confirmPassword} = req.body;

        if (!name || !email || !password) {
            return next(new HttpError(`Fill in all fields.`, 422));
        }

        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({email: newEmail});
        if (emailExists) {
            return next(new HttpError(`Email already exists.`, 422));
        }

        if ((password.trim()).length < 6) {
            return next(new HttpError(`Password should be at least 6 characters.`, 422));
        }

        if (password != confirmPassword) {
            return next(new HttpError(`Passwords do not match.`, 422));
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await User.create({name, email: newEmail, password: hashedPassword})

        res.status(201).json(`New user: ${newUser.email} registered.`)

    } catch (error) {
        return next(new HttpError(`User registration failed.`, 422));
    }
}

const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return next(new HttpError(`Fill in all fields.`, 422));
        }

        const newEmail = email.toLowerCase();

        const user = await User.findOne({email: newEmail});
        if (!user) {
            return next(new HttpError(`Invalid creadentials.`, 422));
        }

        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return next(new HttpError(`Invalid creadentials.`, 422));
        }

        const{_id: id, name} = user;
        const token = jwt.sign({id, name}, process.env.JWT_SECRET, {expiresIn: '1d'})

    } catch (error) {
        return next(new HttpError(`Login failed. Please check your creadentials.`, 422));
    }
}

const getUser = async (req, res, next) => {
    res.json('User profile')
}

const changeAvatar = async (req, res, next) => {
    res.json('Change user avatar')
}

const editUser = async (req, res, next) => {
    res.json('Edit user details')
}

const getAuthors = async (req, res, next) => {
    res.json('Get all users/authors')
}

module.exports = { registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors }