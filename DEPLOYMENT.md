# Deployment Guide for Hostinger

## Prerequisites
- Hostinger hosting plan with Node.js support
- Domain name (optional, can use subdomain)
- SSH access to your Hostinger account

## Step-by-Step Deployment

### 1. Prepare Your Files

Upload the following to your Hostinger hosting:
- `server.js`
- `package.json`
- `public/` folder (with `styles.css`)
- `markdown-files/` folder (with all your `.md` files)
- `node_modules/` folder (upload this after running `npm install` locally)

**Alternative**: Upload all files except `node_modules`, then run `npm install` on the server via SSH.

### 2. Upload via FTP/SFTP

1. Connect to your Hostinger via FTP/SFTP
2. Upload all project files to your desired directory (usually `public_html` or a subfolder)

### 3. Install Dependencies (via SSH)

```bash
cd /path/to/your/project
npm install --production
```

### 4. Configure Port

Hostinger typically assigns a specific port for Node.js applications. Update your `.env` file or modify `server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

Hostinger will automatically provide the `PORT` environment variable.

### 5. Start the Application

Via SSH or Hostinger's control panel:

```bash
npm start
```

Or use a process manager like PM2 (recommended for production):

```bash
npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

### 6. Configure Domain/Subdomain

In your Hostinger control panel:
1. Go to **Hosting** → **Manage** → **Advanced**
2. Find **Node.js** section
3. Set your application path and port
4. Configure domain/subdomain routing

### 7. Set Up Auto-Start (Optional)

Create a `ecosystem.config.js` file for PM2:

```javascript
module.exports = {
  apps: [{
    name: 'markdown-viewer',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

Then start with:
```bash
pm2 start ecosystem.config.js
```

## Environment Variables (Optional)

Create a `.env` file for production settings:

```env
PORT=3000
NODE_ENV=production
```

## Security Considerations

1. **Never commit `.env` files** to version control
2. **Set proper file permissions** on the server
3. **Enable HTTPS** via Hostinger's SSL certificates
4. **Keep dependencies updated**: `npm audit fix`

## Troubleshooting

### App won't start
- Check logs: `pm2 logs` or `node server.js` directly
- Verify port configuration in Hostinger panel
- Ensure all dependencies are installed

### Can't access markdown files
- Verify `markdown-files/` folder is uploaded
- Check file permissions (should be readable)
- Verify file paths in `server.js`

### Port already in use
- Change the PORT in your environment
- Kill existing processes: `lsof -ti:3000 | xargs kill`

## Updating Your App

1. Upload updated files
2. Run `npm install` if dependencies changed
3. Restart the app: `pm2 restart markdown-viewer`

## Monitoring

View app status:
```bash
pm2 status
pm2 logs markdown-viewer
```

## Backup

Regularly backup your `markdown-files/` folder as it contains all your content.

---

**Need Help?** 
- Hostinger Support: https://www.hostinger.com/contact
- Hostinger Node.js Guide: https://www.hostinger.com/tutorials/nodejs-tutorial
