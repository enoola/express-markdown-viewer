const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3000;

const MARKDOWN_DIR = path.join(__dirname, 'markdown-files');

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Get all markdown files from the directory
function getMarkdownFiles() {
  try {
    if (!fs.existsSync(MARKDOWN_DIR)) {
      return [];
    }
    
    const files = fs.readdirSync(MARKDOWN_DIR)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        name: file,
        title: file.replace('.md', '').replace(/[-_]/g, ' '),
        path: file
      }));
    
    return files.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error reading markdown files:', error);
    return [];
  }
}

// Read and parse a markdown file
function readMarkdownFile(filename) {
  try {
    const filePath = path.join(MARKDOWN_DIR, filename);
    
    // Security check: ensure the file is within the markdown directory
    if (!filePath.startsWith(MARKDOWN_DIR)) {
      return null;
    }
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}

// Homepage - list all markdown files
app.get('/', (req, res) => {
  const files = getMarkdownFiles();
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Viewer</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="container">
    <nav class="sidebar">
      <h1 class="sidebar-title"><img src="/samuel2006_nobg.png" alt="Logo"> Markdown Files</h1>
      <ul class="file-list">
        ${files.map(file => `
          <li>
            <a href="/view/${encodeURIComponent(file.path)}">${file.title}</a>
          </li>
        `).join('')}
      </ul>
    </nav>
    <main class="main-content">
      <div class="welcome">
        <h1>Welcome to Markdown Viewer</h1>
        <img src="/samuel2006_nobg.png" alt="Samuel 2006 Pic"/>
        <p>Select a markdown file from the sidebar to view its contents.</p>
        <div class="stats">
          <p><strong>${files.length}</strong> markdown file${files.length !== 1 ? 's' : ''} available</p>
        </div>
      </div>
    </main>
  </div>
</body>
</html>
  `;
  
  res.send(html);
});

// View a specific markdown file
app.get('/view/:filename', (req, res) => {
  const filename = req.params.filename;
  const files = getMarkdownFiles();
  const currentFile = files.find(f => f.path === filename);
  
  if (!currentFile) {
    return res.status(404).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>File Not Found</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="container">
    <nav class="sidebar">
      <h1 class="sidebar-title"><img src="/samuel2006_nobg.png" alt="Logo"> Markdown Files</h1>
      <ul class="file-list">
        ${files.map(file => `
          <li>
            <a href="/view/${encodeURIComponent(file.path)}">${file.title}</a>
          </li>
        `).join('')}
      </ul>
    </nav>
    <main class="main-content">
      <div class="error">
        <h1>404 - File Not Found</h1>
        <p>The requested markdown file does not exist.</p>
        <a href="/" class="btn">← Back to Home</a>
      </div>
    </main>
  </div>
</body>
</html>
    `);
  }
  
  const markdownContent = readMarkdownFile(filename);
  
  if (markdownContent === null) {
    return res.status(500).send('<h1>Error reading file</h1>');
  }
  
  const htmlContent = marked(markdownContent);
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentFile.title} - Markdown Viewer</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="container">
    <nav class="sidebar">
      <h1 class="sidebar-title"><img src="/samuel2006_nobg.png" alt="Logo"> Markdown Files</h1>
      <ul class="file-list">
        ${files.map(file => `
          <li class="${file.path === filename ? 'active' : ''}">
            <a href="/view/${encodeURIComponent(file.path)}">${file.title}</a>
          </li>
        `).join('')}
      </ul>
    </nav>
    <main class="main-content">
      <article class="markdown-body">
        ${htmlContent}
      </article>
    </main>
  </div>
</body>
</html>
  `;
  
  res.send(html);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Markdown Viewer running on port ${PORT}`);
  console.log(`📂 Markdown directory: ${MARKDOWN_DIR}`);
  console.log(`🌐 Open http://localhost:${PORT} in your browser`);
});
