export type GETGuildBody = {
    guild: Guild & {
        channels: { id: string; name: string }[];
    },
    user: {
        userRole: { color: number; icon: string | null; id: string; name: string } | null;
    }
}

// Custom type for data coming from the Webserver
export type PUTDashboardResponse = Omit<Guild, "Id" | "CreatedAt"> & GuildUsers & {
    ExcludeRole: string;
    name: string;
    icon: string
    UserRoleName: string | null;
    UserRoleIcon: string | null;
    UserRoleColor: bigint | null;
    ExcludeRoleName: string | null;
}

export type POSTUserGuildsBody = {
    guildDb: { Id: bigint }[];
    userData: {
        UserId: bigint,
        Amount: bigint,
        ClaimedDaily: boolean,
        DailyReminder: Date | null
    } | null
}

type Guild = {
    Id: bigint,
    Prefix: string,
    Anniversary: boolean,
    DadBot: boolean,
    StickyRoles: boolean,
    ErrorColor: bigint,
    OkColor: bigint,
    ExcludeRole: bigint,
    WelcomeChannel: bigint
    WelcomeMessage: string,
    WelcomeTimeout: number,
    ByeChannel: bigint,
    ByeMessage: string,
    ByeTimeout: number,
    CreatedAt: Date
}

type GuildUsers = {
    UserId: bigint,
    UserRole: bigint | null,
    GuildId: bigint,
    CreatedAt: Date,
}