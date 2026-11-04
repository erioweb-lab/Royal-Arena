import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_DIR = path.resolve(__dirname, 'royal-arena');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Serve ui-patch.js explicitly from project root
app.get('/ui-patch.js', (_req, res) => {
  const patchPath = path.resolve(__dirname, 'ui-patch.js');
  if (fs.existsSync(patchPath)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(patchPath);
  } else {
    res.status(404).send('// ui-patch.js not found');
  }
});

// Intercept /game-view/index.html to inject ui-patch.js script dynamically
app.get('/game-view/index.html', (_req, res) => {
  const htmlPath = path.join(REPO_DIR, 'index.html');
  if (fs.existsSync(htmlPath)) {
    let content = fs.readFileSync(htmlPath, 'utf-8');
    if (!content.includes('ui-patch.js')) {
      content = content.replace('</head>', '<script src="/ui-patch.js"></script>\n</head>');
    }
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(content);
  } else {
    res.status(404).send('Game index.html not found');
  }
});

// Static route to serve the standalone Royal-Arena game directly
app.use('/game-view', express.static(REPO_DIR, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// API Routes
app.get('/api/git/status', async (_req, res) => {
  try {
    if (!fs.existsSync(REPO_DIR)) {
      return res.status(404).json({ error: 'Royal-Arena repository not found in workspace' });
    }

    const { stdout: statusOut } = await execAsync('git status --porcelain -b', { cwd: REPO_DIR });
    const { stdout: logOut } = await execAsync('git log -n 12 --pretty=format:"%h|%an|%ar|%s"', { cwd: REPO_DIR });
    const { stdout: remoteOut } = await execAsync('git remote -v', { cwd: REPO_DIR });

    const lines = statusOut.split('\n').filter(Boolean);
    const branchLine = lines[0] || '';
    const fileLines = lines.slice(1);

    const commits = logOut.split('\n').filter(Boolean).map(line => {
      const [hash, author, date, message] = line.split('|');
      return { hash, author, date, message };
    });

    res.json({
      branch: branchLine.replace('## ', ''),
      changedFiles: fileLines.map(line => ({
        status: line.substring(0, 2).trim(),
        file: line.substring(3).trim(),
      })),
      isClean: fileLines.length === 0,
      recentCommits: commits,
      remote: remoteOut.split('\n')[0] || '',
      repoPath: REPO_DIR,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch git status' });
  }
});

app.get('/api/git/diff', async (req, res) => {
  try {
    const file = req.query.file as string;
    const cmd = file ? `git diff ${JSON.stringify(file)}` : 'git diff HEAD';
    const { stdout } = await execAsync(cmd, { cwd: REPO_DIR, maxBuffer: 10 * 1024 * 1024 });
    res.json({ diff: stdout });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch diff' });
  }
});

app.post('/api/git/pull', async (_req, res) => {
  try {
    const { stdout, stderr } = await execAsync('git pull origin main', { cwd: REPO_DIR });
    res.json({ success: true, output: stdout || stderr });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Git pull failed' });
  }
});

app.post('/api/git/commit-and-push', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Commit message is required' });
    }

    // Stage changes
    await execAsync('git add -A', { cwd: REPO_DIR });

    // Check if there are changes to commit
    const { stdout: statusOut } = await execAsync('git status --porcelain', { cwd: REPO_DIR });
    if (!statusOut.trim()) {
      return res.status(400).json({ error: 'No changes detected to commit.' });
    }

    // Commit
    const safeMsg = message.trim().replace(/"/g, '\\"');
    const { stdout: commitOut } = await execAsync(`git commit -m "${safeMsg}"`, { cwd: REPO_DIR });

    // Push to GitHub
    const { stdout: pushOut, stderr: pushErr } = await execAsync('git push origin main', { cwd: REPO_DIR });

    res.json({
      success: true,
      commitOutput: commitOut,
      pushOutput: pushOut || pushErr || 'Pushed successfully',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Git commit/push failed' });
  }
});

app.post('/api/git/push', async (_req, res) => {
  try {
    const { stdout: pushOut, stderr: pushErr } = await execAsync('git push origin main', { cwd: REPO_DIR });
    res.json({ success: true, pushOutput: pushOut || pushErr || 'Pushed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Git push failed' });
  }
});

app.get('/api/files/list', async (_req, res) => {
  try {
    const files = [
      { name: 'index.html', desc: '메인 게임 엔진 & 캔버스 & 사운드 & 그래픽 (Single File)', size: fs.statSync(path.join(REPO_DIR, 'index.html')).size },
      { name: 'gameplay-roadmap.md', desc: '게임플레이 로드맵 & 버전별 이력 문서', size: fs.statSync(path.join(REPO_DIR, 'gameplay-roadmap.md')).size },
      { name: '게임성-개선-방안.md', desc: '관측 자료 기반 게임성 및 그래픽 후속 개선 방안', size: fs.statSync(path.join(REPO_DIR, '게임성-개선-방안.md')).size },
      { name: 'sw.js', desc: 'PWA 오프라인 캐싱 서비스 워커', size: fs.statSync(path.join(REPO_DIR, 'sw.js')).size },
      { name: 'manifest.json', desc: 'PWA 웹 앱 매니페스트', size: fs.statSync(path.join(REPO_DIR, 'manifest.json')).size },
      { name: 'README.md', desc: '프로젝트 설명서', size: fs.statSync(path.join(REPO_DIR, 'README.md')).size },
    ];
    res.json({ files });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/files/read', async (req, res) => {
  try {
    const filename = req.query.file as string;
    const allowed = ['index.html', 'gameplay-roadmap.md', '게임성-개선-방안.md', 'README.md', 'sw.js', 'manifest.json'];
    if (!allowed.includes(filename)) {
      return res.status(400).json({ error: 'File not permitted or not found' });
    }
    const filePath = path.join(REPO_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ file: filename, content });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/files/save', async (req, res) => {
  try {
    const { file, content } = req.body;
    const allowed = ['index.html', 'gameplay-roadmap.md', '게임성-개선-방안.md', 'README.md', 'sw.js', 'manifest.json'];
    if (!allowed.includes(file)) {
      return res.status(400).json({ error: 'File not permitted' });
    }
    const filePath = path.join(REPO_DIR, file);
    fs.writeFileSync(filePath, content, 'utf-8');
    res.json({ success: true, message: `${file} saved successfully` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite dev server middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
