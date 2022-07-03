window.onload = (event) =>
{
    let cidr = document.querySelector("#cidrSelect");
	let ipAddress = document.querySelector("#ipAddressInput");
	let savedIpAddress = localStorage.getItem("ipAddress");
	let savedCidr = localStorage.getItem("cidr");

	if (savedIpAddress)
	{ 
		ipAddress.value = savedIpAddress;
		cidr.value = savedCidr;
	}
  };

function blankTable() /* Remove elements from the table of subnets. */
{
	let node = document.querySelector("#networkList");

	node.querySelectorAll('*').forEach(n => n.remove());
}

function validate()
{
	let ipAddress = document.querySelector("#ipAddressInput");
	let ipAddressStr = ipAddress.value;
	let cidr = document.querySelector("#cidrSelect");
	let cidrStr = cidr.value;
	let isIPValid = isIPv4Address(ipAddressStr);
	let isCidrValid = isCidr(cidrStr); /* CIDR is valid if something is selected. */
	let ipError = document.querySelector("#ipError");
	let cidrError = document.querySelector("#cidrError");

	if (isIPValid && isCidrValid)
	{ 
		ipAddress.style.borderColor = "#003366";
		cidr.style.borderColor = "#003366";
		ipError.style.display = "none";
		cidrError.style.display = "none";
		localStorage.setItem('ipAddress', ipAddress.value); /* Use local storage, easier than using cookies. */
		localStorage.setItem("cidr", cidrStr);
		cidrStr = cidrStr.substring(0, 2); /* We use CIDR value for our math, not subnet mask. */
		blankTable();
		process(ipAddressStr, cidrStr);
	}
	else
	{
		invalidateInput(ipAddress, isIPValid, ipError);
		invalidateInput(cidr, isCidrValid, cidrError);
	}

}

function invalidateInput(control, onOff, errorLabel)
{

	if (!onOff) {
		control.style.border = "2px solid red";
		errorLabel.style.display = "block";
	}
	else
	{
		control.style.border = "2px solid #003366";
		errorLabel.style.display = "none";
	}

}

function isCidr(cidr)
{
	return !(cidr == "Select CIDR/Subnet value");
}

function process(ipAddress, cidr)
{
	let networkAddress = displayNetwork(ipAddress, cidr);
	let wildcardMask = getWildcardMask(cidr);
	let hostBits = getHostBits(cidr);
	let hosts = countHosts(hostBits);
	let broadcast = getBroadcast(networkAddress, wildcardMask);

	document.querySelector("#networkAddress").innerHTML = networkAddress;
	document.querySelector("#subnetMask").innerHTML = getSubnetMask(cidr);
	document.querySelector("#wildcardMask").innerHTML = wildcardMask;
	document.querySelector("#numNetworks").innerHTML = countNetworks(cidr).toLocaleString();
	document.querySelector("#numAddresses").innerHTML = hosts.toLocaleString();
	
	if (cidr == 32) /* CIDR 32 has only the one host. */
	{
		document.querySelector("#broadcastAddress").innerHTML = "N/A";
		document.querySelector("#numUsuableHosts").innerHTML = "1";
		document.querySelector("#firstHost").innerHTML = networkAddress;
		document.querySelector("#lastHost").innerHTML = networkAddress;
	}	
	else if (cidr == 31) /* CIDR 31 is a special case according to RFC 3021 and is used for point-to-point links. */
	{
		document.querySelector("#broadcastAddress").innerHTML = "N/A";
		document.querySelector("#numUsuableHosts").innerHTML = "2";
		document.querySelector("#firstHost").innerHTML = getLastHost(broadcast);
		document.querySelector("#lastHost").innerHTML = broadcast;
	}
	else
	{ 
		document.querySelector("#broadcastAddress").innerHTML = broadcast;
		document.querySelector("#numUsuableHosts").innerHTML = getUsuableHosts(hosts).toLocaleString();
		document.querySelector("#firstHost").innerHTML = getFirstHost(networkAddress);
		document.querySelector("#lastHost").innerHTML = getLastHost(broadcast);
	}

	showNetworks(networkAddress, wildcardMask, cidr);
}

function getMask(index)
{
	let masks =
	{
		1: 128, 2: 192, 3: 224, 4: 240, 5: 248, 6: 252, 7: 254, 0: 255 /* Lookup is easier than doing math. */
	}

	return masks[index];
}

function mask(toMask, mask)
{
	return (toMask & mask);
}

function displayNetwork(original, cidr)
{
	let toReturn = "";
	const chopped = original.split('.');
	let suffix = "";
	let octet = getOctet(cidr);
	const choppedSubnet = getSubnetMask(cidr).split(".");

	for (let i = 0; i < (octet - 1); i++)
		toReturn += "." + chopped[i];

	for (let j = 1; j < (4 - (octet - 1)); j++)
		suffix += ".0";

	return (toReturn + "." + mask(chopped[octet - 1], choppedSubnet[octet - 1]) + suffix).substring(1);
}

function getOctet(cidr)
{
	return Math.ceil(cidr / 8);
}

function getHostBits(networkBits)
{
	return 32 - networkBits;
}

function countHosts(hostBits)
{
	return Math.pow(2, hostBits);
}

function countNetworks(networkBits)
{
	let reminder = networkBits % 8;

	if ((reminder))
		return Math.pow(2, (networkBits % 8));
	else
		return 256;

}

function getUsuableHosts(hosts)
{
	return (hosts - 2);
}

function getSubnetMask(cidr)
{
	let octet = getOctet(cidr);
	let prefix = "", postfix = "";
	let mask = (cidr % 8); /* We use this to value to look up the subnet mask of the CIDR value in our dictionary. */

	for (let i = 0; i < (octet - 1); i++)
		prefix += "255.";

	for (let j = 1; j < (4 - (octet - 1)); j++)
		postfix += ".0";

	return prefix + getMask(mask) + postfix;
}

function getWildcardMask(cidr)
{
	let mask = getSubnetMask(cidr);
	const choppedMask = mask.split('.');
	let toReturn = "";

	for (let i = 0; i < 4; i++)
		toReturn += (255 - parseInt(choppedMask[i])) + ".";

	return toReturn.slice(0, -1);
}

function getBroadcast(networkAddress, wildcardMask)
{
	let toReturn = "";
	const choppedAddress = networkAddress.split('.');
	const choppedMask = wildcardMask.split('.');

	for (let i = 0; i < 4; i++)
		toReturn += (parseInt(choppedAddress[i]) + parseInt(choppedMask[i])) + ".";

	return toReturn.slice(0, -1);
}

function getFirstHost(broadcast)
{
	let indexOfLastDot = broadcast.lastIndexOf('.');

	return broadcast.substring(0, indexOfLastDot) + "." +
		(parseInt(broadcast.substring(indexOfLastDot + 1)) + 1);
}

function getLastHost(broadcast)
{
	let indexOfLastDot = broadcast.lastIndexOf('.');

	return broadcast.substring(0, indexOfLastDot) + "." +
		(broadcast.substring(indexOfLastDot + 1) - 1);
}

function isIPv4Address(inputString) /* Could we allow ignore zeroes at the start of octets? Consider implementing. */
{
	let regex = new RegExp(/^(([0-9]{1,3}\.){3}[0-9]{1,3})$/);

	if (regex.test(inputString))
	{
		let arInput = inputString.split(".")

		for (let i of arInput)
		{
			if (i.length > 1 && i.charAt(0) === '0')
				return false;
			else
				if ((parseInt(i, 10) < 0) || (parseInt(i, 10) >= 256))
					return false;
		}

	}
	else
		return false;

	return true;
}


function showNetworks(networkAddress, wildcardMask, cidr)
{
	let octet = getOctet(cidr);
	const parts = wildcardMask.split('.');
	let networkSize = parseInt(parts[octet - 1]) + 1;

	for (let i = 0; i < 256; i += networkSize)
		printSubnetRow(networkAddress, i, octet, wildcardMask);

}

function printSubnetRow(address, i, octet, wildcardMask) /* Shows a row of our subnet table. */
{
	const parts = address.split('.');
	let network = "", range = "", broadcast = "";
	let div = document.querySelector("#networkList");
	let text = document.createElement("tr");
	let child, current;

	document.querySelector("#networkListTable").style.display = "block";
	parts[octet - 1] = i;
	network = parts.join('.');
	text.classList.add("table-row");

	if (wildcardMask == "0.0.0.0")  /* This wildcard mask corresponds to a CIDR value of /32 and this "network" only has the single device on it. */
	{
		broadcast = "N/A";
		range = network;
	}
	else if (wildcardMask == "0.0.0.1") /* This wildcard mask corresponds to a CIDR value of /31 and these networks are used for point-RFC 3021. */
	{
		broadcast = "N/A";
		range = network + " - " + getFirstHost(network);
	}
	else
	{
		broadcast = getBroadcast(network, wildcardMask);
		range = getFirstHost(network) + " - " + getLastHost(broadcast);
	}

	const cells = [network, range, broadcast];

	for (let i = 0; i < 3; i++)
	{
		current = div.appendChild(text);
		child = document.createElement("td");
		child.classList.add("table-cell");
		child.innerHTML = cells[i];
		current.appendChild(child);
	}

}

function closePopover()
{
	document.querySelector("#popOver").style.display = "none";
	document.querySelector("#aboutSpan").style.display = "block";
}

function showPopover()
{
	document.querySelector("#popOver").style.display = "block";
	document.querySelector("#aboutSpan").style.display = "none";
}