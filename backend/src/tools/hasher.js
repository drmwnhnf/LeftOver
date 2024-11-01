const crypto = require('crypto');

function hashThis(thing) {
    const hash = crypto.createHash('sha256');
    hash.update(thing);
    return hash.digest('hex');
}

module.exports = {
    hashThis
}