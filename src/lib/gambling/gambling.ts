const slotDict: {[num: number]: string} = {
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
	20: "🥑",

};

const randomEmoji = () => slotDict[Math.floor(Math.random() * 19) + 1];

export async function playSlots(): Promise<{
string: string;
numbers: string[];
}> {

	const index1 = randomEmoji();
	const index2 = randomEmoji();
	const index3 = randomEmoji();
	const index4 = randomEmoji();
	const index5 = randomEmoji();
	const index6 = randomEmoji();
	const index7 = randomEmoji();
	const index8 = randomEmoji();
	const index9 = randomEmoji();

	return { string: `[ Kaiki Slots ]
${index1} - ${index2} - ${index3}
${index4} - ${index5} - ${index6}
${index7} - ${index8} - ${index9}
| - - - 💵 - - - |`,

	numbers: [index4, index5, index6] };

}