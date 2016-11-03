const electron = require('electron');
const {app, BrowserWindow, Menu} = electron;

app.on('ready', function(){

    var win = new BrowserWindow({width:"1280", height:"960"});
    win.loadURL('file://' + __dirname + '/start_desktop.html');
    win.openDevTools();

    var menu = Menu.buildFromTemplate([
        {
            label: 'Angstrom',
            submenu: [
                {
                    label: 'Preferences',
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);
});
