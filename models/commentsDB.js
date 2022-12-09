const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const commentsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    content: {type: String, required: true},
    profpic: {type: String, default: "defaultPic.png"},
});

const Comment = mongoose.model("Comment", commentsSchema);
module.exports = Comment;
