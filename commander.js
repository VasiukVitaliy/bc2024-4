const http = require('http');
const {program} = require('commander');



program
  .requiredOption('-h,--host <URL>', "host")
  .requiredOption('-p,--port <num>', 'port of server')
  .requiredOption('-c,--cache <path>', "path to cache");

program.parse();



    let opt = program.opts();
    if (!opt.host || !opt.port || !opt.cache){throw new Error('no request param');}
    var host = opt.host;
    var port = opt.port;
    var path_to_cache = opt.cache;





function base_server(req,res){
    res.writeHead(200);

    res.end("I'm launched");
}

let server = http.createServer(base_server);
server.listen(port,host);