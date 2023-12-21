import { eq } from "drizzle-orm";
import { follower } from "~/database/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  //idFollower = logged in User
  //check if user is logged in
  const user = await authenticate(event, undefined);
  body.idFollower = user;

  //check if idFollowingExists
  //check if id -> id is id User
  const followingUserExists = await database.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, body.idFollowing),
  });

  if (!followingUserExists)
    throw createError({ statusCode: 404, message: "User to follow not found" });

  const deleteExists = await database
    .delete(follower)
    .where(
      eq(follower.idFollower, body.idFollower) &&
        eq(follower.idFollowing, body.idFollowing),
    );

  if (deleteExists.changes == 0) {
    throw createError({
      statusCode: 404,
      message: "Current user is not a follower",
    });
  }

  return true;
});
