var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var usersSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true, unique: true },
    name: String,
    role: String,
    img: String,
    results: Array,
    certif: Array
});

module.exports = mongoose.model('users',usersSchema);
