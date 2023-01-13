const  { Schema, model } = require('mongoose')

const requiredString = {
    type: String,
    required: true,
}

const schema = new Schema(
    { // GuildId-UserId
        _id: requiredString,
        bid: {
            type: Number,
            required: true,
            default: 0,
        },
        bidder: {
            type: String,
            required: true,
            default: 0
        }
    }
)
const name = 'bids'

module.exports = model(name, schema, name)