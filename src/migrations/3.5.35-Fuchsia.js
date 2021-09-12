import { Migration } from "./migrations";
import { botModel, guildsModel } from "../struct/models";

export default new Migration({
	name: "Initial",
	version: "3.5.35-Fuchsia",
	hash: "457ed66",
	migration: async () => {

		// Guild related migrations
		await guildsModel.find()
			.then(async res => await res
				.forEach(guild => {
					if (!guild.emojiReactions) {
						guild.emojiReactions = {};
						guild.markModified("emojiReactions");
					}
					if (!guild.blockedCategories) {
						guild.blockedCategories = {};
						guild.markModified("blockedCategories");
					}
					if (!guild.settings.excludeRole) guild.settings.excludeRole = "Dadbot-excluded";
					if (typeof guild.settings.stickyRoles !== "boolean") guild.settings.stickyRoles = false;
					if (typeof guild.settings.dadBot === "boolean") {
						const bool = guild.settings.dadBot;
						guild.settings.dadBot = {
							enabled: bool,
							excludedChannels: {},
						};
					}

					// Oh boy.
					if (Object.keys(guild.settings.welcome).includes("message") && Object.keys(guild.settings.welcome).includes("image")) {
						guild.settings.welcome.embed = {
							"plainText": undefined,
							"description": guild.settings.welcome.message || "Welcome to %guild%, %member%!",
							"url": guild.settings.welcome.image || undefined,
							"author": undefined,
							"color": 53380,
							"footer": undefined,
							"thumbnail": undefined,
							"image": undefined,
							"fields": undefined,
						};
						guild.settings.welcome.timeout = null;

						delete guild.settings.welcome["message"];
						delete guild.settings.welcome["color"];
						delete guild.settings.welcome["image"];
					}
					if (Object.keys(guild.settings.goodbye).includes("message") && Object.keys(guild.settings.goodbye).includes("image")) {
						guild.settings.goodbye.embed = {
							"plainText": undefined,
							"description": guild.settings.goodbye.message || "%member% just left the server 👋",
							"url": guild.settings.goodbye.image || undefined,
							"author": undefined,
							"color": 53380,
							"footer": undefined,
							"thumbnail": undefined,
							"image": undefined,
							"fields": undefined,
						};
						guild.settings.goodbye.timeout = null;

						delete guild.settings.goodbye["message"];
						delete guild.settings.goodbye["color"];
						delete guild.settings.goodbye["image"];
					}
					guild.markModified("settings");
					guild.save();
				}),
			);

		// Bot settings migrations
		await botModel.findOneAndUpdate({
			"settings.dailyEnabled": { $exists: false },
			"settings.dailyAmount": { $exists: false },
		}, {
			$set: {
				"settings.dailyEnabled": false,
				"settings.dailyAmount": 250,
			},
		}).exec();

		await botModel.findOneAndUpdate({
			activity: { $exists: true },
			activityType: { $exists: true },
		}, {
			$rename: {
				"activity": "settings.activity",
				"activityType": "settings.activityType",
			},
		}, { strict: false }).exec();
	},
});
