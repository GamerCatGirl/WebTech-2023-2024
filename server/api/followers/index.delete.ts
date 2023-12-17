import { eq } from "drizzle-orm";
import { follower } from "~/database/auth";	

export default defineEventHandler(async (event) => {

	const body = await readBody(event);

	await database.delete(follower).where(eq(follower.idFollower, body.idFollower)
						&&
					      eq(follower.idFollowing, body.idFollowing)
					     );
	
});
