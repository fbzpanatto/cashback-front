// server.ts (ou server.js)
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
