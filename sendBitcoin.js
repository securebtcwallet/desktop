var bitcoin = require('bitcoinjs-lib');

const network = bitcoin.networks.mainnet
const path = `m/49'/0'/0'/0` 

var BITCOIN_DIGITS = 8;
var BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS);

function getTransactionSize (numInputs, numOutputs) {
	return numInputs*180 + numOutputs*34 + 10 + numInputs;
}

function btcToSat(amount) {
    return Math.floor(amount*BITCOIN_SAT_MULT);
}

function signTransaction (from, privKeyWIF, to, amount, feePerByte, utxos) {
	let minConfirmations = 1;

	var amtSatoshi = btcToSat(amount);
	var bitcoinNetwork = bitcoin.networks.bitcoin;

	var tx = new bitcoin.TransactionBuilder(bitcoinNetwork);
		var ninputs = 0;
		var availableSat = 0;
		for (var i = 0; i < utxos.length; i++) {
			var utxo = utxos[i];
			if (utxo.confirmations >= minConfirmations) {
				tx.addInput(utxo.txid, utxo.vout);
				availableSat += utxo.satoshis;
				ninputs++;

				if (availableSat >= amtSatoshi) break;
			}
		}

		if (availableSat < amtSatoshi) {
            throw "You do not have enough in your wallet to send that much. Available: "+availableSat+" .. amtSatoshi: "+amtSatoshi;
        }

		var change = availableSat - amtSatoshi;
		var fee = getTransactionSize(ninputs, change > 0 ? 2 : 1)*feePerByte;
		if (fee > amtSatoshi) throw "BitCoin amount ("+amtSatoshi+") must be larger than the fee ("+fee+"). (Ideally it should be MUCH larger)";
		tx.addOutput(to, amtSatoshi - fee);
		if (change > 0) tx.addOutput(from, change);
		var keyPair = bitcoin.ECPair.fromWIF(privKeyWIF, bitcoinNetwork);
		for (var i = 0; i < ninputs; i++) {
			tx.sign(i, keyPair);
		}
		var msg = tx.build().toHex();
        return msg;
}

module.exports = signTransaction;
