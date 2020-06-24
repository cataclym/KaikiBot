const fetch = require("node-fetch");
const Discord = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
	name: "yeetkids",
	aliases: ['yeetingkids', 'yeet kids', 'yeeting kids'],
	description: "Returns yeet...",
	args: false,
	usage: `${prefix}yeetkids`,
	execute(message) {
		let color = message.member.displayColor
		loadTitle(message)
		message.channel.startTyping()
		function loadTitle() {
			fetch('https://www.reddit.com/r/YeetingKids/.json?limit=1000&?sort=top&t=all')
				.then(res => res.json())
				.then(json => json.data.children.map(t => t.data))
				.then(data => postRandomTitle(data))
		}
		function postRandomTitle(data) {
			const randomTitle = data[Math.floor(Math.random() * data.length) + 1];
			let RTSelftext = randomTitle.selftext.substring(0, 2045);
			if (randomTitle.selftext.length > 2048) {
				RTSelftext += "...";
			}
			const RTTitle = randomTitle.title.substring(0, 256);
			let RTUrl = randomTitle.url.toString();
			let LinkIfVid = "";
			const filters = ["webm", "mp4", "gifv", "youtube", "v.redd", "gfycat", "youtu", "news", "wsbtv"];
			if (filters.some(filter => RTUrl.includes(filter))) {
				RTUrl = "";
				LinkIfVid = `Embed's cannot preview videos. Video will be sent separately.`;
			}
			let embed = new Discord.MessageEmbed()
				.setTitle(RTTitle)
				.setDescription(RTSelftext)
				.setColor(color)
				.setAuthor(`Submitted by ${randomTitle.author}`, "", "")
				.setImage(RTUrl)
				.setFooter(`${randomTitle.ups} updoots`);
			message.channel.stopTyping(true)
			message.channel.send(LinkIfVid, { embed });
			if (RTUrl === "") {
				setTimeout(() => { (message.channel.send(randomTitle.url)); }, 2000);
			}
		}
	},
}