import logger from "loglevel";
// Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
export const aniQuery = `
query ($page: Int, $perPage: Int, $search: String, $type: MediaType) {
          Page(page: $page, perPage: $perPage) {
            media(search: $search, type: $type) {
              idMal
              title {
                romaji
                english
              }
              coverImage {
                large
                color
              }
              description
              bannerImage
              format
              status
              type
              meanScore
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              duration
              source
              episodes
              chapters
              volumes
              studios {
                nodes {
                  name
                }
              }
              synonyms
              genres
              trailer {
                id
                site
              }
              externalLinks {
                site
                url
              }
              siteUrl
              isAdult
              nextAiringEpisode {
                episode
                timeUntilAiring
              }
            }
          }
        }
`;

export const mangaQuery = `
query ($page: Int, $perPage: Int, $search: String, $type: MediaType) {
          Page(page: $page, perPage: $perPage) {
            media(search: $search, type: $type) {
              idMal
              title {
                romaji
                english
              }
              coverImage {
                large
                color
              }
              description
              bannerImage
              format
              status
              type
              meanScore
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              duration
              source
              episodes
              chapters
              volumes
              synonyms
              genres
              trailer {
                id
                site
              }
              externalLinks {
                site
                url
              }
              siteUrl
              isAdult
              nextAiringEpisode {
                episode
                timeUntilAiring
              }
            }
          }
        }
`;

export function handleResponse(response: { json: () => Promise<any>; ok: any; }) {
	return response.json().then((json) => {
		return response.ok
			? json
			: Promise.reject(json);
	});
}

export function handleError(error: any) {
	logger.error(error);
}
