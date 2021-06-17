const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    name: String,
    surname: String,
    birthday: Date,
    job: String,
    biography: String,
    picture: String,
    savedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Model = mongoose.model("profiles", ProfileSchema)

module.exports = Model