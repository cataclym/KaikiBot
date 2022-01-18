import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Guilds } from './Guilds';

@Entity({ collection: 'EmojiStats' })
export class EmojiStats {

  @PrimaryKey({ columnType: 'bigint', fieldName: 'EmojiId' })
  EmojiId!: string;

  @Property({ columnType: 'bigint', fieldName: 'Count' })
  Count!: string;

  @ManyToOne({ entity: () => Guilds, fieldName: 'GuildId', onUpdateIntegrity: 'cascade', onDelete: 'cascade', index: 'GuildId' })
  GuildId!: Guilds;

}
