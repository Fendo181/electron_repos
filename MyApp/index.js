'use script';

//モジュールを読み込む
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow; // Blowserを読み込む
const Menu = electron.Menu; //メニューモジュールを作成する。
const dialog = electron.dialog; //ダイアログを読み込む。
const ipcMain = electron.ipcMain; //ipcモジュールを読むこむ。ipc:inter-Process Communication

// ブロックスコープの局所変数を宣言
let mainWindow;
let settingsWindow;

// background default value
// let backgroundColor = 'skyblue';

let menuTemplate = [{
    label: 'MyApp',
    submenu: [
        { label: 'About', accelerator: 'CmdOrCtrl+Shift+A', click: function(){
            showAboutDaialog();
        } },
        { type: 'separator'},
        { label: 'Setting', accelerator: 'CmdOrCtrl+,', click: function(){
            showSettingWindow();
        } },
        { type: 'separator'},
        { label: 'Quit', accelerator: 'CmdOrCtrl+C', click: function(){
            app.quit();
        } }
    ]
}]

//テンプレートを読みこんでくる。
let menu = Menu.buildFromTemplate(menuTemplate)

// settings.htmlから送られてきた値を受け取る。
ipcMain.on('settings_changed', function(event, color) {
    mainWindow.webContents.send('set_bgcolor', color);
});

// ipcMain.on('bgcolor_changed', function(event, color) {
//     // 同期処理でsettingにも反映される。
//     backgroundColor = color;
// });

//  ipcMain.on('get_bgcolor', function(event) {
//     event.returnValue = backgroundColor;
//  });

function showAboutDaialog(){
    dialog.showMessageBox({
        type: 'info',
        buttons: ['OK'],
        message: 'About This App',
        detail: 'This app was created by @Fendo181'
    })
}

function showSettingWindow(){
    // create window
    settingsWindow = new BrowserWindow({width: 600, height:400 });
    settingsWindow.loadURL('file://'+ __dirname + '/settings.html');
    // chomeのツールを読み込む
    // settingsWindow.webContents.openDevTools();
    settingsWindow.show();
    // 閉じた際の処理
    settingsWindow.on('closed', function(){
        settingsWindow = null;
    });
}

function createMainWinowd(){
    Menu.setApplicationMenu(menu);
    // create window
    mainWindow = new BrowserWindow({width: 600, height:400 });
    mainWindow.loadURL('file://'+ __dirname + '/index.html');
    // chomeのツールを読み込む
    // mainWindow.webContents.openDevTools();
    // 閉じた際の処理
    mainWindow.on('closed', function(){
        mainWindow = null;
    });
}

// 開かれた際の処理
app.on('ready', function(){
    createMainWinowd();
});

app.on('window-all-closed', function(){
    //macユーザ以外の処理
    if(process.platform !== 'darein'){
        app.quit();
    }
});

// ウィンドウが閉じられたけれど
// Dock アイコンや Spotlight から再度アプリが呼び出されたときにウィンドウを作る処理
app.on('activate',function(){
    if(mainWindow  === null){
      createMainWinowd();
    }
});
