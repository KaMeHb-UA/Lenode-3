const {Site} = require(__dirname + '/../..'),
    Promise = require('bluebird');
    //asyncRequire = require('async-require');
class myTestSite extends Site{

    getPage({address, method, POST, GET, REQUEST, COOKIE, port, protocol, fullAddress, headers, response}){
        return new Promise((resolve, reject) => {
            resolve({
                /*
                result: JSON.stringify({address, method, POST, GET, REQUEST, COOKIE, port, protocol, fullAddress})
                /*/
                result: JSON.stringify(arguments) //error 500
                //*/
            });
        })
    }

}
module.exports = myTestSite;
