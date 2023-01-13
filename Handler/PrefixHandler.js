const prefixSchema = require ('../models/prefix-schema')

class PrefixHandler {
    _defaultPrefix = '..'
    _prefixes = new Map()

    constructor () {
        this.loadPrefixes()
    }

    async loadPrefixes () {
        const results = await prefixSchema.find({})

        for (const result of results) {
            this._prefixes.set(result._id, result.prefix)
        }
    }

    get defaultPrefix() {
        return this._defaultPrefix
    }

    getPrefix(_id) {
        if (!_id) return this.defaultPrefix
        return this._prefixes.get(_id) || this.defaultPrefix
    }

    async setPrefix(_id, prefix) {
        this._prefixes.set(_id, prefix)

        await prefixSchema.findByIdAndUpdate({_id}, {_id, prefix}, {upsert: true})
    }
}

module.exports = PrefixHandler
