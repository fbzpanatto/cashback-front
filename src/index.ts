import express from 'express';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const fullPath = path.join(__dirname, '/browser')

// Serve static files from Angular dist folder
app.use(express.static(fullPath))

// Redirect all requests to index.html (Angular routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(fullPath, '/index.html'));
});

const PORT = 4200;
app.listen(PORT, () => {
  console.log(`🚀 Angular app running on port ${PORT}`);
});
