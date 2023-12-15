import { eq, sql, and, or, asc, desc, SQL } from "drizzle-orm";
import { SQLiteColumn } from "drizzle-orm/sqlite-core";
import { recipes, recipeFts, users } from "@/database/schema";
const recipesColumns = Object.values(recipes).map((object) => object.name);

function testArray(object: any, column: SQLiteColumn<any>) {
    if (Array.isArray(object)) {
        const conditions: SQL<unknown>[] = [];
        object.forEach((o) => conditions.push(eq(column, o)));
        return or(...conditions);
    } else return eq(column, object);
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const queryParams = getSeachVars(query);
    const pageSize = queryParams.pageSize;
    const page = queryParams.page;

    if (query.sortOn && query.sort && !recipesColumns.includes(query.sortOn as string))
        throw createError({ statusCode: 400, message: "`sortOn` is not a column of recipes" });
    const sortFunction = parseInt(query.sort as string) === 1 ? asc : desc;

    if (queryParams.query || query.mealType || query.difficulty || query.user) {
        const search = queryParams.query;
        const highlight = query.high?.valueOf() ?? "";
        const highlightStart = query.highStart?.valueOf() ?? highlight;
        const highlightEnd = query.highEnd?.valueOf() ?? highlight;
        const conditions: (SQL<unknown> | undefined)[] = [];

        if (query.user) conditions.push(testArray(query.user.valueOf(), recipes.user));
        if (query.mealType) conditions.push(testArray(query.mealType.valueOf(), recipes.type));
        if (query.difficulty) conditions.push(testArray(query.difficulty.valueOf(), recipes.difficulty));

        const sub = database
            .select({
                id: recipeFts.id,
                name: sql<string>`highlight(recipe_fts, 1, ${highlightStart}, ${highlightEnd})`.as("highlihgtedName"),
                description: sql<string>`highlight(recipe_fts, 2, ${highlightStart}, ${highlightEnd})`.as(
                    "highlihgtedDescription"
                ),
            })
            .from(recipeFts)
            .where(search ? sql`recipe_fts MATCH ${search}` : undefined)
            .orderBy(sql`bm25(recipe_fts, 0, 2, 1)`)
            .as("sub");
        const dbQuery = database
            // @ts-ignore
            .select({
                ...recipes,
                name: sub.name,
                description: sub.description,
                userName: users.name,
            })
            .from(sub)
            .where(and(...conditions))
            .limit(pageSize)
            .offset(pageSize * page)
            .leftJoin(recipes, eq(recipes.id, sub.id))
            .leftJoin(users, eq(recipes.user, users.id));
        if (query.sortOn && query.sort) dbQuery.orderBy(sortFunction(recipes[query.sortOn.valueOf() as string]));
        const amountQuery = database
            .select({ totalAmount: sql`COUNT(*)` })
            .from(sub)
            .where(and(...conditions))
            .leftJoin(recipes, eq(recipes.id, sub.id))
            .leftJoin(users, eq(recipes.user, users.id));
        return { recipes: await dbQuery.execute(), ...(await amountQuery.execute())[0] };
    } else {
        const dbQuery = database
            // @ts-ignore
            .select({ ...recipes, userName: users.name })
            .from(recipes)
            .limit(pageSize)
            .offset(pageSize * page)
            .leftJoin(users, eq(recipes.user, users.id));
        if (query.sortOn && query.sort) dbQuery.orderBy(sortFunction(recipes[query.sortOn.valueOf() as string]));
        const amountQuery = database.select({ totalAmount: sql`COUNT(*)` }).from(recipes);
        return { recipes: await dbQuery.execute(), ...(await amountQuery.execute())[0] };
    }
});
