import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Guilds } from "./Guilds";

@Entity()
export class EmojiReactions {

    @PrimaryGeneratedColumn({ type: "bigint" })
        Id: bigint;

    @Column({ type: "bigint" })
        EmojiId: bigint;

    @Column("varchar", { length: 255 })
        TriggerString: string;

    // @ManyToOne({ entity: () => Guilds, fieldName: "GuildId", onUpdateIntegrity: "cascade", onDelete: "cascade", index: "GuildId" })
    @ManyToOne(type => EmojiReactions, emojiReactions => emojiReactions.children)
    // GuildId!: Guilds;
        parent: Guilds;

    @OneToMany(type => EmojiReactions, emojiReactions => emojiReactions.parent)
        children: EmojiReactions[];
}

