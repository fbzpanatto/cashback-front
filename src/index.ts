// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { createProxyMiddleware } from 'http-proxy-middleware';
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// const app = express();
// const PORT = parseInt(process.env['PORT'] || '4200');
//
// const API_URL = 'https://cashbacknode25.up.railway.app/';
//
// app.use('/api', createProxyMiddleware({
//   target: API_URL,
//   changeOrigin: true,
//   pathRewrite: { '^/api': '' },
//   logger: console,
//   secure: true
// }));
//
// const staticFilesPath = path.join(__dirname, 'browser');
// app.use(express.static(staticFilesPath));
//
// app.get('/health', (req: Request, res: any) => res.sendStatus(200));
//
// app.get('*', (req, res) => {
//   res.sendFile(path.join(staticFilesPath, 'index.html'));
// });
//
// app.listen(PORT, () => {
//   console.log(`🚀 Frontend rodando na porta: ${PORT}`);
//   console.log(`🔗 Conectado à API: ${API_URL}`);
//   console.log(`🌐 Acesse: https://cashback-front.up.railway.app`);
// });

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env['PORT'] || '4200');

// Configuração do caminho dos arquivos estáticos
const staticPath = path.join(__dirname, 'browser');

// Middleware para arquivos estáticos
app.use(express.static(staticPath));

// Health check para o Railway
app.get('/health', async (req: Request, res: any) => res.sendStatus(200));

// Todas as rotas não encontradas vão para o Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📁 Servindo arquivos de: ${staticPath}`);
});
