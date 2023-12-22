import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            message: "ID is not defined",
        });
    }
    const id = event.context.params.id;
    const recipeName = query.name?.valueOf();

    if (query.amount?.valueOf())
        return (
            await database.query.recipes
                .findMany({
                    columns: {},
                    extras: { count: sql`COUNT(*)`.as("count") },
                    where: (recipe, { and, eq, like }) =>
                        recipeName
                            ? and(eq(recipe.user, id), like(recipe.name, recipeName.toString()))
                            : eq(recipe.user, id),
                })
                .execute()
        )[0].count;
    else
        return database.query.recipes.findMany({
            where: (recipe, { and, eq, like }) =>
                recipeName ? and(eq(recipe.user, id), like(recipe.name, recipeName.toString())) : eq(recipe.user, id),
        });
});
