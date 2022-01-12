const slotDict: { [num: number]: string } = {
    0: "🥑",
    1: "🍏",
    2: "🍎",
    3: "🍐",
    4: "🍊",
    5: "🍋",
    6: "🍌",
    7: "🍉",
    8: "🍇",
    9: "🫐",
    10: "🍓",
    11: "🍈",
    12: "🍒",
    13: "🍑",
    14: "🥭",
    15: "🍍",
    16: "🥥",
    17: "🥝",
    18: "🍅",
    19: "🍆",
};

const randomEmoji = () => slotDict[Math.floor(Math.random() * 19)];

export async function playSlots(): Promise<{
  string: string;
  numbers: string[];
}> {

	const arr = new Array(9);
	for (let i = 0; i < arr.length; i++) {
		await (async () => {
			arr[i] = randomEmoji();
		})();
	}

    return {
        string: `[ Kaiki Slots ]
${arr[0]} - ${arr[1]} - ${arr[2]}
${arr[3]} - ${arr[4]} - ${arr[5]}
${arr[6]} - ${arr[7]} - ${arr[8]}
| - - - 💴 - - - |`,

        numbers: [arr[3], arr[4], arr[5]],
    };

}
