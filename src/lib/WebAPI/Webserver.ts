import process from "process";
import express, { Express } from "express";
import { container } from "@sapphire/pieces";
import * as Colorette from "colorette";
import { GuildUsers, Guilds } from "@prisma/client";
import KaikiSapphireClient from "../Kaiki/KaikiSapphireClient";
import { Guild } from "discord.js";

// A class managing the Bot's webserver.
// It is intended to interact with a kaikibot.xyz dashboard
//
// It needs to send a POST req, with a specified token in the body as JSON "{ token: secret_token_here }"
export class Webserver {
    private app: Express;
    private client: KaikiSapphireClient<true>;
    private guild: Guild;
    private endPoints: EndPoints;

    // Creates an express webserver and server user-data on the specified URL path
    public constructor(client: KaikiSapphireClient<true>) {
        if (!process.env.SELF_API_PORT) return;

        this.client = client;
        this.app = express();
        this.app.use(express.json());
        this.loadEndPoints()
            .then(() => this.app.listen(process.env.SELF_API_PORT))
        container.logger.info(`WebListener server is listening on port: ${Colorette.greenBright(process.env.SELF_API_PORT)}`);
    }

    private async loadEndPoints() {
        // Hacky way to wait for guilds to load
        await new Promise(resolve => setTimeout(resolve, 5000));

        this.endPoints = this.createEndPoints();

        for (const ep in this.endPoints) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.app.post(ep, this.endPoints[ep]);
        }
    }

    private createEndPoints(): EndPoints {
        return  {
            "/API/POSTUser/:id": async (req: express.Request, res: express.Response) => {
                Webserver.checkValidParam(req, res);
                Webserver.verifyToken(req, res);

                const requestedUser = container.client.users.cache.get(req.params.id);

                // Send 404 not found
                if (!requestedUser) {
                    container.logger.warn(`Webserver | Requested user was not found: [${Colorette.greenBright(req.params.id)}]`);
                    return res.sendStatus(404);
                }

                const [guildsData, userData] = await Promise.all([container.client.orm.guildUsers.findMany({
                    where: {
                        UserId: BigInt(req.params.id)
                    },
                    include: {
                        Guilds: true
                    }
                }), container.client.orm.discordUsers.findUnique({
                    where: {
                        UserId: BigInt(req.params.id)
                    }
                })]);

                const responseObject = {
                    user: requestedUser,
                    userData: userData,
                    data: guildsData,
                };

                /*                responseObject.guilds = container.client.guilds.cache
                    .filter(guild => guild.members.cache.has(requestedUser.id))
                    .map(guild => {
                        const maybeUserRole = String(responseObject.data.find(gs => String(gs?.Guilds.Id) === guild.id)?.UserRole);
                        return {
                            guildChannels: guild.channels.cache.filter(channel => channel.isTextBased),
                            id: guild.id,
                            icon: guild.icon,
                            name: guild.name,
                            userPerms: guild.members.cache.get(requestedUser.id)?.permissions,
                            userRole: guild.roles.cache.has(maybeUserRole) ? guild.roles.cache.get(maybeUserRole) : null
                        };
                    });
                */

                container.logger.info(`Webserver | Request successful: ${requestedUser.username} [${Colorette.greenBright(requestedUser.id)}]`);
                return res.send(JSON.stringify(responseObject, (key, value) =>
                    typeof value === "bigint" ? value.toString() : value
                ));
            },
            "/API/Guild/:id": async (req: express.Request, res: express.Response) => {
                Webserver.checkValidParam(req, res);
                const body = Webserver.verifyToken(req, res);

                const { data }: { data: StupidType } = body;
                const guild = this.client.guilds.cache.get(String(data.GuildId));
                const userRole = String(data.UserRole);

                // Guild not found
                if (!guild) return res.sendStatus(404);

                this.guild = guild;

                for (const key of Object.keys(data)) {
                    const typedKey: keyof StupidType = key as keyof StupidType;
                    switch (typedKey) {
                    case "icon":
                        await this.guild.setIcon(data[typedKey]);
                        break;
                    case "ExcludeRoleName":
                        await this.SetExcludeRoleName(data[typedKey]);
                        break;
                    case "name": {
                        await this.guild.setName(data[typedKey]);
                        break;
                    }
                    case "UserRoleColor":
                        await this.SetUserRoleColor(userRole, data[typedKey]);
                        break;
                    case "UserRoleName":
                        await this.SetUserRoleName(userRole, data[typedKey]);
                        break;
                    case "UserRoleIcon":
                        await this.SetUserRoleIcon(userRole, data[typedKey]);
                        break;

                        // This will handle all non-special and non-guildDB parameters
                    default:
                        await this.client.guildsDb.set(this.guild.id, typedKey, data[typedKey]);
                        break;
                    }
                }
                return res.sendStatus(200);
            }
        }
    }

    static checkValidParam(req: express.Request, res: express.Response) {
        if (Number.isNaN(Number(req.params.id))) return res.sendStatus(400);
    }

    static verifyToken(req: express.Request, res: express.Response) {
        const { body } = req;
        // Verify token
        if (!body.token || body.token !== process.env.SELF_API_TOKEN) {
            return res.sendStatus(401);
        }
        return body;
    }

    private async SetExcludeRoleName(data: string | null) {
        if (!data) return;
        return this.guild.roles.cache
            .get(this.client.guildsDb.get(this.guild.id, "ExcludeRole", null))
            ?.setName(data);
    }

    private async SetUserRoleIcon(userRole: string, icon: string | null) {
        if (!this.guild.features.includes("ROLE_ICONS")) return;
        return this.guild.roles.cache.get(userRole)
            ?.setIcon(icon);
    }

    private async SetUserRoleName(userRole: string, name: string | null) {
        if (!name) return;
        return this.guild.roles.cache.get(userRole)
            ?.setName(name);
    }

    private async SetUserRoleColor(userRole: string, color: bigint | null) {
        if (!color) return;

        return this.guild.roles.cache.get(userRole)
        //  This bigint is small enough to be accurate when converted
            ?.setColor(Number(color));
    }
}

// Custom type for data coming from the Webserver
type StupidType = Omit<Guilds, "Id" | "CreatedAt"> & GuildUsers & {
  ExcludeRole: string;
  name: string;
  icon: string
  UserRoleName: string | null;
  UserRoleIcon: string | null;
  UserRoleColor: bigint | null;
  ExcludeRoleName: string | null;
}

type EndPoints = {
    "/API/POSTUser/:id": (req: express.Request, res: express.Response) => Promise<express.Response>;
    "/API/Guild/:id": (req: express.Request, res: express.Response) => Promise<express.Response>
}
