import { getMemberColorAsync, trim } from "../../util/Util";
import fetch from "node-fetch";
import { MessageEmbed, Message } from "discord.js";
import { Command } from "discord-akairo";
import { ChildrenEntity, Data1 } from "../../struct/redditModel";

export default class DadJokeCommand extends Command {
	constructor() {
		super("dadjoke", {
			cooldown: 8000,
			typing: true,
			aliases: ["dadjoke", "dadjokes"],
			description: { description: "Returns a dadjoke." },
		});
	}

	public async exec(message: Message): Promise<Message | void> {

		await loadTitle();
		async function loadTitle() {
			const promise = async () => fetch("https://www.reddit.com/r/dadjokes.json?limit=1000&?sort=top&t=all");
			promise()
				.then((res) => res.json())
				.then((json) => json.data.children.map((t: ChildrenEntity) => t.data))
				.then((data) => postRandomTitle(data));
		}

		async function postRandomTitle(data: Data1[]) {

			const randomRedditPost = data[Math.floor(Math.random() * data.length) + 1];

			const embed: MessageEmbed = new MessageEmbed({
				title: trim(randomRedditPost.title, 256),
				description: trim(randomRedditPost.selftext, 2048),
				color: await getMemberColorAsync(message),
				author: {
					name: `Submitted by ${randomRedditPost.author}`,
				},
				image: {
					url: randomRedditPost.url,
				},
				footer: {
					text: `${randomRedditPost.ups} updoots`,
				},
			});

			return message?.util?.send(embed);
		}
	}
}
