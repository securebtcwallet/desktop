var seed = window.localStorage.getItem("seed");
var address;
window.electronAPI.setSeed(seed);
if(seed) {
    let res =   window.electronAPI.seedToWallet(seed);
    res.then(r=>{
        address = r.address;
        window.localStorage.setItem("address", address);
    });
}
