/* eslint-disable no-useless-escape */
import { Command } from "@cataclym/discord-akairo";
import { exec } from "child_process";
import { Message } from "discord.js";
import { codeblock } from "../../nsb/Util";
import { logger } from "../../nsb/Logger";
export default class NeofetchCommand extends Command {
	constructor() {
		super("neofetch", {
			aliases: ["neofetch", "neo"],
			description: { description: "Displays neofetch ascii art", usage: "opensuse" },
			cooldown: 2000,
			typing: true,
			args: [{
				id: "os",
				type: ["AIX", "Hash", "Alpine", "AlterLinux", "Amazon", "Anarchy", "Android", "instantOS",
					"Antergos", "antiX", "AOSC OS", "AOSC OS/Retro", "Apricity", "ArchCraft",
					"ArcoLinux", "ArchBox", "ARCHlabs", "ArchStrike", "XFerience", "ArchMerge", "Arch",
					"Artix", "Arya", "Bedrock", "Bitrig", "BlackArch", "BLAG", "BlankOn", "BlueLight",
					"bonsai", "BSD", "BunsenLabs", "Calculate", "Carbs", "CentOS", "Chakra", "ChaletOS",
					"Chapeau", "Chrom*", "Cleanjaro", "ClearOS", "Clear_Linux", "Clover", "Condres",
					"Container_Linux", "CRUX", "Cucumber", "dahlia", "Debian", "Deepin", "DesaOS",
					"Devuan", "DracOS", "DarkOs", "Itc", "DragonFly", "Drauger", "Elementary",
					"EndeavourOS", "Endless", "EuroLinux", "Exherbo", "Fedora", "Feren", "FreeBSD",
					"FreeMiNT", "Frugalware", "Funtoo", "GalliumOS", "Garuda", "Gentoo", "Pentoo",
					"gNewSense", "GNOME", "GNU", "GoboLinux", "Grombyang", "Guix", "Haiku", "Huayra",
					"Hyperbola", "janus", "Kali", "KaOS", "KDE_neon", "Kibojoe", "Kogaion", "Korora",
					"KSLinux", "Kubuntu", "LEDE", "LaxerOS", "LibreELEC", "LFS", "Linux_Lite", "LMDE",
					"Lubuntu", "Lunar", "macos", "Mageia", "MagpieOS", "Mandriva", "Manjaro", "Maui",
					"Mer", "Minix", "LinuxMint", "Live_Raizo", "MX_Linux", "Namib", "Neptune", "NetBSD",
					"Netrunner", "Nitrux", "NixOS", "Nurunner", "NuTyX", "OBRevenge", "OpenBSD",
					"openEuler", "OpenIndiana", "openmamba", "OpenMandriva", "OpenStage", "OpenWrt",
					"osmc", "Oracle", "OS", "Elbrus", "PacBSD", "Parabola", "Pardus", "Parrot", "Parsix",
					"TrueOS", "PCLinuxOS", "Pengwin", "Peppermint", "popos", "Porteus", "PostMarketOS",
					"Proxmox", "Puppy", "PureOS", "Qubes", "Quibian", "Radix", "Raspbian", "Reborn_OS",
					"Redstar", "Redcore", "Redhat", "Refracted_Devuan", "Regata", "Regolith", "Rosa",
					"sabotage", "Sabayon", "Sailfish", "SalentOS", "Scientific", "Septor",
					"SereneLinux", "SharkLinux", "Siduction", "Slackware", "SliTaz", "SmartOS",
					"Solus", "Source_Mage", "Sparky", "Star", "SteamOS", "SunOS", "openSUSE_Leap", "t2",
					"openSUSE_Tumbleweed", "openSUSE", "SwagArch", "Tails", "Trisquel",
					"Ubuntu-Cinnamon", "Ubuntu-Budgie", "Ubuntu-GNOME", "Ubuntu-MATE",
					"Ubuntu-Studio", "Ubuntu", "Univention", "Venom", "Void", "semc", "Obarun",
					"windows10", "Windows7", "Xubuntu", "Zorin", "IRIX", "Arch", "Ubuntu", "Redhat", "Dragonfly",
					"Ubuntu", "Lubuntu", "Kubuntu", "Xubuntu", "Ubuntu-GNOME",
					"Ubuntu-Studio", "Ubuntu-Mate", "Ubuntu-Budgie",
					"Arcolinux", "Dragonfly", "Fedora", "Alpine", "Arch", "Ubuntu",
					"CRUX", "Debian", "Gentoo", "FreeBSD", "Mac", "NixOS", "OpenBSD", "android",
					"Antrix", "CentOS", "Cleanjaro", "ElementaryOS", "GUIX", "Hyperbola",
					"Manjaro", "MXLinux", "NetBSD", "Parabola", "POP_OS", "PureOS",
					"Slackware", "SunOS", "LinuxLite", "OpenSUSE", "Raspbian",
					"postmarketOS", "Void"],
				default: "Void",
			}],
		});
	}
	public async exec(message: Message, { os }: { os: string }): Promise<void> {

		exec("whoami", (err, out, stdrr) => {
			if (err) {
				return logger.high(err);
			}
			if (stdrr) {
				return logger.high(stdrr);
			}

			return neofetch(out.trim());
		});

		function neofetch(username: string) {
			exec(`neofetch --ascii_distro ${os}|sed 's/\x1B\[[0-9;\?]*[a-zA-Z]//g'`, async (error, stdout, stderr) => {
				if (error) {
					return logger.high(error);
				}
				if (stderr) {
					return logger.high(stderr);
				}

				return message.channel.send(await codeblock(stdout.substring(0, stdout.indexOf(username + "@")).replace(/```/g, "\u0300`\u0300`\u0300`\u0300")));
			});
		}
	}
}