import { PrefixSupplier } from "discord-akairo";
import { EmbedBuilder, Message, User } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";


export default class MentionCommand extends KaikiCommand {
    constructor() {
        super("mention", {
            channel: "guild",
            editable: false,
        });
    }

    condition(msg: Message): boolean {
        return msg.mentions.has(msg.client.user as User, {
            ignoreDirect: false,
            ignoreEveryone: true,
            ignoreRoles: true,
        }) && !msg.author.bot && msg.content.split(" ").length === 1;
    }

    public async exec(msg: Message): Promise<NodeJS.Timeout> {

        const embed = msg.channel.send({
            embeds: [
                new EmbedBuilder({
                    title: `Hi ${msg.author.username}, what's up?`,
                    description: `If you need help type \`${(this.handler.prefix as PrefixSupplier)(msg)}help\`.`,
                })
                    .withOkColor(msg),
            ],
        });

        return setTimeout(async () => (await embed).delete(), Constants.MAGIC_NUMBERS.CMDS.ETC.BOT_MENTION.DELETE_TIMEOUT).unref();
    }
}
