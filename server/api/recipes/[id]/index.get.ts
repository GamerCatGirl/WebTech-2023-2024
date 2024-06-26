import { desc } from "drizzle-orm";
import { comments } from "~/database/recipe";

export default defineEventHandler((event) => {
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            message: "ID is not defined",
        });
    }
    const id = event.context.params.id as string;

    return database.query.recipes
        .findFirst({
            where: (recipe, { eq }) => eq(recipe.id, id),
            with: {
                user: { columns: { id: true, name: true } },
                ingredients: { orderBy: ({ index }, { asc }) => [asc(index)] },
                comments: {
                    where: (comment, { eq, and, isNull }) => and(eq(comment.recipe, id), isNull(comment.replied)),
                    with: { user: { columns: { id: true, name: true, image: true } } },
                    orderBy: [desc(comments.likes)],
                },
            },
        })

        .execute();
});
