import { Listener } from "discord-akairo";
import { GuildMember, Message, EmbedBuilder } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";


export default class EmitCommand extends KaikiCommand {
    constructor() {
        super("emit", {
            aliases: ["emit"],
            description: "Emits a specified event. (WIP)",
            usage: "ratelimit <info about event>",
            ownerOnly: true,
            args: [{
                index: 0,
                id: "event",
                type: "listener",
                otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),

            },
            {
                id: "member",
                flag: ["-m"],
                type: "member",
                match: "option",
            },
            {
                id: "eventArguments",
                match: "separate",
                default: null,
            }],
        });
    }

    public async exec(message: Message, {
        event,
        eventArguments,
        member,
    }: { event: Listener, eventArguments: string[], member: GuildMember }): Promise<Message | void> {

        const value = event.emitter === "client"
            ? this.client.emit(event.id, member, eventArguments)
            : this.handler.emit(event.id, member, eventArguments);

        if (value) {
            return message.channel.send({
                embeds:
                    [new EmbedBuilder({
                        description: `Emitted ${event.id}.`,
                    })],
            });
        }
    }
}
