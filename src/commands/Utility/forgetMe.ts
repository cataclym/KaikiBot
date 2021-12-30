import { InteractionCollector, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";
import { moneyModel, usersModel } from "../../struct/db/models";

export default class ForgetMeCommand extends KaikiCommand {
	constructor() {
		super("forgetme", {
			aliases: ["forgetme"],
			description: "Deletes all information about you in the database",
			usage: "",
		});
	}

	public async exec(message: Message): Promise<void> {

		const deleteMsg = await message.channel.send({
			embeds: [new MessageEmbed()
				.setDescription("Are you *sure* you want to delete all your entries in the database?")
				.withOkColor(message)],
			isInteraction: true,
			components: [new MessageActionRow({
				components:
					[new MessageButton()
						.setCustomId("1")
						.setLabel("Yes")
						.setStyle("DANGER"),
					new MessageButton()
						.setCustomId("2")
						.setLabel("No")
						.setStyle("SECONDARY")],
			})],
		});

		const buttonListener = new InteractionCollector(message.client, {
			message: deleteMsg,
			time: 20000,
			filter: (m) => m.user.id === message.author.id,
		});

		buttonListener.once("collect", async (i) => {

			if (i.isButton()) {
				if (i.customId === "1") {
					const userData = await usersModel.findOneAndDelete({ id: message.author.id });
					const moneyData = await moneyModel.findOneAndDelete({ id: message.author.id });
					// const tinderData = await tinderDataModel.findOneAndDelete({ id: message.author.id });

					message.channel.send({
						embeds: [new MessageEmbed()
							.setTitle("Deleted data")
							.setDescription("All data stored about you has been deleted!")
							.addField("Cleared user-data", userData
								? `${userData.todo.length + userData.userNicknames.length} entrie(s) deleted`
								: "N/A")
							.addField("Cleared money-data", moneyData
								? `${moneyData.amount} currency deleted`
								: "N/A")
							.withOkColor(message),
						],
					});
				}
				else {
					await message.delete();
				}
				buttonListener.stop();
			}
		});

		buttonListener.once("end", async () => {
			await deleteMsg.delete();
		});
	}
}
