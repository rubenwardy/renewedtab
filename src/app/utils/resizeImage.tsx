import { readBlobAsDataURL } from "./blob";

function loadImage(data: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject
		img.src = data;
	});
}


/**
 * @returns data url
 */
export default async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
	const data = await readBlobAsDataURL(file);
	const image = await loadImage(data);
	const scaleFactor = Math.max(maxWidth / image.width, maxHeight / image.height);
	if (scaleFactor >= 1) {
		return data;
	}

	const width = Math.round(image.width * scaleFactor);
	const height = Math.round(image.height * scaleFactor);

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	canvas.getContext("2d")!.drawImage(image, 0, 0, width, height);
	const newData = canvas.toDataURL("image/jpeg");

	console.log(`Resized to ${width}, ${height}. Old: ${data.length / 1024 / 1024} MB vs New: ${newData.length / 1024 / 1024}`);

	if (newData.length < data.length) {
		return newData;
	} else {
		console.warn("Resize failed, old image smaller than new image");
		return data;
	}
}
