### Paths
- [Readme](../README.md)
- Docs
  - [Guide](GUIDE.md)

# .env setup guide

The .env file is important for the bot to run at all. Read below how to populate its fields.

### CLIENT_TOKEN

Create a bot application
* Go to your discord bot applications (https://discord.com/developers/applications/)
* Click `New Application` in top right corner
* Fill in a name, and assign it to personal team.
* Click `Bot` under `SETTINGS` on the menu, on the left.
* Click `Add Bot`
* Click `Copy` under `TOKEN`
* Paste the token in the .env file. Make sure it looks like the example below.

Example

    CLIENT_TOKEN=MND5MTA2MzY2MzgwNzU5Fjgw.O08nDN.Bl6rIwtlAg9Hxuz8CLPD0l23sun

### OWNER

* Enable developer mode in Discord
    * Navigate to Discord settings
    * Under settings, click `Advanced`
    * Tick `Developer mode`. Make sure it's green. 
    
Example

    OWNER=142788173885276162

### PREFIX

Decide what prefix the bot should default to on new servers.

Example

    PREFIX=;

### KAWAIIKEY

* Login to https://kawaii.red/dashboard/ with your Discord account
* Reveal and copy the token 
* Paste the token in the .env file. Make sure it looks like the example below.

Example

    KAWAIIKEY=142788173885276162.DspDpD0isjuXAKD73vWs

## MySQL

Replace `root` with your MySQL user and password credentials

Example


    MYSQL_USER=mysql_user

    MYSQL_PASS=password123

### The rest of the file

Please leave this as is, unless you know what you're doing

    DADBOT_MAX_LENGTH=256

    DADBOT_NICKNAME_LENGTH=32

    NODE_ENV=production

### Example of finished .env file

    CLIENT_TOKEN=MND5MTA2MzY2MzgwNzU5Fjgw.O08nDN.Bl6rIwtlAg9Hxuz8CLPD0l23sun

    OWNER=142788173885276162

    PREFIX=;

    KAWAIIKEY=142788173885276162.DspDpD0isjuXAKD73vWs

    MYSQL_USER=root

    MYSQL_PASS=root

    DADBOT_MAX_LENGTH=256

    DADBOT_NICKNAME_LENGTH=32

    NODE_ENV=production
