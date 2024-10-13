const http = require('http');
const {program} = require('commander');
const url = require('url');
const fs = require('fs').promises
const superagent = require("superagent");


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


//let promise= (path)=>{return new Promise((resolve,reject)=>
    //{fs.readFile(path,(err,data)=>{
       // if(err) reject(err)
    //    else resolve(data);
    //});
//});
//}
    
//let g_data;
//promise("input.txt")
    //.then(result=>{
       // g_data = result;
   //    // console.log("read data succesfully");
   //     console.log(result);
   // })
   // .catch((err)=>{console.log("error")})
   // .finally(result=>{
   //     console.log(result);
   // });
   



//let promise2 = (path_2,g_data)=>{return new Promise((resolve,reject)=>{
//    fs.writeFile(path_2,g_data,(err)=>{
//        if(err) reject(err);
//        else resolve();
//    })
//})}

//promise2("output.txt",g_data)
//.then(console.log("Writing data succesfully"))
//.catch((err)=>{console.log("Writing data unsuccesfully")});

let writeFilePromise = (path,data)=>{
    return fs.writeFile(path,data)
}

let readFilePromise = (filePath) => {
    return fs.readFile(filePath);
}
let deleteFile = (path)=>{
    return fs.access(path);
}




function base_server(req,res){
    let q = url.parse(req.url);
    q = q.pathname;
    full_path = path_to_cache + q +".jpg";

   switch(req.method){
    case "GET":{
        
        readFilePromise(full_path).then(result => {
            res.writeHead(200,{'Content-Type': 'image/jpeg'});
            res.write(result);
        })
        .catch(err => {
            res.writeHead(404,{'Content-Type': 'text/html'});
            res.write("404 not found")
        })
        .finally(() => {
            console.log("Operation completed");
            res.end();
        })               
        break;
    }
    case "PUT":{
        
        superagent
            .get('https://http.cat' + q)
            .buffer(true)
            .then((response)=>{
                writeFilePromise(full_path,response.body)
                    .then(()=>{
                        res.writeHead(201,{'Content-Type': 'text/html'});
                        res.write('Photo write');
                        
                        
                    })
                    .catch((err)=>{
                        res.writeHead(422,{'Content-Type': 'text/html'});
                        res.write("422 Unprocessable Entity");
                        
                    })
                    .finally(() => {
                        console.log("complete");
                        res.end();
                    });
            }
            )
            .catch((error)=>{
                res.writeHead(404,{'Content-Type': 'text/html'});
                        res.write("404 not found on another server");
                        res.end();
            })
        
            break;
    }
    case "DELETE":{
        deleteFile(full_path).then((full_path)=>{
            fs.unlink(full_path); 
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("Image deleted");
        })
         .catch((err)=>{
            res.writeHead(404,{'Content-Type': 'text/html'});
            res.write("404 image not found.Not deleted")
            res.end();
         })
        
        break;
    }
    default:{
        res.writeHead(405, { 'Content-Type': 'text/html' });
        res.end("405 Method not allowed");
        break;
    }

   }
}

let server = http.createServer(base_server);
server.listen(port,host)