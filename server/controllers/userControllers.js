const registerUser = async (req, res, next) => {
    res.json('Register user')
}

const loginUser = async (req, res, next) => {
    res.json('Login user')
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