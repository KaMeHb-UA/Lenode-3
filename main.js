const {getPrivate, setPrivate} = require('node-object-private-props'),
    checkType = require('type-checker'),
    pkg = require('./package.json'),
    http = require('http');
function genetateANSIColor(color, string, background){
    return `\x1b[${background ? (`48;2;${background.r};${background.g};${background.b}`) : 49};${color ? (`38;2;${color.r};${color.g};${color.b}`) : 39}m${string}\x1b[0m`
}
function normalizeTime(tnum){
    return tnum < 10 ? `0${tnum}` : tnum
}
function prefix(color){
    process.stdout.write(genetateANSIColor(color, `[${(cur => {
        return `${
            normalizeTime(cur.getHours())
        }:${
            normalizeTime(cur.getMinutes())
        }:${
            normalizeTime(cur.getSeconds())
        }`
    })(new Date())}] | `));
}
class LeNode{
    constructor(settings){
        if(!settings.router) throw new ReferenceError('settings.router is not defined');
        setPrivate(this, 'settings', settings);
        this.logger = new class Logger{
            log(data){
                prefix({
                    r: 0,
                    g: 200,
                    b: 0
                });
                console.log(data)
            }
            warn(data){
                prefix({
                    r: 255,
                    g: 100,
                    b: 0
                });
                console.warn(data)
            }
            err(data){
                prefix({
                    r: 255,
                    g: 0,
                    b: 0
                });
                console.error(data)
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
                [address, GETparams] = (req.url || '').split('?'),
                site = null,
                protocol = req.connection.encrypted ? 'https' : 'http';
            function setHead(name, val){
                try{res.setHeader(name, val)}catch(e){}
            }
            getPrivate(this, 'siteStack').forEach(sitedef => {
                if(!site && sitedef.domain.test(host)) site = sitedef.site;
            });
            if (site){
                site.getPage({
                    address,
                    method: req.method,
                    POST: (req.method != 'POST' ? null : {}),
                    GET: (getArr => {
                        var res = {};
                        getArr.forEach(getArg => {
                            getArg = getArg.split('=');
                            res[decodeURIComponent(getArg.shift())] = decodeURIComponent(getArg.join('='));
                        })
                        return res;
                    })((GETparams || '').split('&')),
                    REQUEST: {},
                    COOKIE: {},
                    port,
                    protocol,
                    fullAddress: `${protocol}://${req.headers.host}${req.url}`,
                    headers: req.headers,
                    response: res
                }).then(({result, code}) => {
                    res.statusCode = code || 200;
                    setHead('Content-Type', 'text/html; charset=utf-8');
                    res.end(result);
                }).catch(err => {
                    this.logger.err(err);
                    res.statusCode = 500;
                    setHead('Content-Type', 'text/html; charset=utf-8');
                    res.end(`<html><head><meta charset="utf-8"></head><body>Internal server error.${
                        process.env.NODE_ENV == 'dev' ? `<br/>Error stack:<hr><div style="overflow:auto;"><pre>${err.stack}</pre></div>` : ''
                    }<hr><h3 style="text-align:center;">LeNode server ${pkg.version}</h3></body></html>`);
                })
            }
            //this.logger.log({req, res})
        }).listen(port);
        settings.router.forEach(site => {
            if (!checkType(site.domain, RegExp) || !checkType(site.folder, String)){
                throw new TypeError('router is not configured propertly')
            } else {
                let siteObj = new (require(site.folder))();
                siteObj.setServerInstanse(this);
                addSite(site.domain, siteObj);
            }
        });
    }
}
class Site{
    constructor(){}
    setServerInstanse(server){
        setPrivate(this, 'system::serverInstanse', server);
        this.logger = server.logger;
    }
}
module.exports = {LeNode, Site}
