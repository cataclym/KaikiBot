# Nadeko Sengoku Bot

**What's this?**

Easy, small, straightforward. A bot that responds to ANY "I am X" messages with "Hello, X" And some more...

## Features
* Commands
  * Help
  * Die
  * Ping
  * Dadjoke
  * Exclude
  * Remind (Does not work).
  * Yeet
* Reacts with emotes to message that contain your preferred words
  * See variables.js
* Irritating dad like responses
<img src="https://i.imgur.com/WsMAKPB.png" title="example"/>

## Instructions

### Important: Do not give bot administrator role or the ability to mention @everyone and @here.
**Details on bot's permissions comes after Instructions, down below.**
1. Clone repo
1. Edit config.json - Add your bot token.
1. Edit variables.js - Replace example emotes or remove them if you don't want it to react.
1. `cd nadekosengokubot`
1. `npm i`
1. `node index.js`
1. ?
1. Profit

**Note:** 
By default the role that excludes users is currently called `Nadeko-excluded`. It can be changed in `./storage/names.json`.              
It will autocreate the role if it doesnt exist first time you type `+exlude`. And as long as it has "Manage roles" permissions.  

Add it to pm2 for easy auto restart.

Having issues? Come join us on discord here                                                                                    
<a href="https://discord.gg/msNtTYV">
  <img src="https://discordapp.com/api/guilds/414099963841216512/embed.png?style=banner2" title="Discord Server"/>
</a>

### Bot permissions:
* Manage roles
  * Managing excluded role
* Change / Manage Nickname 
  * Setting new nicknames upon dadbot activation
* Read Text Channels & See Voice Channels 
  * Listen for events
* Send Messages
  * Yep
* Read message history
* Use External Emojis
* Add Reactions
                                                         
Thats it. Don't add any more.                                                                         
You can use the following link to invite with these permissions already defined. Replace `YOUR_BOT_ID_HERE` with your bot id / client id.
https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID_HERE&permissions=470092864&scope=bot

Feel like contributing? Please help me! :D

- Huge thanks to @Arvfitii for helping me whenever im in need!
- Thanks to @rjt-rockx on Discord for the so much help!
- Should also mention @shivaco for help <3
- Thanks also to @Kwoth <3
