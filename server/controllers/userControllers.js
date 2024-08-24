const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const {v4: uuid} = require('uuid')
const HttpError = require('../models/errorModel');
const User = require('../models/userModel')

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return next(new HttpError('Fill in all fields.', 422));
        }

        const newName = name.toLowerCase();
        const nameExists = await User.findOne({ newName });

        if (nameExists) {
            return next(new HttpError('Name already exists.', 422));
        }

        const newEmail = email.toLowerCase();
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError('Email already exists.', 422));
        }

        if (password.length < 6) {
            return next(new HttpError('Password should be at least 6 characters.', 422));
        }

        if (password !== confirmPassword) {
            return next(new HttpError('Passwords do not match.', 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, newName, email: newEmail, password: hashedPassword });

        const { _id: id } = newUser;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {expiresIn: '1d'})

        res.status(201).json({id, token, name, email: newEmail});

    } catch (error) {
        return next(new HttpError('User registration failed.', 422));
    }
};

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

        const {_id: id, name } = user;
        const token = jwt.sign({id, name}, process.env.JWT_SECRET, {expiresIn: '1d'})

        res.status(200).json({token, id, name})
    } catch (error) {
        return next(new HttpError(`Login failed. Please check your creadentials.`, 422));
    }
}

const getUser = async (req, res, next) => {
   try {
    const {id} = req.params;
    const user = await User.findById(id).select('-password');
    console.log(user);
    
    if (!user) {
        return next(new HttpError(`User not found.`, 404));
    }

    res.status(200).json(user)
   } catch (error) {
    return next(new HttpError(error));
   }
}

const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files.avatar) {
            return next(new HttpError(`Please choose an image.`, 422));
        }

        // find user from database
        const user = await User.findById(req.user.id)
        
        // delete old avatar if exists
        if (user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if (err) {
                    return new HttpError(err);
                }
            })
        }

        const {avatar} = req.files;

        // check file size
        if (avatar.size > 500000) {
            return next(new HttpError(`Image size should not exceed 5MB.`, 422));
        }

        let fileName;
        fileName = avatar.name;
        let splittedFileName = fileName.split('.')
        let newFileName = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1];
        avatar.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
            if (err) {
                return new HttpError(err);
            }

            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, {avatar: newFileName}, {new: true})

            if (!updatedAvatar) {
                return new HttpError(`Failed to update user avatar.`);
            }

            res.status(200).json(updatedAvatar);
        })
    } catch (error) {
        return next(new HttpError(error));
    }
}

const editUser = async (req, res, next) => {
    try {
        const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;

        if (!name || !email || !currentPassword || !newPassword) {
            return next(new HttpError(`Fill in all fields.`, 422));
        }

        // get user from database 
        const user = await User.findById(req.user.id)

        if (!user) {
            return next(new HttpError(`User not found.`, 404));
        }

        // make sure new email doesnt already exists
        const emailExists = await User.findOne({email})
        if (emailExists && (emailExists._id != req.user.id)) {
            return next(new HttpError(`Email already exists.`, 422));
        }

        // compare current password to db password
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password)
        if (!validateUserPassword) {
            return next(new HttpError(`Current password is incorrect.`, 422));
        }

        // compare new passwords
        if (newPassword !== confirmNewPassword) {
            return next(new HttpError(`Passwords do not match.`, 422));
        }

        // hash new password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)

        // update user info in db
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password: hash}, {new: true})
        res.status(200).json(newInfo)
        
    } catch (error) {
        return new HttpError(err);
    }
}

const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password')
        res.json(authors)
    } catch (error) {
        return next(new HttpError(error));
    }
}

module.exports = { registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors }