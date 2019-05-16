var zlib = require('zlib');
var input = new Buffer.from('lorem ipsum dolor sit amet', 'utf8')





zlib.deflate(input,function(err, buf) {
    console.log("in the deflate callback:", buf.toString('hex'));

    zlib.inflate(buf, function(err, buf) {
            console.log("in the inflate callback:", buf);
            console.log("to string:", buf.toString("utf8") );
    });

});