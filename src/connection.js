const mongoose = require("mongoose")

const password = "@Fernan1992"
const dbname = "thepeople"
const user = "fer"
const host = "cluster0.12rzu.mongodb.net"

const uri = `mongodb+srv://${user}:${password}@${host}/${dbname}?retryWrites=true&w=majority`

module.exports = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })