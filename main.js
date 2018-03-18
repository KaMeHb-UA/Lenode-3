const {getPrivate, setPrivate} = require('node-object-private-props'),
    Promise = require('bluebird');
function genetateANSIColor(color, string, background){
    return `\x1b[${background ? (`48;2;${background.r};${background.g};${background.b}`) : 49};${color ? (`38;2;${color.r};${color.g};${color.b}`) : 39}m${string}\x1b[0m`
}
function normalizeTime(tnum){
    return tnum < 10 ? `0${tnum}` : tnum
}
class LeNode{
    constructor(settings){
        if(!settings.router) throw new ReferenceError('settings.router is not defined');
        setPrivate(this, 'settings', settings);
        this.logger = new class Logger{
            log(data){
                var time = (cur => {
                    return `${
                        normalizeTime(cur.getHours())
                    }:${
                        normalizeTime(cur.getMinutes())
                    }:${
                        normalizeTime(cur.getSeconds())
                    }`
                })(new Date());
                process.stdout.write(genetateANSIColor({
                    r: 255,
                    g: 100,
                    b: 0
                }, `[${time}] | `));
                console.log(data)
            }
        }
    }
    start(port){
        var settings = getPrivate(this, 'settings');
        // ROUTES THERE
    }
}
class Site{
    constructor(settings){
        setPrivate(this, 'settings', settings)
    }
    setServerInstanse(server){
        setPrivate(this, 'system::serverInstanse', server);
        this.logger = server.logger;
    }
}
module.exports = {LeNode, Site}
