const http = require('http');
const {program} = require('commander');
const url = require('url');
const fs = require('fs').promises
const path = require('path');
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

let promise2 = (path_2, g_data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path_2+ q, g_data, 'binary', (err) => {
        if (err) {
          reject(err); // Якщо помилка, повертаємо її
        } else {
          resolve(); 
        }
      });
    });
  };


let readFilePromise = (filePath) => {
    return fs.readFile(filePath);
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
            res.writeHead(404,{'Content-Type': 'image/jpeg'});
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
            .get('https://http.cat/404')
            .buffer(true)
            .then((response)=>{
                promise2(path_to_cache,response.body)
                    .then(()=>{
                        res.writeHead(201,{'Content-Type': 'image/jpeg'});
                        
                    })
                    .catch((err)=>{
                        res.writeHead(404,{'Content-Type': 'text/html'});
                        res.write("404 file not write")
                    })
                    .finally(() => {
                        console.log("Operation completed");
                        res.end();
                    });
            }
            )
        
            break;
    }
    case "DELETE":{
        try{
         fs.unlink(full_path); 
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("Image deleted");
        }catch(err){
            res.writeHead(404,{'Content-Type': 'text/html'});
            res.write("404 not found")
        }
        break;
    }
    default:{
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end("Method not allowed");
        break;
    }

   }
}

let server = http.createServer(base_server);
server.listen(port,host)