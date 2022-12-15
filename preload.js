const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setSeed: (seed) => ipcRenderer.send('setSeedReq', seed),
    seedToWallet: () => ipcRenderer.invoke('getSeedToWalletReq'),
    createTransaction: (to, amount, fees, utxo) => ipcRenderer.send('createTransactionReq', to, amount, fees, utxo),
    signTransaction: () => ipcRenderer.invoke('signTransactionReq')
})
