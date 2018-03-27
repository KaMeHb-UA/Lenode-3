const {getPrivate, setPrivate} = require('node-object-private-props'),
    Promise = require('bluebird'),
    checkType = require('type-checker'),
    http = require('http');
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
        if (!checkType(settings.router, Array)) throw new TypeError('router is not configured propertly');
        var addSite = (exp, site) => {
            var tpmStack = getPrivate(this, 'siteStack') || [];
            tpmStack.push({
                domain: exp,
                site
            });
            setPrivate(this, 'siteStack', tpmStack);
        }
        http.createServer((req, res) => {
            var [host] = (req.headers.host || '').split(':'),
                site = null;
            getPrivate(this, 'siteStack').forEach(sitedef => {
                if(!site && sitedef.domain.test(host)) site = sitedef.site;
            });
            //////////////////////////////////////////////////////
            if (site) site.getPage();
            res.write('Hello World!');
            res.end();
            console.log({req, res})
            /////////////////////////////////////////////////////
        }).listen(port);
        settings.router.forEach(site => {
            if (!checkType(site.domain, RegExp) || !checkType(site.folder, String)){
                throw new TypeError('router is not configured propertly')
            } else {
                addSite(site.domain, require(site.folder));
            }
        });
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
