const fs=require('fs'),http=require('http'),path=require('path'),os=require('os');
const root=__dirname,port=8788,types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{let u;try{u=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end('Bad request')}if(u==='/')u='/index.html';const file=path.resolve(root,'.'+u);if(!file.startsWith(path.resolve(root)+path.sep)){res.writeHead(403);return res.end('Forbidden')}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data)})});
server.on('error',error=>{console.error('服务器启动失败：'+error.message);process.exitCode=1});
server.listen(port,'0.0.0.0',()=>{console.log('手机扫码3D展馆服务器已启动，按 Ctrl+C 停止。');console.log('电脑访问：http://127.0.0.1:'+port+'/');for(const addresses of Object.values(os.networkInterfaces()))for(const a of addresses||[])if(a.family==='IPv4'&&!a.internal)console.log('手机访问：http://'+a.address+':'+port+'/')});

