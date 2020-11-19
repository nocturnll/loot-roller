const Discord = require('discord.js')
const client = new Discord.Client()

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }
    
    if (receivedMessage.content.startsWith("!loot")) {
        processCommand(receivedMessage)
    }
})







// node roll.js [# of kills] ['true' if +1 to loot, otherwise nothing]


let yourLoot = []; // array of the loot you receive
let yourGold = 0; // keep track of gold received
let gearRolls = 0; // keep track of how much gear you get
let newGear = ''; // final string of gear + bonus words
let eachGold = ''; // count each increment of gold
let lootTable = [' _Nothing_', ' _(Gold)_', ' _(Item)_', ' **[Materials]**', ' _(Gold+)_', ' _(Item+)_'];
let itemTable = [' **[Supplies]**', ' **[Health Potion]**', ' **[Mana Potion]**', ' **[Scroll of Town Portal]**', ' **[Scroll of Identify]**', ' _(Gear)_'];
let gearTable = ['Weapon or Shield', 'Helm', 'Chest Armour', 'Gauntlets', 'Boots', 'Belt'];
let magicWeapon = ['of Slaying (+1 dmg to enemy group)', 'Piercing (ignore 1 armour) ', 'of the Bat (restore 1 mana upon kill)', 'of the Leech (restore 1 life upon strike)', 'of', 'Socketed ']
let magicGear = ['of Attribute', 'of Thorns (+1 dmg to attacker when hit)', 'Adventuring (+1XP at end of session) ', 'of Greed (+1 to gold rolls)', '', 'Socketed ']
let elements = ['Physical Damage', 'the Arcane', 'Lightning', 'Poison', 'Fire', 'Cold']
let colours = ['Black ', 'Diamond ', 'Topaz ', 'Emerald ', 'Ruby ', 'Sapphire ']


function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // all other words are arguments/parameters/options for the command
    let yourKills = arguments[0];
    let yourExtraGold = arguments[1]; // must be true for extra gold roll
    let player = receivedMessage.author;
    yourLoot = [];
    yourGold = 0;
    gearRolls = 0;
    newGear = '';
    eachGold = '';

    console.log("Command received: " + primaryCommand + " " + arguments + " from " + player.toString());

    receivedMessage.channel.send(player.toString() + roll(yourKills, yourExtraGold));

}

function itemCheck(thisLoot, yourExtraGold) { // what did ya get
    yourLoot.push(thisLoot);
	if (thisLoot == lootTable[1] || thisLoot == lootTable[4] ){ // gold check
        let x = Math.floor(Math.random() * 6 + 1);
		if (yourExtraGold == 'true') { // do you have +1 to gold rolls?
            x++;
        }
        if (eachGold) {
            eachGold += ' + ' + x.toString()
        } else {
            eachGold += x.toString();
        }
		yourGold += x; // increases gold count

    } else if (thisLoot == lootTable[2] || thisLoot == lootTable[5]) { // item check
        
		let x = Math.floor(Math.random() * 6);
		let thisItem = itemTable[x]; // x
		if (thisItem == itemTable[5]) {
			gearRolls++; // up the amount of times you can roll for gear
		} 
			yourLoot.push(thisItem); // adds item roll to loot
		
    } else { return}
}

function gearRoll(count) { // what gear did ya get eh
	for (i = 0; i < count; i++) { // number of times you can roll for gear; double/triple same gear has to be figured out manually because im tired
		let x = Math.floor(Math.random() * 6);
		let thisGear = gearTable[x]; // x // to find type of gear eg Weapon, Gauntlets
		newGear = ''; // reset newGear string
        gearBonus(thisGear); // check what bonuses it gets; comment this out when we're out of scrolls of identify
        console.log(newGear); //comment this out
		yourLoot.push(newGear); // passes gear string back to the first function // comment this out
		// console.log(thisGear); // uncomment when out of scrolls
		// yourLoot.push(thisGear); // uncomment when out of scrolls
	}

	
}

function bonusNaming(bonusToAttach, type) { // how we gonna name the gear eh
	let after = true; // does the description go before or after the gear name
	if (bonusToAttach == magicWeapon[1] || bonusToAttach == magicWeapon[5] || bonusToAttach == magicGear[2] || bonusToAttach == magicGear[5] || bonusToAttach == magicGear[4]) { // eg Piercing, of Element, Colour, or Adventuring
		after = false;
	}
	if (newGear) {
		newGear += ' OR'; // if weapon & shield roll
	}
	if (bonusToAttach == magicWeapon[4]) { // eg Weapon of the Leech
		let x = Math.floor(Math.random() * 6);
		let thisElement = elements[x];
		bonusToAttach += ' ' + thisElement;
	}

	if (bonusToAttach == magicGear[4]) { // eg Ruby Belt
		let x = Math.floor(Math.random() * 6);
		let thisElement = colours[x];
		bonusToAttach += thisElement;
	}

	if (after) { // bonus before or after item type logic
		newGear += ' **[' + type + ' ' + bonusToAttach + ']**'; // eg Weapon of the Leech
	} else {
		newGear += ' **[' + bonusToAttach + type + ']**'; // eg Ruby Gloves
	}
}

function gearBonus(gear) { // what bonus did ya get eh
		if (gear == gearTable[0]) { // weapon or shield
			let x = Math.floor(Math.random() * 6);
			let thisWeaponBonus = magicWeapon[x];
			let thisShieldBonus = magicGear[x];
			bonusNaming(thisWeaponBonus, 'Weapon');
			bonusNaming(thisShieldBonus, 'Shield');
		} else { // if not weapon or shield, so, less annoying
			let x = Math.floor(Math.random() * 6);
			let thisGearBonus = magicGear[x];
			bonusNaming(thisGearBonus, gear);
		}
	}


function roll (kills, yourExtraGold) { // what did ya loot today
	for (i = 0; i < kills; i++) {
		let x = Math.floor(Math.random() * 6); // roll a fake d6
		let thisLoot = lootTable[x]; 
		console.log(thisLoot + " & roll count: " + (kills-i));
		if (thisLoot == lootTable[4] || thisLoot == lootTable[5]) {
			i--; // if roll again, increase rolls by 1 by decreasing i by 1 - senior staff!
		}
		itemCheck(thisLoot, yourExtraGold); // let's go check out your loot
	}
	if (gearRolls > 0 ) { // did ya get any gear?
		gearRoll(gearRolls);
	}
    if (yourGold > 0) { // did ya get any gold?
        let newGold = yourGold.toString()
		yourLoot.push(' **[' + newGold + ' Gold]** (' + eachGold + ')');
    }
    if (yourLoot.length >= 1) {
        return " receives" + yourLoot; // alphabetical order! we ain't savages. could also very well show a unique list but this is more transparent eh
    } else {
        return ' please try again: !loot [# of die to roll] [extra gold = true]';
    }
}




client.login("XXXXX") // Replace XXXXX with your bot token