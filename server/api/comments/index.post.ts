import {comments, InsertComment} from "~/database/recipe";

export default defineEventHandler(async (event) => {
	const putComments = async (comment: InsertComment) => {
		return database.insert(comments).values(comment);
	};

	const body = await readBody(event);
	await putComments(body);
	return true;
})
