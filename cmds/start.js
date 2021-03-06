const Discord = require('discord.js');
const Listing = require('./../modules/Listing');
const fs = require('fs');

module.exports.run = async (bot, message, args) => {
    let snipeChannel = message.channel;
    const filter = m => !m.author.bot;
    let game = new Listing();

    
    let raw = fs.readFileSync('./roles.json');
    let allowedRoles = JSON.parse(raw);

    let validation = function(serverRoles, userRoles){
        let val = false;
        serverRoles.forEach((role) => {
            userRoles.forEach((usr) => {
                if (role == usr){
                    val = true;
                }
            });
        });
        return val;
    }
    

    let editLast3 = null;

    let startMessage = new Discord.RichEmbed()
        .setTitle("FN Scrims")
        .setDescription("Waiting for server IDs...")
        .setColor("#8600b3")
        .setFooter("Please enter the last 3 characters of your server identifier located in the top left corner of your screen while in-game.");

    message.channel.send({embed: startMessage});

    let time = 25;
    let editTime = "";

    let timeEmbed = new Discord.RichEmbed()
        .setTitle("SNIPE MATCH STARTING!")
        .setColor("#FF3333")
        .setFooter("Alert: - A snipe match is starting, pay attention! Instructions: - We will do a countdown from 7 sec and you will ready up on go.");

    setTimeout(async () => {
        editTime = await message.channel.send({embed: timeEmbed}).catch( (err) => {
            console.log("Cant edit deleted message");
        });
    }, 10);

    let timeInterval = setInterval(() => {
        if (time === 1){
            time -= 1;
            timeEmbed.setDescription(time + " minutes");
            clearInterval(timeInterval);
        }else {
            time -= 1;
            timeEmbed.setDescription(time + " minutes");
        }

        editTime.edit({embed: timeEmbed}).catch((err) => {
            console.log("cant edit");
            clearInterval(timeInterval);
        });

    },60000);

    let last3 = new Discord.RichEmbed()
        .setTitle("Waiting for server ID's.....")
        .setColor("#33FFC1");

    setTimeout(async () => {
        editLast3 = await message.channel.send({embed: last3});
    }, 10);

    const collector = snipeChannel.createMessageCollector(filter, {max: 200, maxMatches: 200, time: 180000});

    collector.on('collect', m => {

        console.log(`Collected ${m.content} | ${m.author.username}`);
        
        if (validation(allowedRoles.roles,m.member.roles.array())){
            if (m.content === "!start"){
                collector.stop();
                console.log("Collector stoped");
                return;
            }
        }
        
        if (game.data.length === 0 && m.content.length === 3){
            game.addID(m.content.toUpperCase(), m.author.username);
        }else if (m.content.length === 3){
            if (game.userPresent(m.author.username)){
                game.deleteUserEntry(m.author.username);
                if (game.idPresent(m.content.toUpperCase())){
                    game.addUser(m.content.toUpperCase(), m.author.username);
                }else {
                    game.addID(m.content.toUpperCase(),m.author.username);
                }
            } else {
                if (game.idPresent(m.content.toUpperCase())){
                    game.addUser(m.content.toUpperCase(), m.author.username);
                }else {
                    game.addID(m.content.toUpperCase(), m.author.username);
                }
            }
        }

        game.sort();

        let str = "";
        last3 = new Discord.RichEmbed()
            .setTitle("Current Servers: ")
            .setColor("#00FFD8");

        for (var i = 0; i < game.data.length; i++){
            str = "";
            for (var j = 0; j < game.data[i].users.length ; j++){
                str += game.data[i].users[j] + "\n";
            }
            last3.addField(`${game.data[i].id.toUpperCase()} - ${game.data[i].users.length} PLAYERS`, str, true);
        }
            editLast3.edit({embed: last3}).catch((err) => {
                console.log("Caught eddit error");
            });

        if (m.deletable){
            m.delete().catch((err) => {
                console.log("Cant delete");
                console.log(err);
            });
        }

    });

    collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
    });
        

}



module.exports.help = {
    name: "start"
}
