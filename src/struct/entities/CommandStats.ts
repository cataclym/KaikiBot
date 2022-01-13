import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity({ collection: "CommandStats" })
export class CommandStats {

  @Unique({ name: "CommandAlias" })
  @PrimaryKey({ fieldName: "CommandAlias", length: 255 })
      CommandAlias!: string;

  @Property({ columnType: "bigint", fieldName: "Count", nullable: true, defaultRaw: "0" })
      Count?: string;

  @Property({ columnType: "timestamp", fieldName: "CreatedAt", defaultRaw: "current_timestamp()" })
      CreatedAt!: Date;

}
