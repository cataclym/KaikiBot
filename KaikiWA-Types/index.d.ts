// Data sent when requested for each guild
export type GETGuildBody = {
    guild: Omit<Guild, "ExcludeRole"> & {
        // Overwrites Guild ExcludedRole with data from bot cache
        ExcludeRole: { color: number; id: string; name: string } | null;
        channels: { id: string; name: string }[];
        roles: { id: string; name: string; color: number }[];
        emojis: { id: string; name: string | null; url: string; animated: boolean | null }[];
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

// Initial data sent to the dashboard
export type POSTUserGuildsBody = {
    // Used to filter out guilds to show
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
    WelcomeChannel: bigint | null,
    WelcomeMessage: string | null,
    WelcomeTimeout: number | null,
    ByeChannel: bigint | null,
    ByeMessage: string | null,
    ByeTimeout: number | null,
    CreatedAt: Date
}

type GuildUsers = {
    UserId: bigint,
    UserRole: bigint | null,
    GuildId: bigint,
    CreatedAt: Date,
}
