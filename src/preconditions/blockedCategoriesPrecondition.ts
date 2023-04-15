import { AllFlowsPrecondition, Piece, Result } from "@sapphire/framework";
import { ChatInputCommandInteraction, ContextMenuCommandInteraction, Message } from "discord.js";
import KaikiAkairoClient from "../lib/Kaiki/KaikiAkairoClient";

export class BlockedCategoriesPrecondition extends AllFlowsPrecondition {

    public constructor(context: Piece.Context, options: AllFlowsPrecondition.Options) {
        super(context, {
            ...options,
            position: 20,
        });
    }

    public override chatInputRun(interaction: ChatInputCommandInteraction) {
        return this.checkBlockedCategories(interaction);
    }

    public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
        return this.checkBlockedCategories(interaction);
    }

    public override messageRun(message: Message) {
        return this.checkBlockedCategories(message);
    }

    private async checkBlockedCategories(messageOrInteraction: Message | ContextMenuCommandInteraction | ChatInputCommandInteraction) {
        if (messageOrInteraction.guildId === null) return this.ok();

        const isBlocked = await Result.fromAsync(
            (messageOrInteraction.client as KaikiAkairoClient<true>).orm.blockedCategories.findFirstOrThrow({ where: { GuildId: BigInt(messageOrInteraction.guildId) } }),
        );

        // SQL query failed, therefore no guild was found, therefore the guild is not banned.
        if (isBlocked.isErr()) return this.ok();

        // Guild was found, therefore it is banned.
        return this.error({ identifier: "BlockedCategory" });
    }
}
