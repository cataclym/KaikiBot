// eslint-disable-next-line import/no-unresolved
import "@sapphire/plugin-logger/register";
import "./extensions/Discord";
import "./extensions/Sapphire";
import "./struct/ErrorHandler";
import KaikiSapphireClient from "./lib/Kaiki/KaikiSapphireClient";
import { config } from "dotenv";

config();

new KaikiSapphireClient();
