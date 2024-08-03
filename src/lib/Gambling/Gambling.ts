import { SlotResult } from "../../commands/Gambling/slots";
import { ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, Message, Snowflake, time, User } from "discord.js";
import KaikiUtil from "../KaikiUtil";

export default class Gambling {
    static readonly slotDict: { [num: number]: string } = Object.freeze({
        0: "🥑",
        1: "🍏",
        2: "🍎",
        3: "🍐",
        4: "🍊",
        5: "🍋",
        6: "🍌",
        7: "🍉",
        8: "🍇",
        9: "🫐",
        10: "🍓",
        11: "🍈",
        12: "🍒",
        13: "🍑",
        14: "🥭",
        15: "🍍",
        16: "🥥",
        17: "🥝",
        18: "🍅",
        19: "🍆",
    });

    static randomEmoji = () =>
        this.slotDict[
            Math.floor(Math.random() * Object.keys(this.slotDict).length)
        ];

    static async playSlots(currencySymbol: string): Promise<SlotResult> {
        const arr = new Array(9);
        for (let i = 0; i < arr.length; i++) {
            await (async () => {
                arr[i] = this.randomEmoji();
            })();
        }

        return {
            string: `[ Kaiki Slots ]
${arr[0]} - ${arr[1]} - ${arr[2]}
${arr[3]} - ${arr[4]} - ${arr[5]}
${arr[6]} - ${arr[7]} - ${arr[8]}
| - - - ${currencySymbol} - - - |`,

            numbers: [arr[3], arr[4], arr[5]],
        };
    }

    private customIDs = new Map<Snowflake, string>();
    private author: User;

    public constructor(author: User) {
        this.author = author;
    }

    public createDailyReminder() {

        const random = String(new Date().getSeconds() * Math.random())
        this.customIDs.set(this.author.id, random)

        return new ButtonBuilder()
            .setCustomId(random)
            .setLabel("⏲️ Remind me")
            .setStyle(ButtonStyle.Primary)
    }

    public async handleReminder(msg: Message) {
        const { author, customIDs } = this;

        const messageComponent = await msg.awaitMessageComponent({
            filter: i => {
                i.deferUpdate();
                return i.user === author && i.customId === customIDs.get(author.id)
            },
            componentType: ComponentType.Button,
            time: 60000
        }).catch(() => msg.edit({ components: [] }));

        if (messageComponent instanceof Message) return;

        const reminder = new Date(Date.now() + KaikiUtil.timeToMidnightOrNoon());

        await Promise.all([
            msg.client.orm.discordUsers.upsert({
                where: {
                    UserId: BigInt(this.author.id),
                },
                create: {
                    UserId: BigInt(this.author.id),
                    DailyReminder: reminder,
                },
                update: {
                    DailyReminder: reminder,
                },
            }),
            msg.edit({ components: [] }),
            msg.reply({
                options: { ephemeral: true },
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`I will notify you ${time(new Date(new Date().getTime() + KaikiUtil.timeToMidnightOrNoon()), "R")}`)
                        .withOkColor(msg)
                ]
            })
        ]);
    }
}
