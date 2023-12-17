import { follower } from "~/database/auth";
import {user} from "~/database/auth";

export default defineEventHandler(async (event) => {
	if (!event.context.params) {
		throw createError({
			statusCode: 400,
			message: "ID is not defined",
		});
	}

	const id = event.context.params.id as string;

	console.log(id);
	let followers = await database.query.follower.findMany({
			where: (follower, { eq }) => eq(follower.idFollowing, id),
		});;
	let following = await database.query.follower.findMany({
			where: (follower, { eq }) => eq(follower.idFollower, id),
		});


	const result = { following: following, followers: followers };

	return result;
});
