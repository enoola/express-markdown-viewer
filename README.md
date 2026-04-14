# Simple Obsidian View

A simple Node.js application for viewing Markdown files with an Obsidian-like interface.

## Features

- View and browse Markdown files
- Clean, minimal UI styling
- Built with Node.js and Express

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. Open your browser and navigate to `http://localhost:3000` (or the port specified in your server configuration).

## Project Structure

```
├── server.js              # Main server file
├── public/                # Static assets
│   ├── styles.css         # CSS styles
│   └── samuel2006_nobg.png
├── markdown-files/        # Markdown content
│   ├── _welcome.md
│   ├── online-projects.md
│   └── who-ami-i.md
└── package.json           # Project dependencies and scripts
```

## License

MIT
