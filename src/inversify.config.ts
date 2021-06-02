import { Container } from "inversify";
import "reflect-metadata";
import { Bot } from "./struct/bot";
import { customClient } from "./struct/client";
import { TYPES } from "./struct/types";

const container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<customClient>(TYPES.Client).toConstantValue(new customClient());
container.bind<string>(TYPES.Token).toConstantValue(process.env.CLIENT_TOKEN!);

export default container;