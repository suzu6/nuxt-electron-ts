import { app, BrowserWindow, ipcMain } from 'electron'
import nuxtConfig from '../renderer/nuxt.config'
const http = require('http')
import path from 'path'
import axios from 'axios'
const { Nuxt, Builder } = require('nuxt')

// @ts-ignore
nuxtConfig.rootDir = path.resolve('src/renderer')
// @ts-ignore
const isDev = nuxtConfig.dev

const nuxt = new Nuxt(nuxtConfig)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)

let _NUXT_URL_ = ''

if (isDev) {
  builder.build().catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
  server.listen()
  _NUXT_URL_ = `http://localhost:${server.address().port}`
  console.log(`Nuxt working on ${_NUXT_URL_}`)
} else {
  // eslint-disable-next-line no-path-concat
  _NUXT_URL_ =
    'file://' + path.resolve(__dirname, '../../dist/nuxt-build/index.html')
}

let win: any = null
async function newWin() {
  win = new BrowserWindow({
    width: 1000,
    height: 900,
    title: "myapp",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(path.join(__dirname, 'preload.js')),
      webSecurity: false,
    },
  })
  win.hide();
  win.on('closed', () => (win = null))
  if (isDev) {
    const {
      default: installExtension,
      VUEJS_DEVTOOLS,
    } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS.id)
      .then((name: any) => {
        console.log(`Added Extension:  ${name}`)
        // Aboid Error: Extension server error: Object not found: <top>
        // https://github.com/SimulatedGREG/electron-vue/issues/389#issuecomment-464706838
        win.webContents.on('did-frame-finish-load', () => {
          win.webContents.openDevTools();
          win.webContents.on('devtools-opened', () => {
            win.focus();
          });
        });
      })
      .catch((err: any) => console.log('An error occurred: ', err))
    const pollServer = () => {
      return new Promise(resolve => {
        axios.get(_NUXT_URL_)
          .then(async response => {
            if (response.status === 200) {
              await win.loadURL(_NUXT_URL_)
              win.show();
              resolve(response);
            } else {
              console.log('restart poolServer')
              setTimeout(pollServer, 300)
            }
          })
          .catch(error => {
            console.log(error.message)
            resolve(error.message);
          });
      })
    }
    await pollServer()
    console.log('_NUXT_URL_', _NUXT_URL_)

  } else {
    return win.loadURL(_NUXT_URL_)
  }
}

app.on('ready', () => {
  console.log('ready')
  newWin()
})
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())

ipcMain.handle('open', (event, message) => {
  // 受信 ping!
  console.log(message);
  return 'pong'
});

ipcMain.handle('save', (event, data) => {
  // 受信 ping!
  console.log(data);
  return 'pong'
});