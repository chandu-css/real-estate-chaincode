const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
let gateway;


async function getContractInstance() {
	
	// A gateway defines which peer is used to access Fabric network
	// It uses a common connection profile (CCP) to connect to a Fabric Peer
	// A CCP is defined manually in file connection-profile-yaml
	gateway = new Gateway();
	
	// A wallet is where the credentials to be used for this transaction exist
	// Credentials for user PROPERTY BUYER or LENDER.
	const wallet = new FileSystemWallet('./identity/user');
	
	// What is the username of this user accessing the network?
	const fabricUserName = 'ADMIN';
	
	// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile-real-estate.yaml', 'utf8'));
	
	// Set connection options; identity and wallet
	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};
	
	// Connect to gateway using specified parameters
	console.log('.....Connecting to Fabric Gateway');
	await gateway.connect(connectionProfile, connectionOptions);
	
	// Access realestate channel
	console.log('.....Connecting to channel - realestatechannel');
	const channel = await gateway.getNetwork('realestatechannel');
	
	// Get instance of deployed contract
	console.log('.....Connecting to Smart Contract');
	return channel.getContract('realestatenet', 'org.realestate-logbook-network.realestatenet');
}

function disconnect() {
	console.log('.....Disconnecting from Fabric Gateway');
	gateway.disconnect();
}

module.exports.getContractInstance = getContractInstance;
module.exports.disconnect = disconnect;