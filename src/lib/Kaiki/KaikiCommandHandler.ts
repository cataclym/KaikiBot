import { AkairoClient, ArgumentTypeCaster, CommandHandler, CommandHandlerOptions } from "discord-akairo";
import KaikiArgumentsTypes from "./KaikiArgumentsTypes";

export default class KaikiCommandHandler extends CommandHandler {
    argumentTypes: { [p: string]: ArgumentTypeCaster };

    constructor(client: AkairoClient, options: CommandHandlerOptions) {
        super(client, options);

        this.argumentTypes = {
            [KaikiArgumentsTypes.ArgumentTypes.kaiki_money]: KaikiArgumentsTypes.kaiki_money,
            [KaikiArgumentsTypes.ArgumentTypes.kaiki_color]: KaikiArgumentsTypes.kaiki_color,
        };

        this.resolver.addTypes(this.argumentTypes);
    }
}
