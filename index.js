const mineflayer = require('mineflayer');
const settings = require('./settings.json');
const findBlocks = require('./utilities/findBlocks');
const autoeat = require("mineflayer-auto-eat");
const sleepBed = require("./actions/sleepBed");
const playNoteBlock = require('./actions/playNoteBlock');
const find = require('./actions/find');
const chat = require('./utilities/chat');
const sleep = require('./utilities/sleep');


var host = process.env.host;
const username = process.env.username
const password = process.env.password
var eating = false;
var reached = false;
var sleeping = false;
var noSleepCommand = false;
var day;
var prefix = process.env.prefix

var location = {
    noteblockReached: false,
    bedReached: false,
}

var options = {
    host: host,
    username: username
};

var bot = mineflayer.createBot(options);

bindEvents(bot);

function isPresent(source, toCheck) {
    return toCheck.filter(element => source.includes(element))
}

var commands = {
    nosleep: function () {
        if(sleeping) {
            bot.chat(process.env.noSleepTom);
        } else {
            bot.chat(process.env.noSleepToday);
            day = bot.time.day;
        }
        noSleepCommand = true;
        location.noteblockReached = false;
        reached = false;
    },
    resumesleep: function () {
        bot.chat(process.env.sleepNow);
        noSleepCommand = false;
        reached = false;
    },
    dimension: function () {
        bot.chat(bot.game.dimension);
    },
    foodlevel: function () {
        bot.chat("Food level: "+bot.food);
    },
}

function bindEvents(bot) {
    bot.loadPlugin(autoeat);

    bot.on('spawn', async ()=> {
        bot.chat('/login '+password);
        const mcData = require('minecraft-data')(bot.version)
        bot.autoEat.options.startAt = 17
        bot.autoEat.options.eatingTimeout = 3
        await sleep(1000);
        var blocks = await findBlocks(bot, mcData);
        setInterval(action, 1000, mcData, blocks);
        chat(bot, mcData)
    });

    bot.on('chat', function(username, message) {
        if (username === bot.username) return;
        message = message.toLowerCase()
        let inCommands = isPresent(Object.keys(commands), message.split(" "))
        console.log(inCommands)
        if (message.includes(prefix) && !inCommands.length) bot.chat(process.env.afk)
        if (message.includes(prefix) && message == prefix+" "+inCommands) {
            commands[inCommands]()
        }
        console.log("["+username+"] "+message);
    });

    bot.on('goal_reached', ()=> {
      reached = true;
      console.log("reached")
    });
    
    bot.on("autoeat_started", () => {
        console.log("Auto Eat started!")
    })

    bot.on("autoeat_stopped", () => {
        console.log("Auto Eat stopped!")
    })
}

async function action(mcData, blockData) {
    if (settings.autoEat) {
        if (bot.food < bot.autoEat.options.startAt) {
            eating = true;
            console.log('Eating');
            bot.autoEat.eat();
        } else {
            bot.autoEat.disable();
            eating = false
        }
    } 
    if (bot.game.dimension == "minecraft:the_nether") {
        playNoteBlock(bot, blockData.noteBlock.block);
    } else if(settings.autoSleep && !bot.time.isDay && !eating && !sleeping && !noSleepCommand) {
        if(!location.bedReached && !reached) await find(bot, mcData, blockData.bed.position);
        if(location.bedReached && !sleeping) {
            sleepBed(bot, blockData.bed.block);
            sleeping = true;
        }
        if(reached) {
            console.log("Sleeping");
            location.noteblockReached = false;
            reached = false;
            location.bedReached = true;
        }
    } else if(settings.autoNoteBlock && !eating && !sleeping) {
        if(!location.noteblockReached && !reached) await find(bot, mcData, blockData.noteBlock.position);
        if(location.noteblockReached) playNoteBlock(bot, blockData.noteBlock.block);
        if(reached) {
            location.noteblockReached = true;
            reached = false;
            if (!(bot.game.dimension == "minecraft:the_nether")) location.bedReached = false;
            sleeping = false;
            console.log("Playing")
        }
    }
    if (noSleepCommand && !sleeping) {
        if (day != bot.time.day) {
            noSleepCommand = false;
        }
    } else if (noSleepCommand && sleeping){
        day = bot.time.day;
    }
    if (bot.time.isDay) {
        sleeping = false;
    }
}
