import { BrowserWindow } from "electron";
import path from "path";
import axios from 'axios'


/**
 * メインウィンドウ
 */
export default class MainWindow {
  private _window: BrowserWindow;
  private _isDev: boolean = true;
  private _NUXT_URL_: string = '';

  set isDev(isDev: boolean) {
    this._isDev = isDev;
  }
  set nuxt_url(_NUXT_URL_: string) {
    this._NUXT_URL_ = _NUXT_URL_;
  }

  constructor() {
    // Create the browser window.
    this._window = new BrowserWindow({
      width: 1000,
      height: 900,
      title: "myapp",
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.resolve(path.join(__dirname, './preload.js')),
        webSecurity: false,
      },
    })
    this.setWindowEvents();
  }


  /**
   * ウィンドウのイベントを定義する。
   */
  private setWindowEvents() {
    const window = this._window;
    this._window.on('closed', () => (window.destroy()))
  }

  /**
   * ページを読み込む
   */
  public async loadWindow() {
    if (this._isDev) {
      this.devLoadWindow()
    } else {
      await this._window.loadURL(this._NUXT_URL_)
    }
  }

  /**
   * 開発モードでページを読み込む
   */
  private async devLoadWindow() {
    const {
      default: installExtension,
      VUEJS_DEVTOOLS,
    } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS.id)
      .then((name: any) => {
        console.log(`Added Extension:  ${name}`)
        // Aboid Error: Extension server error: Object not found: <top>
        // https://github.com/SimulatedGREG/electron-vue/issues/389#issuecomment-464706838
        this._window.webContents.on('did-frame-finish-load', () => {
          this._window.webContents.openDevTools();
          this._window.webContents.on('devtools-opened', () => {
            this._window.focus();
          });
        });
      })
      .catch((err: any) => console.log('An error occurred: ', err))
    const pollServer = () => {
      return new Promise(resolve => {
        axios.get(this._NUXT_URL_)
          .then(async response => {
            if (response.status === 200) {
              await this._window.loadURL(this._NUXT_URL_)
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
    console.log('_NUXT_URL_', this._NUXT_URL_)
  }
}
