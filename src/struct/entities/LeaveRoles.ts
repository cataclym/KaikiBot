import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { GuildUsers } from "./GuildUsers";

@Entity({ collection: "LeaveRoles" })
export class LeaveRoles {

  @PrimaryKey({ columnType: "bigint", fieldName: "Id" })
      Id!: string;

  @Property({ columnType: "bigint", fieldName: "RoleId" })
      RoleId!: string;

  @ManyToOne({ entity: () => GuildUsers, fieldName: "GuildUserId", onUpdateIntegrity: "cascade", onDelete: "cascade", nullable: true, defaultRaw: "NULL", index: "GuildUserId" })
      GuildUserId?: GuildUsers;

}
