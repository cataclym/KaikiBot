import chalk from "chalk";
import logger from "loglevel";
import prefix from "loglevel-plugin-prefix";

type LogColors = {
    TRACE: chalk.Chalk,
    DEBUG: chalk.Chalk,
    INFO: chalk.Chalk,
    WARN: chalk.Chalk,
    ERROR: chalk.Chalk,
}

const colors: LogColors = {
    TRACE: chalk.magenta,
    DEBUG: chalk.cyan,
    INFO: chalk.blueBright,
    WARN: chalk.hex("#ffa500"),
    ERROR: chalk.red,
};

export async function startLogger() {
    prefix.reg(logger);
    logger.enableAll();
    prefix.apply(logger, {
        format(level, name, timestamp) {
            return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase() as keyof LogColors](level)}`;
        },
    });
}
