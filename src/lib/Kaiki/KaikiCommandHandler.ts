import { AkairoClient, ArgumentTypeCaster, CommandHandler, CommandHandlerOptions } from "discord-akairo";
import KaikiArgumentsTypes from "./KaikiArgumentsTypes";

export default class KaikiCommandHandler extends CommandHandler {
    argumentTypes: { [p: string]: ArgumentTypeCaster };

    constructor(client: AkairoClient, options: CommandHandlerOptions) {
        super(client, options);

        this.argumentTypes = {
            [KaikiArgumentsTypes.argumentTypes.kaiki_money]: KaikiArgumentsTypes.kaikiMoneyArgument,
            [KaikiArgumentsTypes.argumentTypes.kaiki_color]: KaikiArgumentsTypes.kaikiColorArgument,
        };

        this.resolver.addTypes(this.argumentTypes);
    }
}
