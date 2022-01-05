// import { blockedCategories } from "../constants";
//
// export function solveCategoriesFromDB(numbers = 000000000000) {
//     const res: {[k in blockedCategories]: boolean} = {
//         Administration: false,
//         Anime: false,
//         Emotes: false,
//         Fun: false,
//         Gambling: false,
//         Moderation: false,
//         NSFW: false,
//         "Owner only": false,
//         Reactions: false,
//         Roles: false,
//         "Server settings": false,
//         Utility: false,
//     };
//
//     for (let i = 12; i >= 0; i--) {
//         const last = numbers % 10;
//         numbers = Math.floor(numbers / 10);
//         res[i as unknown as blockedCategories] = Boolean(last);
//     }
//     return res;
// }
