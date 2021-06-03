export interface Post {
    id: number;
    created_at: Date;
    updated_at: Date;
    file: File;
    preview: Preview;
    sample: Sample;
    score: Score;
    tags: Tags;
    locked_tags: string[];
    change_seq: number;
    flags: Flags;
    rating: Rating;
    fav_count: number;
    sources: string[];
    pools: number[];
    relationships: Relationships;
    approver_id: number | null;
    uploader_id: number;
    description: string;
    comment_count: number;
    is_favorited: boolean;
    has_notes: boolean;
    duration: number | null;
}

export interface File {
    width: number;
    height: number;
    ext: EXT;
    size: number;
    md5: string;
    url: null | string;
}

export enum EXT {
    GIF = "gif",
    Jpg = "jpg",
    PNG = "png",
    Webm = "webm",
}

export interface Flags {
    pending: boolean;
    flagged: boolean;
    note_locked: boolean;
    status_locked: boolean;
    rating_locked: boolean;
    deleted: boolean;
}

export interface Preview {
    width: number;
    height: number;
    url: null | string;
}

export enum Rating {
    E = "e",
}

export interface Relationships {
    parent_id: number | null;
    has_children: boolean;
    has_active_children: boolean;
    children: number[];
}

export interface Sample {
    has: boolean;
    height: number;
    width: number;
    url: null | string;
    alternates: { [key: string]: Alternate };
}

export interface Alternate {
    type: Type;
    height: number;
    width: number;
    urls: Array<null | string>;
}

export enum Type {
    Video = "video",
}

export interface Score {
    up: number;
    down: number;
    total: number;
}

export interface Tags {
    general: string[];
    species: string[];
    character: string[];
    copyright: string[];
    artist: string[];
    invalid: string[];
    lore: string[];
    meta: string[];
}

export interface responseE621 {
    posts: Post[];
}