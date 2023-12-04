import {images, InsertImage} from "~/database/recipe";

export default defineEventHandler(async (event) => {
	const putImage = async (image: InsertImage) => {
		return database.insert(images).values(image);
	};

	const body = await readBody(event);
	await putImage(body);
	return true;
})
