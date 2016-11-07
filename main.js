const electron = require('electron');
const {
    app,
    BrowserWindow,
    Menu,
    session
} = electron;


app.on('ready', function() {

    const ses = session.fromPartition('persist:name')
    ses.clearCache(function(){});

    var win = new BrowserWindow({
        show: false,
        width: "1600",
        height: "1200"
    });

    win.maximize();

    setTimeout(function(){
        win.loadURL('file://' + __dirname + '/src/DSKindex.html');
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
