import { Argument } from "@sapphire/framework";
import { JSONToMessageOptions } from "../lib/GreetHandler";

export class WelcomeGoodbyeMessageArgument extends Argument<JSONToMessageOptions> {
    public async run(parameter: string) {
        try {
            const value = parameter.replace(/\n/g, "");
            const json = JSON.parse(value);

            const messageOptions = new JSONToMessageOptions(json);

            if (!messageOptions) {
                return this.error({
                    parameter,
                    message: "Please provide valid json",
                });
            }

            return this.ok(messageOptions);
        } catch {
            return this.error({
                parameter,
                message: "Please provide valid json",
            });
        }
    }
}
