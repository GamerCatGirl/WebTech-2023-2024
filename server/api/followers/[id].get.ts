export default defineEventHandler(async (event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      message: "ID is not defined",
    });
  }

  const id = event.context.params.id as string;

  if (!id) throw createError({ statusCode: 400, message: "ID is not defined" });


  //check if id -> id is id User
  const userExists = await database.query.users.findFirst({
    where: (user, {eq}) => eq(user.id, id),
  });

  if (!userExists) throw createError({statusCode: 404, message: "User not found"});

  let followers = await database.query.follower.findMany({
    where: (follower, { eq }) => eq(follower.idFollowing, id),
  });

  let following = await database.query.follower.findMany({
    where: (follower, { eq }) => eq(follower.idFollower, id),
  });

  const result = { following: following, followers: followers };

  return result;
});
