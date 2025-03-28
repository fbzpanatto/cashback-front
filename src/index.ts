import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env['PORT'] || '4200');

// const API_URL = 'https://app-cashback.up.railway.app/';
const API_URL = 'http://54.226.255.81:3000';

app.use('/api', createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
  logger: console,
  secure: true
}));

const staticFilesPath = path.join(__dirname, 'browser');
app.use(express.static(staticFilesPath));

app.get('/health', (req: Request, res: any) => res.sendStatus(200));

app.get('*', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend rodando na porta: ${PORT}`);
  console.log(`🔗 Conectado à API: ${API_URL}`);
  console.log(`🌐 Acesse: https://cashback-front.up.railway.app`);
});
