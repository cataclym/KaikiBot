import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ collection: "CurrencyTransactions" })
export class CurrencyTransactions {

  @PrimaryKey({ columnType: "bigint", fieldName: "Id", nullable: true, defaultRaw: "NULL" })
      Id?: string;

  @Property({ columnType: "bigint", fieldName: "Amount", nullable: true, defaultRaw: "NULL" })
      Amount?: string;

  @Property({ columnType: "text", fieldName: "Reason", length: 65535, nullable: true, defaultRaw: "NULL" })
      Reason?: string;

  @Property({ columnType: "bigint", fieldName: "UserId", nullable: true, defaultRaw: "NULL" })
      UserId?: string;

  @Property({ columnType: "timestamp", fieldName: "DateAdded", defaultRaw: "current_timestamp()" })
      DateAdded!: Date;

}
