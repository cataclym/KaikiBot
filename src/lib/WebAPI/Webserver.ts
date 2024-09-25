import process from "process";
import express from "express";
import { container } from "@sapphire/pieces";
import * as Colorette from "colorette";


// A class managing the Bot's webserver.
// It is intended to interact with a kaikibot.xyz dashboard
//
// It needs to send a POST req, with a specified token in the body as JSON "{ token: secret_token_here }"
export class Webserver {
    // Creates an express webserver and server user-data on the specified URL path
    public static WebListener() {
        if (!process.env.SELF_API_PORT) return;

        container.logger.info(`WebListener server is listening on port: ${Colorette.greenBright(process.env.SELF_API_PORT)}`);

        const app = express();
        app.use(express.json());

        app.post("/API/UserCache/:id", async (req, res) => {
            // Check if param is valid
            if (Number.isNaN(Number(req.params.id))) return res.sendStatus(400);

            const { body } = req;
            // Verify token
            if (!body.token || body.token !== process.env.SELF_API_TOKEN) {
                return res.sendStatus(401);
            }

            const requestedUser = container.client.users.cache.get(req.params.id);

            // Send 404 not found
            if (!requestedUser) return res.sendStatus(404);

            return res.send({
                user: requestedUser,
                data: await container.client.orm.guildUsers.findMany({
                    where: {
                        UserId: BigInt(req.params.id),
                    },
                    include: {
                        Guilds: true,
                    }
                }),
                guilds: container.client.guilds.cache
                    .filter(guild => guild.members.cache.has(requestedUser.id))
                    .map(guild => ({
                        id: guild.id,
                        name: guild.name,
                        userPerms: guild.members.cache.get(requestedUser.id)?.permissions,
                        guildChannels: guild.channels.cache.filter(channel => channel.isTextBased),
                    }))
            });
        })

        app.listen(process.env.SELF_API_PORT)
    }
}
