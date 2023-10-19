import { recipes, recipeFts } from "@/database/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    let pageSize = (query.size?.valueOf() as number) ?? 100;
    pageSize = pageSize > 100 ? 100 : pageSize;
    const page = (query.page?.valueOf() as number) ?? 0;
    if (query.search) {
        const search = query.search.valueOf();
        const highlight = query.high?.valueOf() ?? "";
        const highlightStart = query.highStart?.valueOf() ?? highlight;
        const highlightEnd = query.highEnd?.valueOf() ?? highlight;
        return database
            .select({
                id: recipeFts.id,
                name: sql<string>`highlight(recipe_fts, 1, ${highlightStart}, ${highlightEnd})`,
                description: sql<string>`highlight(recipe_fts, 2, ${highlightStart}, ${highlightEnd})`,
                location: recipes.location,
                thumbnail: recipes.thumbnail,
            })
            .from(recipeFts)
            .where(sql`recipe_fts MATCH ${search}`)
            .orderBy(sql`bm25(recipe_fts, 0, 2, 1)`)
            .limit(pageSize)
            .offset(pageSize * page)
            .leftJoin(recipes, eq(recipes.id, recipeFts.id));
    } else {
        return database
            .select()
            .from(recipes)
            .limit(pageSize)
            .offset(pageSize * page);
    }
});
