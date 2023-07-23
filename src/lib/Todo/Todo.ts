import { Todos } from "@prisma/client";
import Constants from "../../struct/Constants";
import KaikiUtil from "../KaikiUtil";

export class Todo {
    public static reminderArray(todoArray: Todos[]) {
        return todoArray.map((todo, i) => `${+i + 1}. ${KaikiUtil.trim(todo.String.split(/\r?\n/).join(" "), Constants.MAGIC_NUMBERS.CMDS.UTILITY.TODO.INPUT_MAX_LENGTH)}`);
    }
}
