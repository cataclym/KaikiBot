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
// It needs to send a POST req, with a specified token in the header under authorization
export class Webserver {
    private app: Express;
    private client: KaikiSapphireClient<true>;

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

        this.app.post("/API/User/:id", this.POSTUserGuilds)
        this.app.get("/API/Guild/:id", this.GETGuild)
        // Patch potentially?
        this.app.post("/API/Guild/:id", this.POSTGuildUpdate)
    }

    private async POSTUserGuilds(req: express.Request, res: express.Response) {
        Webserver.checkValidParam(req, res);
        Webserver.verifyToken(req, res);

        const guilds: bigint[] = req.body;

        const [guildsData, userData] = await Promise.all([container.client.orm.guilds.findMany({
            where: {
                Id: {
                    in: guilds
                }
            },
            include: {
                GuildUsers: {
                    where: {
                        UserId: BigInt(req.params.id)
                    }
                }
            }
        }), container.client.orm.discordUsers.findUnique({
            where: {
                UserId: BigInt(req.params.id)
            }
        })]);

        // Send 404 not found
        if (!userData) {
            container.logger.warn(`Webserver | Requested user was not found: [${Colorette.greenBright(req.params.id)}]`);
            return res.sendStatus(404);
        }

        const responseObject = {
            userData: userData,
            guildDb: guildsData,
        };

        container.logger.info(`Webserver | Request successful: [${Colorette.greenBright(req.params.id)}]`);
        return res.send(JSON.stringify(responseObject, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
        ));
    }

    private async GETGuild(req: express.Request, res: express.Response) {
        Webserver.checkValidParam(req, res);
        Webserver.verifyToken(req, res);

        const userId = req.query.userId;

        const dbGuildUser = await container.client.orm.guildUsers.findUnique({
            where: {
                UserId_GuildId: {
                    UserId: BigInt(userId as string),
                    GuildId: BigInt(req.params.id),
                }
            }
        });

        const guild = container.client.guilds.cache.get(req.params.id);
        if (!guild) return res.sendStatus(404);

        const userRole = guild.roles.cache.get(String(dbGuildUser?.UserRole))
        let userRoleData = null;
        if (userRole) {
            userRoleData = { id: userRole.id, name: userRole.name, color: userRole.color, icon: userRole.icon } = userRole;
        }

        const guildChannels = guild.channels.cache
            .filter(channel => channel.isTextBased())
            .map(channel => ({ id: channel.id, name: channel.name }));

        return res.send({ guildChannels, userRole: userRoleData });
    }

    private async POSTGuildUpdate(req: express.Request, res: express.Response) {
        Webserver.checkValidParam(req, res);
        Webserver.verifyToken(req, res);
        if (!req.body) return res.sendStatus(400);

        const { body }: { body: Partial<DashboardResponse>} = req;
        const guild = this.client.guilds.cache.get(String(body.GuildId));
        const userRole = String(body.UserRole);

        // Guild not found
        if (!guild) return res.sendStatus(404)
        for (const key of Object.keys(body)) {
            const value = body[key as keyof DashboardResponse];

            switch (value) {
            case "icon":
                await guild.setIcon(value);
                break;
            case "ExcludeRoleName":
                await this.SetExcludeRoleName(value, guild);
                break;
            case "name": {
                await guild.setName(value);
                break;
            }
            case "UserRoleColor":
                await this.SetUserRoleColor(userRole, value, guild);
                break;
            case "UserRoleName":
                await this.SetUserRoleName(userRole, value, guild);
                break;
            case "UserRoleIcon":
                await this.SetUserRoleIcon(userRole, value, guild);
                break;
            // This will handle all non-special and non-guildDB parameters
            default:
                await this.client.guildsDb.set(guild.id, key, value);
                break;
            }
        }
        return res.sendStatus(200);
    }


    static checkValidParam(req: express.Request, res: express.Response) {
        if (Number.isNaN(Number(req.params.id))) return res.sendStatus(400);
    }

    // Throws 401 unauthorized if token is wrong
    static verifyToken(req: express.Request, res: express.Response): void {
        if (req.headers.authorization !== process.env.SELF_API_TOKEN) {
            res.sendStatus(401);
            return;
        }
    }

    private async SetExcludeRoleName(data: string | null, guild: Guild) {
        if (!data) return;
        return guild.roles.cache
            .get(this.client.guildsDb.get(guild.id, "ExcludeRole", null))
            ?.setName(data);
    }

    private async SetUserRoleIcon(userRoleId: string, icon: string | null, guild: Guild) {
        if (!guild.features.includes("ROLE_ICONS")) return;
        return guild.roles.cache.get(userRoleId)
            ?.setIcon(icon);
    }

    private async SetUserRoleName(userRoleId: string, name: string | null, guild: Guild) {
        if (!name) return;
        return guild.roles.cache.get(userRoleId)
            ?.setName(name);
    }

    private async SetUserRoleColor(userRoleId: string, color: bigint | string | null, guild: Guild) {
        if (!color) return;

        return guild.roles.cache.get(userRoleId)
        //  This bigint is small enough to be accurate when converted
            ?.setColor(Number(color));
    }
}

// Custom type for data coming from the Webserver
type DashboardResponse = Omit<Guilds, "Id" | "CreatedAt"> & GuildUsers & {
  ExcludeRole: string;
  name: string;
  icon: string
  UserRoleName: string | null;
  UserRoleIcon: string | null;
  UserRoleColor: bigint | null;
  ExcludeRoleName: string | null;
}
