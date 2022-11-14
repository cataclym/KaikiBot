import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { blockedCategories } from "../lib/Enums/blockedCategories";
import KaikiInhibitor from "../lib/Kaiki/KaikiInhibitor";

export default class BlockModulesInhibitor extends KaikiInhibitor {
    constructor() {
        super("blockmodules", {
            reason: "blocked module",
        });
    }

    public async exec(message: Message, command: Command): Promise<boolean> {

        if (message.guild) {

            if (command.id === "togglecategory") return false;

            const _blockedCategories = await this.client.orm.blockedCategories.findMany({ where: { Guilds: { Id: BigInt(message.guildId!) } } });

            if (_blockedCategories.length) {
                const isBlocked = _blockedCategories.some(c => {
                    const category = blockedCategories[c.CategoryTarget];
                    return category === command.categoryID;
                });
                if (isBlocked) {
                    await message.react("❌");
                    return true;
                }
            }

            return false;
        }

        return false;
    }
}
