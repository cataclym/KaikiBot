# Nadeko Sengoku Bot

# Update: Bot has been rewritten with the Akairo discord.js bot framework.
## This readme is not up to date with the rewrite as of 2.0.

***

**What's this?**

A bot with fun utility, dadbot responses, and more!

## Features
* ### Commands
  * Help, commands
  * Die
  * Ping
  * Todo
  * Dadjoke
  * Exclude
  * Yeet, Yeetkids
  * Tinder
    * Rolls
    * Likes/Dislike/Superlike
    * Daily reset
    * Marry
  * Holiday info
  * Names
  * Deadbeat
  * Simp
  * Remind (WIP)
  * Send (WIP)
* ### Reacts with emotes to message that contain your preferred words
  * See variables.js
* ### Emotecount
  * Emotecount
* ### Irritating dad like responses, which also rename the user

<img src="https://i.imgur.com/WsMAKPB.png" title="example" alt="alt text"/>

***
## Instructions
Requirements
* nodejs (also installs npm)
* build tools (Windows) `npm i --global --production windows-build-tools` | Linux <a href="https://github.com/Automattic/node-canvas/wiki/Installation:-Fedora-and-other-RPM-based-distributions"> Find your distribution and dependencies here </a> 

### ~~Important: Do not give bot administrator role or the ability to mention @everyone and @here~~ No longer something you need to worry about. Bot has had these mentions disabled.

1. Clone repo
1. Edit `config.js` - Add your bot token. Replace example emotes or remove them if you don't want it to react.
1. `cd nadekosengokubot`
1. `npm i`
1. `node index.js`
1. ?
1. Profit

**Note:** 
By default the role that excludes users is currently called `Nadeko-excluded`. It can be changed in `./config.js`.              
It will autocreate the role if it doesnt exist first time you type `+exlude`. And as long as it has "Manage roles" permissions.  

Add it to pm2 for easy auto restart. 
`pm2 start index.js` |
`pm2 save` |
`pm2 logs index --lines 50` 

Having issues? Come join us on discord here                                                                                    
<a href="https://discord.gg/msNtTYV">
<img src="https://discordapp.com/api/guilds/414099963841216512/embed.png?style=banner2" title="Discord Server"/>
</a>
***

### Bot permissions: **You can ignore this part** from v1.3 and forward
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
* View audit log
                                                         
Thats it. Don't add any more.                                                                         
You can use the following link to invite with these permissions already defined. Replace `YOUR_BOT_ID_HERE` with your bot id / client id.
https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID_HERE&permissions=470142144&scope=bot

Feel like contributing? Please help me! :D

# I owe some amazing people thanks, and more!
- Huge thanks to @Arvfitii for helping me whenever im in need!
- Thanks to @rjt-rockx on Discord for so much help and time!
- Should also mention @shivaco for help <3
- Thanks also to @Kwoth <3

# About
### A bit about this project
This bot was my first entry into javascript, nodejs, discordjs and programming/coding overall. It has been very fun and also frustrating. If you do find unoptimized code and or flaws or other inherently bad code - I would be very happy to merge changes and try to learn from my own mistakes. Commenting the code helps! I will try to do so as well.
