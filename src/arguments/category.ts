import { Argument, container } from "@sapphire/framework";

export class CategoryArgument extends Argument<string> {
    public run(
        parameter: string,
        context: Argument.Context<string>
    ): Argument.AwaitableResult<string> {
        const result = container.stores.get("commands").categories.find((k) => {
            k = k.toLowerCase();

            return parameter
                .toLowerCase()
                .startsWith(k.slice(0, Math.max(parameter.length - 1, 1)));
        });

        if (!result) {
            return this.error({
                parameter,
                context,
                message:
                    "The provided argument could not be resolved to a category.",
            });
        }

        return this.ok(result);
    }
}
