const http = require("http")

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        res.write(" hello world")
        res.end();
    }
})

server.listen(5000);
console.log('server is listenig')