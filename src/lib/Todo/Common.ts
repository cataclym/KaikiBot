import { Todos } from "@prisma/client";
import Constants from "../../struct/Constants";
import Utility from "../Utility";

export class Todo {
    public static ReminderArray(todoArray: Todos[]) {
        return todoArray.map((todo, i) => `${+i + 1}. ${Utility.trim(todo.String.split(/\r?\n/).join(" "), Constants.MAGIC_NUMBERS.EMBED_LIMITS.FIELD.NAME)}`);
    }
}
