// require the discord.js module
const Discord = require('discord.js');
var auth = require('./logbotConf.json');

// create a new Discord client
const client = new Discord.Client();

const timeGap = auth.msg_time
const logTrigger = auth.log_trigger
const msgNum = auth.msg_num
const logChannel = auth.log_channel

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	console.log(timeGap)
	console.log(logTrigger)
	console.log(msgNum)
	console.log(logChannel)
  if (message.content === logTrigger) {

  message.channel.messages.fetch()
    .then(messages => {
      console.log(`Received ${messages.size} messages`);
      var arraySet = Array.from(messages);
			var baseTime = arraySet[0][1].createdTimestamp;
			//for logging within the last 2 minutes
			/*for (i = arraySet.length - 1; i >= 0; i--) {
				if(((baseTime - arraySet[i][1].createdTimestamp) <= timeGap) && (arraySet[i][1].content != logTrigger)) {
					message.guild.channels.cache.find(i => i.name === 'peepers-log-channel').send(arraySet[i][1].content);
				}*/
			//for logging the last msgNum messages
			//this part figures out how many msgs to read
			var upperBound = msgNum;
			if(arraySet.length < msgNum){
				upperBound = arraySet.length - 1;
			}
			for (i = upperBound; i >= 0; i--) {
				if(arraySet[i][1].content != logTrigger && arraySet[i][1].content != "" && arraySet[i][1].content != " ") {
					try {
						message.guild.channels.cache.find(i => i.name === logChannel).send(arraySet[i][1].content);
						console.log("Printing msg " + i + ": " + arraySet[i][1].content)
					}
					catch(err){
						console.log("Error thrown for msg" + i + ": " + arraySet[i][1].content)
						console.log(err)
					}
				}else{
					console.log("Invalid message")
				}
			}
    })
    .catch(console.error);
	message.channel.send('Logged!.');
}

});

// login to Discord with your app's token
client.login(auth.token);
