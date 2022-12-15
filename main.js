const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const seedToWallet = require('./seedToWallet');
const signTransaction = require('./sendBitcoin');
const { validate } = require('bitcoin-address-validation');
var mainseed;
var privatekey;
var sendFrom;
var sendTo;
var sendAmount;
var sendFees;
var sendUtxo;

async function handleSeedToWallet() {
  let _ =  seedToWallet(mainseed);
  privatekey = _.key;
  sendFrom = _.address;
  return _;
}

async function handleSignTransactionReq() {
  //console.log("handle sign send bitcoin req: "+sendFrom+ " "+privatekey+ " "+ sendTo + " "+sendAmount+ " "+sendFees+" "+sendUtxo)
  if(!validate(sendTo, 'mainnet')) {
    return "Error: Invalid Bitcoin address"; 
  }
  try { 
    let res = signTransaction(sendFrom, privatekey, sendTo, sendAmount, sendFees, sendUtxo);
    return res;
  }
  catch(e) {
    return "Error: " + e;
  }
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: (process.platform !== 'win32' ? 800 : 834),
    height: (process.platform !== 'win32' ? 600 : 630),
    icon: __dirname + "/build/icon.ico",
    sandbox: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,  
      allowRunningInsecureContent: true,
      enableBlinkFeatures: 'ExecCommandInJavaScript',
      contextIsolation: true,
      experimentalFeatures: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  ipcMain.on('setSeedReq', (event, seed) => {
    mainseed = seed;
  })

  ipcMain.on('createTransactionReq', (event, to, amount, fees, utxo) => {
    sendTo = to;
    sendAmount = amount;
    sendFees = fees;
    sendUtxo = utxo;
  });

  mainWindow.loadFile('index_ru.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('getSeedToWalletReq', handleSeedToWallet);
  ipcMain.handle('signTransactionReq', handleSignTransactionReq);
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


