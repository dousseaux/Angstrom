const electron = require('electron');
const {
    app,
    BrowserWindow,
    Menu
} = electron;

app.on('ready', function() {

    var win = new BrowserWindow({
        show: false,
        width: "1600",
        height: "1200"
    });

    win.maximize();

    setTimeout(function(){
        win.loadURL('file://' + __dirname + '/index.html');
    }, 500);

    setTimeout(function(){
        win.show();
    }, 2500);

    //win.openDevTools();

    // var menu = Menu.buildFromTemplate([{
    //     label: 'Angstrom'
    // }]);

    //Menu.setApplicationMenu(menu);
});
