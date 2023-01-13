const BidHandler = require("./BidHandler")
const PrefixHandler = require("./PrefixHandler")

class Handler {
    _prefix = new PrefixHandler
    _bid = new BidHandler

    get prefixHandler() {
        return this._prefix
    }

    get bidHandler() {
        return this._bid
    }
}

module.exports = Handler