import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { blockedCategories } from "../lib/enums/blockedCategories";
import KaikiInhibitor from "../lib/Kaiki/KaikiInhibitor";

export default class BlockModulesInhibitor extends KaikiInhibitor {
    constructor() {
        super("blockmodules", {
            reason: "blocked module",
        });
    }

    public async exec(message: Message, command: Command): Promise<boolean> {

        if (!message.inGuild()) {
            return false;
        }
        else {

            if (command.id === "togglecategory") return false;

            const _blockedCategories = await this.client.orm.blockedCategories.findFirst({ where: { Guilds: { Id: BigInt(message.guildId!) } } });

            if (!_blockedCategories) {
                return false;
            }

            else {
                const category = blockedCategories[_blockedCategories.CategoryTarget];
                return category === command.categoryID;
            }
        }
    }
}
