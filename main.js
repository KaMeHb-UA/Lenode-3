const {getPrivate, setPrivate} = require('node-object-private-props');
class LeNode{
    constructor(settings){
        setPrivate(this, 'settings', settings)
    }
}
class Site{
    constructor(router){
        setPrivate(this, 'router', router)
    }
}
module.exports = {LeNode, Site}