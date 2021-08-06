# .env setup guide

The .env file is important to the bot because it is where the process can access its login token. 

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
### HOLIDAYKEY (Currently not being used and can be ignored safely)

Example

    HOLIDAYKEY=JHSU238293DJIWJID2738273.djuiwhDUWHDWdhjiuw283283u
### KAWAIIKEY

* Login to https://kawaii.red/dashboard/ with your Discord account
* Reveal and copy the token 
* Paste the token in the .env file. Make sure it looks like the example below.

Example

    KAWAIIKEY=142788173885276162.DspDpD0isjuXAKD73vWs

## MORE TO COME

### Example of finished .env file

    CLIENT_TOKEN=MND5MTA2MzY2MzgwNzU5Fjgw.O08nDN.Bl6rIwtlAg9Hxuz8CLPD0l23sun

    OWNER=142788173885276162

    PREFIX=;

    HOLIDAYKEY=JHSU238293DJIWJID2738273.djuiwhDUWHDWdhjiuw283283u

    KAWAIIKEY=142788173885276162.DspDpD0isjuXAKD73vWs