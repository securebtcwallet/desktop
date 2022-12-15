var BITCOIN_DIGITS = 8;
var BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS);

function _httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send();
    return xmlHttp.responseText;
}

function getBalance(addr) {
    let output = _httpGet("https://blockchain.info/q/addressbalance/"+addr);
    let res = JSON.parse(output);
    return res;
}

function getFees()
{
    let output = _httpGet("https://bitcoinfees.earn.com/api/v1/fees/recommended");
    let res = JSON.parse(output);
    return res.hourFee;   
    return res.fastestFee;   
}

function getUtxo(addr)
{
    let output = _httpGet("https://blockchain.info/unspent?active="+addr);
    let res = JSON.parse(output);
    let unspent = res.unspent_outputs; 
    return unspent.map(function (e) {
        return {
            txid: e.tx_hash_big_endian,
            vout: e.tx_output_n,
            satoshis: e.value,
            confirmations: e.confirmations
        };
    });
}

function satToBtc(amount) {
    return amount/BITCOIN_SAT_MULT;
}

function broadcastTransaction(transaction) {
    console.log(transaction);
    transaction = transaction.trim();
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://blockchain.info/pushtx", false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send('tx='+transaction);
    return xhttp.responseText;
}

function getUtxo(addr)
{
    let output = _httpGet("https://blockchain.info/unspent?active="+addr);
    let res = JSON.parse(output);
    let unspent = res.unspent_outputs; 
    return unspent.map(function (e) {
        return {
            txid: e.tx_hash_big_endian,
            vout: e.tx_output_n,
            satoshis: e.value,
            confirmations: e.confirmations
        };
    });
}
