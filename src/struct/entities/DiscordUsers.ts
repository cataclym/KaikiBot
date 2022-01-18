import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "DiscordUsers" })
export class DiscordUsers {

  @PrimaryGeneratedColumn({ type: "bigint" })
      Id: bigint;

  @Unique("UserId", ["UserId"])
  @Column({ type: "bigint" })
      UserId: bigint;

  @Column({ type: "bigint", name: "Amount", nullable: true, default: "0" })
      Amount: bigint;

  @Column({ type: "timestamp", name: "CreatedAt", default: "current_timestamp()" })
      CreatedAt: Date;

}
