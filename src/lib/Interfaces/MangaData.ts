export default interface MangaData {
    data: Data;
}

export interface Data {
    Page: Page;
}

export interface Page {
    media: Media[];
}

export interface Media {
    idMal: number;
    title: Title;
    coverImage: CoverImage;
    description: string;
    bannerImage: null | string;
    format: string;
    status: string;
    type: string;
    meanScore: number;
    startDate: EndDateClass;
    endDate: EndDateClass;
    duration: null;
    source: string;
    episodes: null;
    chapters: number | null;
    volumes: number | null;
    synonyms: string[];
    genres: string[];
    trailer: null;
    externalLinks: ExternalLink[];
    siteUrl: string;
    isAdult: boolean;
    nextAiringEpisode: null;
}

export interface CoverImage {
    large: string;
    color: null | string;
}

export interface EndDateClass {
    year: number | null;
    month: number | null;
    day: number | null;
}

export interface ExternalLink {
    site: string;
    url: string;
}

export interface Title {
    romaji: string;
    english: null | string;
}
