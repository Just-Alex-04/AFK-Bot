const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chat(bot) {
  rl.question('Chat: ', function (message) {
    // console.log(bot)
    if (message == 'exit') 
      return rl.close(); 
    else if (message == "/food") console.log("[BOT] FOOD: "+bot.food)
    else if (message == "/players") console.log(Object.keys(bot.players).join(", "))
    else if (message == "/noteblock") {
      var target = bot.findBlock({
        matching: mcData.blocksByName['note_block'].id,
        maxDistance: 256
      })
      if (target) {
        console.log("[BOT] Noteblock around")
      } else {
        console.log("[BOT] Noteblock missing")
      }
    }
    else if (message == "/exp") console.log("[BOT] Exp: "+bot.experience.points)
    bot.chat(message)
    chat(bot); 
  });
};

module.exports = chat
