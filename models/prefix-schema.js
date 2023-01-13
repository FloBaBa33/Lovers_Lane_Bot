const  { Schema, model } = require('mongoose')

const requiredString = {
    type: String,
    required: true,
}

const schema = new Schema(
    { // GuildId
        _id: requiredString,
        prefix: requiredString
    }
)
const name = 'prefix'

module.exports = model(name, schema, name)
