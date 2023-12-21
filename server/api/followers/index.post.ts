import { follower, InsertFollowers } from "~/database/auth";

export default defineEventHandler(async (event) => {
  const putComments = async (newFollower: InsertFollowers) => {
    return database.insert(follower).values(newFollower);
  };

  const body = await readBody(event);

  // add current user to body
  const user = await authenticate(event, undefined);
  body.idFollower = user;

  // check if user to follow exists
  const followingUserExists = await database.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, body.idFollowing),
  });

  if (!followingUserExists)
    throw createError({ statusCode: 404, message: "User to follow not found" });


  //check if follow combination already exists
  const followExists = await database.query.follower.findFirst({
	  where: (follow, {and, eq}) => and(eq(follow.idFollowing, body.idFollowing), 
				       eq(follow.idFollower, body.idFollower)
				      ),
  });

  if (followExists){
	  throw createError({statusCode: 400, message: "already following the user"})
  }

  await putComments(body);
  return true;
});
