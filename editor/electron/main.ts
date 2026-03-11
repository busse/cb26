import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { 
  listArticles, 
  readArticle, 
  saveArticle, 
  createArticle, 
  deleteArticle,
  getContentPath 
} from './fileService'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Determine if we're in development or production
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    title: 'CB26 Editor',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#faf9f7',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// App lifecycle
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers for file operations
ipcMain.handle('list-articles', async (_event, collection: string) => {
  return await listArticles(collection)
})

ipcMain.handle('read-article', async (_event, articlePath: string) => {
  return await readArticle(articlePath)
})

ipcMain.handle('save-article', async (_event, articlePath: string, content: string, frontmatter: Record<string, unknown>) => {
  return await saveArticle(articlePath, content, frontmatter)
})

ipcMain.handle('create-article', async (_event, collection: string, slug: string) => {
  return await createArticle(collection, slug)
})

ipcMain.handle('delete-article', async (_event, articlePath: string) => {
  return await deleteArticle(articlePath)
})

ipcMain.handle('get-content-path', async () => {
  return getContentPath()
})
