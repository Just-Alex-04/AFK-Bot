const settings = require('./../settings.json');

async function findBlocks(bot, mcData) {
    var noteBlock
    let bed
    if (!(bot.game.dimension == "minecraft:the_nether")) {
        bed = bot.findBlock({
                matching: block => bot.isABed(block),
                maxDistance: 256
        })
    }
    if(settings.autoNoteBlock) {
        noteBlock = bot.findBlock({
            matching: mcData.blocksByName['note_block'].id,
            maxDistance: 256
        })
        if(!noteBlock) {
            console.log("[ERROR] Noteblock not found")
        } else {
            console.log("[BOT] NOTEBLOCK FOUND!")
        }
    } 
    if (settings.autoSleep) {
        if(!bed) {
            console.log("[ERROR] Bed not found")
        } else {
            console.log("[BOT] BED FOUND!")
        }
    } 
    if (bot.game.dimension == "minecraft:the_nether") {
        return {"noteBlock": {"position": noteBlock.position, "block": noteBlock}}
    } else {
        return {"noteBlock": {"position": noteBlock.position, "block": noteBlock}, "bed": {"position": bed.position, "block": bed}}
    }
}

module.exports = findBlocks
