#!/usr/bin/env node

const fs = require("fs");
const prompt = require('prompt');
const colors = require("colors/safe");
const keythereum = require("keythereum");


const wanchainLog = require('../utils/wanchainLog');
const tokenInit = require('../utils/tokenInitFunc');

const config = require('../config');

// Start the prompt
prompt.start();
prompt.message = colors.blue("wanWallet");
prompt.delimiter = colors.green("$");

wanchainLog('Input your keystore file name: ', config.consoleColor.COLOR_FgGreen);
prompt.get(require('../utils/schema/mykeystore'), function (err, result) {
	try {
		let filename = "./keystore/" + result.OrdinaryKeystore + ".json";
		let keystoreStr = fs.readFileSync(filename, "utf8");

		let keystore = JSON.parse(keystoreStr)[1];
		console.log('Your keystore: ', keystore);

		wanchainLog('Pls input your password to unlock your wallet', config.consoleColor.COLOR_FgGreen);
		prompt.get(require('../utils/schema/keyPassword'), function (err, result) {
			wanchainLog('Waiting for unlock wallet....', config.consoleColor.COLOR_FgRed);

			let keyAObj = {version:keystore.version, crypto:keystore.crypto};

			try {
				const privKeyA = keythereum.recover(result.keyPassword, keyAObj);
				const address = keystore.address;
				const waddress = keystore.waddress;

			 	tokenInit(address, waddress, privKeyA);

			} catch (e) {
				wanchainLog('Password invalid', config.consoleColor.COLOR_FgRed);
			}
		});
	} catch (e) {
		wanchainLog('File name invalid (without file format)', config.consoleColor.COLOR_FgRed);
	}
});

