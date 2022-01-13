import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity({ collection: "Guilds" })
export class Guilds {

  @Unique({ name: "Id" })
  @PrimaryKey({ columnType: "bigint", fieldName: "Id" })
      Id!: string;

  @Property({ fieldName: "Prefix", length: 255 })
      Prefix!: string;

  @Property({ fieldName: "Anniversary", nullable: true })
      Anniversary?: boolean = false;

  @Property({ fieldName: "DadBot", nullable: true })
      DadBot?: boolean = true;

  @Property({ columnType: "bigint", fieldName: "ErrorColor" })
      ErrorColor!: string;

  @Property({ columnType: "bigint", fieldName: "OkColor" })
      OkColor!: string;

  @Property({ fieldName: "ExcludeRole", length: 255, nullable: true, defaultRaw: "NULL" })
      ExcludeRole?: string;

  @Property({ columnType: "bigint", fieldName: "WelcomeChannel", nullable: true, defaultRaw: "NULL" })
      WelcomeChannel?: string;

  @Property({ columnType: "bigint", fieldName: "ByeChannel", nullable: true, defaultRaw: "NULL" })
      ByeChannel?: string;

  @Property({ fieldName: "WelcomeMessage", length: 16777215, columnType: "mediumtext", nullable: true, defaultRaw: "NULL" })
      WelcomeMessage?: string;

  @Property({ fieldName: "ByeMessage", length: 16777215, columnType: "mediumtext", nullable: true, defaultRaw: "NULL" })
      ByeMessage?: string;

  @Property({ fieldName: "StickyRoles", nullable: true })
      StickyRoles?: boolean = false;

  @Property({ fieldName: "CreatedAt" })
      CreatedAt!: Date;

}
