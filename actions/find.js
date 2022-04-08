const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals

async function find (bot, mcData, blockPosition) {
    bot.loadPlugin(pathfinder)
    let { x: bedX, y: bedY, z: bedZ } = blockPosition
    const movements = new Movements(bot, mcData)
    movements.canDig = false
    await bot.pathfinder.setMovements(movements)
    await bot.pathfinder.setGoal(new GoalNear(bedX, bedY, bedZ, 1))
}

module.exports = find