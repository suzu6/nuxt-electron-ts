import { app, ipcMain } from 'electron'
import nuxtConfig from '../renderer/nuxt.config'
import path from 'path'
import MainWindow from './MainWindow'
const http = require('http')
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


let mainWindow = null;
app.on('ready', () => {
  console.log('ready')
  // メインウィンドウの読み込み
  mainWindow = new MainWindow();
  mainWindow.isDev = isDev;
  mainWindow.nuxt_url = _NUXT_URL_;
  mainWindow.loadWindow();
})
app.on('window-all-closed', () => app.quit())

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