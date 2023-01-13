const bidSchema = require ('../models/bid-schema.js')

class BidHandler {
    _bids = new Map()

    constructor() {
        this.loadBids()
    }

    async loadBids() {
        const results = await bidSchema.find({})

        for (const result of results) {
            this._bids.set(result._id, [result.bidder, result.bid])
        }
    }

    /**
     * 
     * @param {String} _id - GuildId-UserId
     * @returns {[String, Number]} - [bidderId, bid]
     */
    getBid(_id) {
        return this._bids.get(_id) || ['0', 0]
    }

    /**
     * 
     * @param {String} _id - GuildId-UserId
     * @param {Number} bid - the Amount to bid
     * @param {String} bidderId - The Bidders ID
     */
    async setBid(_id, bid, bidderId) {
        this._bids.set(_id, [bidderId, bid])

        await bidSchema.findOneAndUpdate({ _id }, { _id, bidder: bidderId, bid }, { upsert: true })
    }

    /**
     * 
     * @param {String} _id - GuildId-UserId
     */
    async clearBid(_id) {
        this._bids.delete(_id)

        await bidSchema.deleteOne({ _id })
    }
}

module.exports = BidHandler