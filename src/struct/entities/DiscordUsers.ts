import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity({ collection: "DiscordUsers" })
export class DiscordUsers {

  @PrimaryKey({ columnType: "bigint", fieldName: "Id" })
      Id!: string;

  @Unique({ name: "UserId" })
  @Property({ columnType: "bigint", fieldName: "UserId" })
      UserId!: string;

  @Property({ columnType: "bigint", fieldName: "Amount", nullable: true, defaultRaw: "0" })
      Amount?: string;

  @Property({ columnType: "timestamp", fieldName: "CreatedAt", defaultRaw: "current_timestamp()" })
      CreatedAt!: Date;

}
