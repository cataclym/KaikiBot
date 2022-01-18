import { Message, MessageEmbed, User } from "discord.js";
import { KaikiCommand } from "kaiki";

export default class take extends KaikiCommand {
    constructor() {
    	super("take", {
    		ownerOnly: true,
    		aliases: ["take"],
    		description: "Takes money from the specified user",
    		usage: "50 @Cata",
    		args: [
    			{
    				id: "amount",
    				type: "integer",
    				otherwise: (m: Message) => ({ embeds: [new MessageEmbed({
    					title: "Invalid amount. It must be a number",
    				})
    					.withOkColor(m)] }),
    			},
    			{
    				id: "user",
    				type: "user",
    				otherwise: (m: Message) => ({ embeds: [new MessageEmbed({
    					title: "Can't find this user. Try again.",
    				})
    					.withOkColor(m)] }),
    			},
    		],
    	});
    }

    public async exec(msg: Message, { amount, user }: { amount: number; user: User; }): Promise<void> {
    	const success = await this.client.money.TryTake(user.id, amount);
    	if (!success) {
    		await msg.channel.send({
    			embeds: [new MessageEmbed()
    				.setDescription(`${user.username} has less than ${amount} ${this.client.money.currencySymbol}`)
    				.withErrorColor(msg)],
    		});
    		return;
    	}

    	await msg.channel.send({
    		embeds: [new MessageEmbed()
    			.setDescription(`Successfully took ${amount} ${this.client.money.currencySymbol} from ${user.username}`)
    			.withOkColor(msg)],
    	});
    }
}

