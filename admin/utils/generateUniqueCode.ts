export default function generateUniqueCode(length: number, allCodes: (string|null)[] | undefined): string {
	let result = "";
	const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	if (allCodes?.includes(result)) {
		return generateUniqueCode(length, allCodes)
	}
	return result;
}
