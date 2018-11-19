const ne = require('node-encrypt')

process.env.ENCRYPTION_KEY = 'f66de9e326b4a7defaa0b1e0f015a140';

let compress = text => ne.encrypt({ text }, (e, cipher) => console.log(cipher))

compress('1111111111111111111111111111111111111111111111111111111111111111')
