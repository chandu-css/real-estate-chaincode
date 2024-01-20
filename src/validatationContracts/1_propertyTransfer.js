'use strict';

/**
 * This is a Node.JS application to validate property on the network.
 */

let gateway;

import getContractInstance from './contractHelper';

async function main(newOwnerName, surveyNo, transactionDate, transactionType) {

	try {

		const Contract = await getContractInstance();

		// Add property to the network
		console.log('.....Add new property owner to the network');
		const propertyBuffer = await Contract.submitTransaction('addNewPropertyOwner', newOwnerName, surveyNo, transactionDate, transactionType);

		// process response
		console.log('.....Processing add new property owner transaction response \n\n');
		let newPropertyOwner = JSON.parse(propertyBuffer.toString());
		console.log(newPropertyOwner);
		console.log('\n\n.....Add New Property Owner Transaction Complete!');
		return newPropertyOwner;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		console.log('.....Disconnecting from Fabric Gateway');
		gateway.disconnect();

	}
}

main('Bojjappa Raman', 'SN12-3', '20-12-2023', 'SELL').then(() => { // user inputs
	console.log('Added New Property Owner to the network.');
});

module.exports.execute = main;