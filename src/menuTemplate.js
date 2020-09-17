const { app, ipcMain } = require('electron')

const template = [
  {
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
      },
    ],
  },
  {
    label: '视图',
    submenu: [
      {
        label: '刷新当前页面',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => {
          if (focusedWindow) focusedWindow.reload()
        },
      },
      {
        label: '切换全屏幕',
        accelerator: (() => {
          if (process.platform === 'darwin') return 'Ctrl+Command+F'
          else return 'F11'
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        },
      },
      {
        label: '切换开发者工具',
        accelerator: (function () {
          if (process.platform === 'darwin') return 'Alt+Command+I'
          else return 'Ctrl+Shift+I'
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) focusedWindow.toggleDevTools()
        },
      },
    ],
  },
  {
    label: '窗口',
    role: 'window',
    submenu: [
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
    ],
  },
]

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        label: `关于 ${name}`,
        accelerator: null,
        role: 'about',
      },
      {
        type: 'separator',
      },
      {
        label: '设置',
        accelerator: 'Command+,',
        click: () => {
          ipcMain.emit('open-settings-window')
          console.log('设置')
        },
      },
      {
        label: '服务',
        role: 'services',
        accelerator: null,
      },
      {
        type: 'separator',
      },
      {
        label: `隐藏 ${name}`,
        accelerator: 'Command+H',
        role: 'hide',
      },
      {
        label: '隐藏其它',
        accelerator: 'Command+Alt+H',
        role: 'hideothers',
      },
      {
        label: '显示全部',
        role: 'unhide',
        accelerator: null,
      },
      {
        type: 'separator',
      },
      {
        label: '退出',
        accelerator: 'Command+Q',
        click: () => {
          app.quit()
        },
      },
    ],
  })
} else {
  template[0].submenu.push({
    label: '设置',
    accelerator: 'Ctrl+,',
    click: () => {
      console.log('设置')
    },
  })
}

module.exports = template
