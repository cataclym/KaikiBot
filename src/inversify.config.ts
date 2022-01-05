import { Container } from "inversify";
import "reflect-metadata";
import { Bot } from "./struct/bot";
import { KaikiClient } from "./struct/kaikiClient";
import { TYPES } from "./struct/types";

const container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<KaikiClient>(TYPES.Client).toConstantValue(new KaikiClient());
container.bind<string>(TYPES.Token).toConstantValue(process.env.CLIENT_TOKEN!);

export default container;
