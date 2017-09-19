var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var testsSchema = new Schema({
    name: String,
    min: Number,
    trying: String,
    publish: Boolean,
    data: Array
});

module.exports = mongoose.model('tests',testsSchema);
