const http = require('http');
const {program} = require('commander');
const url = require('url');
const fs = require('fs').promises
const path = require('path');


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


async function read(fpath) {
    try {
        const resolvedPath = path.resolve(fpath);
        const data = await fs.readFile(resolvedPath, { encoding: 'utf-8' }); 
 
        return data;
    } catch (err) {
        console.error("File not found:", err.message); 
    }
}


read("C:/Users/QSUS/Desktop/js/bc2024-4/input.txt").then((data)=>{console.log(data)});




function base_server(req,res){
    let q = url.parse(req.url);
    q = q.pathname;
    
   
    
    res.writeHead(200);


    res.end(q);
}

let server = http.createServer(base_server);
server.listen(port,host)