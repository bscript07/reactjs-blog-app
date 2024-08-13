const {Schema, model} = require('mongoose');

const postSchema = new Schema({
    title: {type: String, required: true},
    category: {type: String, enum: ['Uncategorized', 'Art', 'Business', 'Cryptocurrency', 'Finance', 'Health', 'Food', 'Investment', 'Weather'], message: 'Value is not supported'},
    description: {type: String, required: true},
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    thumbnail: {type: String, required: true},
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [{
        text: { type: String, required: true },
        postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        created: { type: Date, default: Date.now },
    }],
}, {timestamps: true})

module.exports = model('Post', postSchema);