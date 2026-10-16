const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
http.createServer((req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+path.sep)||!types[path.extname(file)]||!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
  }catch{res.writeHead(400);res.end('Bad request');}
}).listen(5188,'127.0.0.1',()=>console.log('Demo: http://127.0.0.1:5188/admin.html'));
