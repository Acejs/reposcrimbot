const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    message.delete().catch(O_o=>{});
let sicon = message.guild.iconURL;
    let cmdsembed = new Discord.RichEmbed()
    .setTitle("My Commands!")
    .setDescription("All these Commands are **HOST ONLY!**")
    .setThumbnail(sicon)
    .addField("[p]start", "Starts a Scrim!")
    .addField("[p]60s", "Sends a message (Next scrim in 1 miniutes!)" )
    .addField("[p]30s", "Sends a message (Next scrim in 30 seconds!)")
    .addField("[p]now", "Sends a message (Scrims starting now!")
    .setColor("#c0c0c0");

    message.member.send(cmdsembed);
}

module.exports.help = {
    name: "cmds"
}
