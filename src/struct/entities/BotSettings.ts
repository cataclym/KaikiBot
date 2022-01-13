import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ collection: "BotSettings" })
export class BotSettings {

  @PrimaryKey({ columnType: "enum", fieldName: "Id" })
      Id!: string;

  @Property({ fieldName: "Activity", length: 255, nullable: true, defaultRaw: "NULL" })
      Activity?: string;

  @Property({ columnType: "enum", fieldName: "ActivityType", nullable: true, defaultRaw: "NULL" })
      ActivityType?: string;

  @Property({ fieldName: "CurrencyName", length: 255, nullable: true, default: "Yen" })
      CurrencyName?: string;

  @Property({ columnType: "bigint", fieldName: "CurrencySymbol", nullable: true, defaultRaw: "128180" })
      CurrencySymbol?: string;

  @Property({ fieldName: "DailyEnabled", nullable: true })
      DailyEnabled?: boolean = false;

  @Property({ columnType: "bigint", fieldName: "DailyAmount", nullable: true, defaultRaw: "250" })
      DailyAmount?: string;

}
