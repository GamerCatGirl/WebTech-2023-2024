import {follower, InsertFollowers} from "~/database/auth";

export default defineEventHandler(async (event) => {
	const putComments = async (newFollower: InsertFollowers) => {
		return database.insert(follower).values(newFollower);
	};

	const body = await readBody(event);

	await putComments(body);
	return true;
})
