import { eq, sql, and } from "drizzle-orm";
import { recipes, recipeFts } from "@/database/schema";

export default defineEventHandler((event) => {
    const query = getQuery(event);
    const queryParams = getSeachVars(query);
    const pageSize = queryParams.pageSize;
    const page = queryParams.page;
    if (queryParams.query) {
        const search = queryParams.query;
        const highlight = query.high?.valueOf() ?? "";
        const highlightStart = query.highStart?.valueOf() ?? highlight;
        const highlightEnd = query.highEnd?.valueOf() ?? highlight;
        const textSearch = sql`recipe_fts MATCH ${search}`;
        const queryRes = database
            .select({
                id: recipeFts.id,
                name: sql<string>`highlight(recipe_fts, 1, ${highlightStart}, ${highlightEnd})`,
                description: sql<string>`highlight(recipe_fts, 2, ${highlightStart}, ${highlightEnd})`,
                user: recipes.user,
                location: recipes.location,
                thumbnail: recipes.thumbnail,
            })
            .from(recipeFts)
            .where(query.user ? and(eq(recipes.user, query.user?.valueOf().toString()), textSearch) : textSearch)
            .orderBy(sql`bm25(recipe_fts, 0, 2, 1)`)
            .limit(pageSize)
            .offset(pageSize * page)
            .leftJoin(recipes, eq(recipes.id, recipeFts.id));
        return queryRes;
    } else {
        return database
            .select()
            .from(recipes)
            .limit(pageSize)
            .offset(pageSize * page);
    }
});
