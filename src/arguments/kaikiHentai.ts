import { Argument } from "@sapphire/framework";

export class KaikiHentaiArgument extends Argument<string> {
    private static hentaiArray = ["waifu", "neko", "femboy", "blowjob"];

    public run(parameter: string) {
        return KaikiHentaiArgument.hentaiArray.includes(parameter.toLowerCase())
            ? this.ok(parameter)
            : this.error({
                  parameter,
                  message:
                      "The provided argument could not be resolved to a hentai category.",
              });
    }
}
