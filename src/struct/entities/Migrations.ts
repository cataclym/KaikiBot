import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity({ collection: "_Migrations" })
export class Migrations {

  @Unique({ name: "MigrationId" })
  @PrimaryKey({ fieldName: "MigrationId", length: 255 })
      MigrationId!: string;

  @Property({ fieldName: "VersionString", length: 255 })
      VersionString!: string;

}
