import { FailureData } from "discord-akairo";
import { ActivityType, Message, MessageEmbed } from "discord.js";
import { getBotDocument } from "../../struct/documentMethods";
import KaikiCommand from "Kaiki/KaikiCommand";
import { ActivityTypes } from "discord.js/typings/enums";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class SetActivityCommand extends KaikiCommand {
    static validTypes = ["PLAYING", "STREAMING", "LISTENING", "WATCHING", "COMPETING"];

    constructor() {
        super("setactivity", {
            aliases: ["setactivity", "setac"],
            description: "Set the bot's activity.",
            usage: ["<type> <Activity>", "playing with Dreb"],
            ownerOnly: true,
            args: [{
                id: "type",
                type: SetActivityCommand.validTypes,
                otherwise: (msg: Message, _: FailureData) => this.typeErrorEmbed(msg, _),
            },
            {
                id: "name",
                type: "string",
                match: "restContent",
                otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
            }],
        });
    }

    typeErrorEmbed = (msg: Message, _: FailureData) => ({
        embeds: [new MessageEmbed()
            .setDescription(`\`${_.phrase}\` is not an status type`)
            .addField("Valid types", SetActivityCommand.validTypes.join("\n"))
            .withErrorColor(msg)],
    });

    public async exec(message: Message, {
        type,
        name,
    }: { type: Exclude<ActivityType, "CUSTOM"> | Exclude<ActivityTypes, ActivityTypes.CUSTOM>, name: string }) {

        return Promise.all([
            message.client.user?.setActivity({ type: type, name: name }),
            this.client.botSettingsProvider.set("1", "Activity", name),
            this.client.botSettingsProvider.set("1", "ActivityType", type),
            message.channel.send({
                embeds: [new MessageEmbed()
                    .addField("Status changed", `**Type**: ${type}\n**Activity**: ${name}`)
                    .withOkColor(message)],
            }),
        ]);
    }
}
