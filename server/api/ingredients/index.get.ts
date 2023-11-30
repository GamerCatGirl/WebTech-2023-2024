import { ingredients, ingredientsDB } from "~/database/ingredients";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);

})
