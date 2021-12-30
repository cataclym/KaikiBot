// import { DataTypes, Sequelize } from "sequelize";
// import { IGuildInstance } from "../../interfaces/db/IGuildModel";
// import { IGuildMemberInstance } from "../../interfaces/db/IGuildMember";
// import { IDadbotChannelInstance } from "../../interfaces/db/IDadbotChannel";
// import { IEmojiReactionsInstance } from "../../interfaces/db/IEmojiReactions";
// import { ILeaveRolesInstance } from "../../interfaces/db/ILeaveRoles";
// import { IEmojiStatsInstance } from "../../interfaces/db/IEmojiStats";
// import { ITodoInstance } from "../../interfaces/db/ITodo";
// import { IUserNicknamesInstance } from "../../interfaces/db/IUserNicknames";
//
// import sequelize from "./sequelize";
//
// const _Migrations = sequelize.define("_Migrations", {
// 	migrationId: {
// 		type: DataTypes.STRING,
// 		unique: true,
// 		allowNull: false,
// 		primaryKey: true,
// 	},
// 	versionString: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 	},
// });
//
// const botModel = sequelize.define("BotSettings", {
// 	activity: {
// 		type: DataTypes.STRING,
// 		defaultValue: null,
// 	},
// 	activityType: {
// 		type: DataTypes.STRING,
// 		defaultValue: null,
// 	},
// 	currencyName: {
// 		type: DataTypes.STRING,
// 		defaultValue: "Yen",
// 	},
// 	currencySymbol: {
// 		type: DataTypes.STRING,
// 		defaultValue: "💴",
// 	},
// 	dailyEnabled: {
// 		type: DataTypes.BOOLEAN,
// 		defaultValue: false,
// 	},
// 	dailyAmount: {
// 		type: DataTypes.BIGINT.UNSIGNED,
// 		defaultValue: 250,
// 	},
// });
//
// const discordUserModel = sequelize.define("DiscordUser", {
// 	id: {
// 		type: DataTypes.INTEGER.UNSIGNED,
// 		autoIncrement: true,
// 		primaryKey: true,
// 		allowNull: false,
// 	},
// 	userId: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 		unique: true,
// 	},
// 	amount: {
// 		type: DataTypes.BIGINT.UNSIGNED,
// 		defaultValue: 0,
// 	},
// });
//
// const commandStatsModel = sequelize.define("CommandStats", {
// 	commandAlias: {
// 		primaryKey: true,
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 		unique: true,
// 	},
// 	count: {
// 		type: DataTypes.INTEGER.UNSIGNED,
// 		defaultValue: 0,
// 	},
// });
//
// const guildMemberModel = sequelize.define<IGuildMemberInstance>("GuildUsers", {
// 	id: {
// 		type: DataTypes.INTEGER.UNSIGNED,
// 		autoIncrement: true,
// 		primaryKey: true,
// 		allowNull: false,
// 	},
// 	userId: {
// 		type: DataTypes.STRING,
// 		primaryKey: true,
// 		allowNull: false,
// 	},
// 	userRole: {
// 		type: DataTypes.STRING,
// 	},
// 	guildId: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 	},
// });
//
// const guildModel = sequelize.define<IGuildInstance>("Guilds", {
// 	id: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 		unique: true,
// 		primaryKey: true,
// 	},
// 	prefix: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 	},
// 	anniversary: {
// 		type: DataTypes.BOOLEAN,
// 		allowNull: false,
// 	},
// 	dadbot: {
// 		type: DataTypes.BOOLEAN,
// 		defaultValue: true,
// 	},
// 	errorColor: {
// 		type: DataTypes.INTEGER,
// 		allowNull: false,
// 	},
// 	okColor: {
// 		type: DataTypes.INTEGER,
// 		allowNull: false,
// 	},
// 	excludeRole: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 	},
// 	stickyRoles: {
// 		type: DataTypes.BOOLEAN,
// 		defaultValue: false,
// 	},
// 	blockedCategories: {
// 		type: DataTypes.INTEGER,
// 		allowNull: false,
// 	},
// });
//
// const dadbotChannelsModel = sequelize.define<IDadbotChannelInstance>("DadbotChannels", {
// 	channelId: {
// 		type: DataTypes.STRING,
// 		primaryKey: true,
// 	},
// 	guildId: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 	},
// });
//
// const emojiReactionsModel = sequelize.define<IEmojiReactionsInstance>("EmojiReactions", {
// 	id: {
// 		type: DataTypes.INTEGER,
// 		primaryKey: true,
// 		autoIncrement: true,
// 	},
// 	emojiId: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 	},
// 	triggerString: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 	},
// 	guildId: {
// 		type: DataTypes.STRING,
// 	},
// });
//
// const emojiStatsModel = sequelize.define<IEmojiStatsInstance>("EmojiStats", {
// 	emojiId: {
// 		type: DataTypes.STRING,
// 		primaryKey: true,
// 	},
// 	count: {
// 		type: DataTypes.INTEGER,
// 		allowNull: false,
// 	},
// 	guildId: {
// 		type: DataTypes.STRING,
// 	},
// });
//
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// const leaveRolesModel = sequelize.define<ILeaveRolesInstance>("LeaveRoles", {
// 	id: {
// 		primaryKey: true,
// 		autoIncrement: true,
// 		type: DataTypes.INTEGER.UNSIGNED,
// 		allowNull: false,
// 	},
// 	roleId: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 	},
// 	// guildUserId: {
// 	// 	type: DataTypes.INTEGER.UNSIGNED,
// 	// },
// });
//
// const todoModel = sequelize.define<ITodoInstance>("Todo", {
// 	id: {
// 		type: DataTypes.INTEGER.UNSIGNED,
// 		primaryKey: true,
// 		autoIncrement: true,
// 		allowNull: false,
// 	},
// 	userId: {
// 		type: DataTypes.INTEGER.UNSIGNED,
// 	},
// 	string: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 	},
// });
//
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// const userNicknamesModel = sequelize.define<IUserNicknamesInstance>("UserNicknames", {
// 	id: {
// 		primaryKey: true,
// 		autoIncrement: true,
// 		type: DataTypes.INTEGER.UNSIGNED,
// 		allowNull: false,
// 	},
// 	nickname: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 	},
// 	// guildUserId: {
// 	// 	type: DataTypes.INTEGER.UNSIGNED,
// 	// },
// });
//
// // Associations
// // guildMemberModel
// guildMemberModel.hasOne(leaveRolesModel);
// guildMemberModel.hasOne(userNicknamesModel);
//
// // guildModel
// guildModel.hasOne(dadbotChannelsModel, {
// 	foreignKey: "guildId",
// });
// guildModel.hasOne(emojiReactionsModel, {
// 	foreignKey: "guildId",
// });
// guildModel.hasMany(emojiStatsModel, {
// 	foreignKey: "guildId",
// });
// guildModel.hasMany(guildMemberModel, {
// 	foreignKey: "guildId",
// });
//
// // discordUserModel
// discordUserModel.hasOne(todoModel, {
// 	foreignKey: "userId",
// });
//
// export async function syncModels(sql: Sequelize) {
// 	// Change to true when you want to drop all tables before syncing
// 	// for debugging
// 	void await sql.sync({ force: true });
// }
