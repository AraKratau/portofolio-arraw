const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const targetDir = path.resolve(rootDir, 'assets/images');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

let savedCount = 0;
const totalExpected = 5;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const filePath = path.join(targetDir, data.filename);
                const buffer = Buffer.from(data.base64, 'base64');
                fs.writeFileSync(filePath, buffer);
                savedCount++;
                console.log(`[SAVED ${savedCount}/${totalExpected}] ${data.filename} (${buffer.length} bytes)`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, filename: data.filename }));

                if (savedCount >= totalExpected) {
                    console.log('ALL 5 THUMBNAILS SAVED SUCCESSFULLY!');
                    setTimeout(() => {
                        server.close();
                        process.exit(0);
                    }, 500);
                }
            } catch (err) {
                console.error('Error saving image:', err);
                res.writeHead(500);
                res.end(err.message);
            }
        });
        return;
    }

    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '/convert') reqPath = '/scratch/convert_pdf.html';
    const filePath = path.join(rootDir, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.png': 'image/png'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
        return;
    }

    res.writeHead(404);
    res.end('Not found');
});

server.listen(3333, () => {
    console.log('Server ready at http://localhost:3333/');
});
