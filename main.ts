// Modules to control application life and create native browser window
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} = require('electron-devtools-installer')
const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const menuTemplate = require('./src/menuTemplate')

let tray = null
let timer = null
let count = 0

const iconImg = isDev
  ? nativeImage.createFromPath(path.join(__dirname, './assets/trayIcon.png'))
  : nativeImage.createFromPath(path.join(__dirname, './trayIcon.png'))
const iconEmptyImg = isDev
  ? nativeImage.createFromPath(
      path.join(__dirname, './assets/trayEmptyIcon.png'),
    )
  : nativeImage.createFromPath(path.join(__dirname, './trayEmptyIcon.png'))
const trayNotice = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
    count = 0
  }
  timer = setInterval(function () {
    count++
    if (count % 2 === 0) {
      tray.setImage(iconEmptyImg)
    } else {
      tray.setImage(iconImg)
    }
  }, 500)
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
  })

  const urlLocation = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, './index.html')}`
  // and load the index.html of the app.
  mainWindow.loadURL(urlLocation)
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  // set the menu
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  tray = new Tray(iconImg)
  trayNotice()
  tray.on('click', () => {
    // 清楚图标闪烁定时器
    clearInterval(timer)
    timer = null
    count = 0
    // 还原图标
    tray.setImage(iconImg)
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  await installExtension(REACT_DEVELOPER_TOOLS)
  await installExtension(REDUX_DEVTOOLS)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
