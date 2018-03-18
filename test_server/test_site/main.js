const {Site} = require('..'),
    Promise = require('bluebird'),
    asyncRequire = require('async-require');
class myTestSite extends Site{
    constructor(settings){
        super(settings)
    }
    getPage(address, {POST, GET, REQUEST, COOKIE, port, protocol, fullAddress}){
        return new Promise((resolve, reject) => {
            resolve(JSON.stringify(arguments));
        })
    }
}
module.exports = myTestSite;
