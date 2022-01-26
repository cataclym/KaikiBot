const { Command, Inhibitor } = require("discord-akairo");

class KaikiCommand extends Command {
    constructor(id, options) {
        super(id, options);
        this.usage = options?.usage;
    }
}

class KaikiUtil {
    async handleToJSON(data) {
        if (data) return data;
        throw new Error("No data was found");
    }
}

class KaikiInhibitor extends Inhibitor {
    constructor(data) {
        super(data);
    }
}

module.exports = {
    KaikiCommand,
    KaikiInhibitor,
    KaikiUtil: new KaikiUtil(),
};
