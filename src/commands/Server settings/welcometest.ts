import { Message, Permissions } from "discord.js";
import { KaikiCommand } from "../../lib/KaikiClass";
import { getGuildDocument } from "../../struct/documentMethods";
import { sendWelcomeLeaveMessage } from "../../lib/GreetHandler";

export default class WelcomeTestCommand extends KaikiCommand {
	constructor() {
		super("welcometest", {
			aliases: ["welcometest"],
			description: "Tests welcome message as it would appear for new members.",
			userPermissions: Permissions.FLAGS.MANAGE_GUILD,
			channel: "guild",
			usage: "",
		});
	}

	public async exec(message: Message): Promise<void> {
		await sendWelcomeLeaveMessage((await getGuildDocument(message.guild!.id)).settings.welcome, message.member!);
	}
}
