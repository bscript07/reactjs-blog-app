const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {type: String, required: true},
    newName: {type: String, required: true, unique: true, lowercase: true },
    email: {type: String, required: true, unique: true, lowercase: true },      
    password: {type: String, required: true},
    avatar: {type: String},
    posts: {type: Number, default: 0},
});

userSchema.pre('save', function(next) {
    this.newName = this.name.toLowerCase();
    next();
});

module.exports = model('User', userSchema);