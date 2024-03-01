import { Argument } from "@sapphire/framework";
import { ValidActivities } from "../commands/Owner only/setActivity";

export default class ActivityTypeArgument extends Argument<ValidActivities> {

    static validActivities: ValidActivities[] = ["PLAYING", "STREAMING", "LISTENING", "WATCHING", "COMPETING"];

    run(parameter: string) {

        const str = parameter.toUpperCase();

        if (this.assertType(str as ValidActivities)) {
            return this.ok(str as ValidActivities);
        }

        return this.error({
            parameter,
            message: `The provided argument doesn't match a valid activity type.
Valid types are: \`${ActivityTypeArgument.validActivities.join("`, `")}\``,
        });
    }

    private assertType(str: string): str is ValidActivities {
        return ActivityTypeArgument.validActivities.includes(str as ValidActivities);
    }
}
