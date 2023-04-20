import { Argument, container } from "@sapphire/framework";
import KaikiCommand from "../lib/Kaiki/KaikiCommand";

export class CommandArgument extends Argument<KaikiCommand> {
    public run(parameter: string, context: Argument.Context<KaikiCommand>): Argument.AwaitableResult<KaikiCommand> {
        const result = <KaikiCommand>container.stores.get("commands")
            .find(k => {
                const name = k.name.toLowerCase();

                return parameter
                    .toLowerCase()
                    .startsWith(name.slice(0, Math.max(parameter.length - 1, 1)));
            });

        if (!result) {
            return this.error({
                message: "The provided argument could not be resolved to a command.",
                parameter,
                context,
            });
        }
        return this.ok(result);
    }
}
