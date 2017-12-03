var https = require('https');

let get = function(url, callback) {
    return https.get(url, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            callback(body, null);
        });
        response.on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            callback(null, e);
        });
    });
}

module.exports = get;