const jwt = require('njwt');

const issuer = process.argv[2];
const secret = process.argv[3];

// console.info(`Creating JWT for ${issuer} with secret ${secret}`);

const token = jwt.create({ iss: issuer }, secret);
token.setExpiration(new Date().getTime() + 60*1000);
console.log(token.compact());
