export type Route = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    title: string;
    route: string;
    explanation: string;
    example: {
        url: string | { url: Ref<string>; parameters: { [key: string]: Ref<string | number | undefined> }; extra: string };
        body?: { body: string; edit: Ref<boolean> };
        run?: { res: Ref<any | undefined>; apiKey?: string | undefined };
    };
    authRequired?: boolean;
    returnExplanation?: string;
    returnType: any;
    bodyExplanation?: string;
    bodyType?: any;
    params?: {
        name: string;
        type: string;
        values?: string;
        description: string;
        required?: boolean;
        default?: string | number;
        info?: { name: string; link: string }[];
    }[];
};

export type ApiRoute = {
    title: string;
    description?: string;
    routes: Route[];
    subRoutes?: ApiRoute[];
};

function getValues(object: string[]) {
    return "'" + object.slice(0, -1).join("', '") + "' or '" + object.slice(-1) + "'";
}

const statusRoute: Route[] = [
    {
        method: "GET",
        title: "Test server",
        route: "/api/isup",
        explanation:
            "This API route will return `true` if the server is running. This is an endpoint that is only ment to test the status of the server.",
        example: {
            url: "/api/isup",
            run: { res: ref() },
        },
        returnType: "boolean",
    },
];

const recipeRoutes: Route[] = [
    {
        method: "GET",
        title: "Find recipes",
        route: "/api/recipes",
        explanation:
            "Find recipes based on different search queries, and orderings. By default the results will be sorted based on the relavance of the search query.",
        params: [
            {
                name: "size",
                type: "int",
                values: "between 0 and a 100",
                description:
                    "The amount of results you want to get back. You will never get more than a hundred results back in one request.",
                default: 20,
            },
            {
                name: "page",
                type: "int",
                description: "What 'page' of results you want to get back, each page is the size given by `size`",
                default: 0,
            },
            {
                name: "query",
                type: "string",
                description:
                    "What words to search for in the recipe name and description. Note that matching is done using the Porter Stemming algorithm, and can therefore only match on entire words. But this algorithm will match simillar words. For example, 'connecting' and 'connected' will both match on the query 'connect'",
                info: [
                    {
                        name: "Porter Stemming algorithm",
                        link: "https://tartarus.org/martin/PorterStemmer/",
                    },
                    {
                        name: "search syntax",
                        link: "https://www.sqlite.org/fts5.html#full_text_query_syntax",
                    },
                ],
            },
            {
                name: "user",
                type: "string",
                values: "user ID",
                description: "Only return recipes from this user.",
            },
            {
                name: "difficulty",
                type: "string",
                values: getValues(Object.values(Difficulty)),
                description:
                    "Only return recipes with the given difficulty. When multiple values are given, recipes that have on of the given difficulties will be returned.",
            },
            {
                name: "mealType",
                type: "string",
                values: getValues(Object.values(Meal)),
                description:
                    "Only return recipes with the given mealtype. When multiple values are given, recipes that have on of the given mealtypes will be returned.",
            },
            {
                name: "sortOn",
                type: "string",
                values: "'time', 'score', 'createdAt'",
                description: "On what value to sort.",
            },
            {
                name: "sort",
                type: "int",
                values: "-1 or 1",
                description:
                    "How to sort this, `1` is for sorting in ascending order, `-1` is for sorting in descending order",
            },
            {
                name: "high",
                type: "string",
                description:
                    "If a query is provided all matched words in the name and description will be surrounded with the provided string. If you, for example, set `high` to `==` and `query` to `fried` you could get a recipe with the name `French ==fries==`",
            },
            {
                name: "highStart",
                type: "string",
                description:
                    "If a query is provided all matched words in the name and description will be preceded with the provided string. If you, for example, set `highStart` to `==` and `query` to `fried` you could get a recipe with the name `French ==fries`",
            },
            {
                name: "highEnd",
                type: "string",
                description:
                    "If a query is provided all matched words in the name and description will be preceded with the provided string. If you, for example, set `highEnd` to `==` and `query` to `fried` or `fries` you could get a recipe with the name `French fries==`",
            },
        ],
        example: {
            url: {
                parameters: {
                    size: ref(2),
                    page: ref(0),
                    query: ref(""),
                    user: ref(""),
                    difficulty: ref(""),
                    mealType: ref(""),
                    sortOn: ref(""),
                    sort: ref(0),
                    high: ref(""),
                    highStart: ref(""),
                    highEnd: ref(""),
                },
                url: ref("/api/recipes"),
                extra: "",
            },
            run: { res: ref() },
        },
        returnType: {
            deleteKey1:
                "==COMMENT==// The recipes that matched your query, the length of this array will be the minimum of the size of your pages or the total amount of recipes that match your query.",
            recipes: [
                {
                    id: "string",
                    name: "string",
                    longitude: "number",
                    latitude: "number",
                    description: "string",
                    deleteKey1: "==COMMENT==// The steps necessary to make the recipe.",
                    recipe: "string",
                    deleteKey5: "==COMMENT==// The ID of the user that made this recipe.",
                    user: "string",
                    thumbnail: "string",
                    deleteKey2: "==COMMENT==// Time required to make this recipe, in minutes.",
                    time: "int",
                    deleteKey3: "==COMMENT==// The type of recipe, e.g. Breakfast, Diner, ....",
                    type: "string",
                    difficulty: "string",
                    deleteKey4: "==COMMENT==// The rating of a recipe between 0 and 5.",
                    score: "int",
                    deleteKey6: "==COMMENT==// The time it was created, this has the format 'YYYY-MM-DDTHH:MM:SS.000Z'.",
                    createdAt: "string",
                    userName: "string",
                },
                "...",
            ],
            deleteKey2:
                "==COMMENT==// The total amount of recipes that matched your query. This is not the amount that is returned, but a total.",
            totalAmount: "number",
        },
    },
    {
        method: "POST",
        title: "Add recipe",
        route: "/api/recipes",
        explanation: "Adds a new recipe, in order to use this request you need to be logged in first.",
        bodyType: {
            deleteKey7:
                "==COMMENT==// Note that values like `ID`, `user` and `createdAt` should NOT be speciffied in the body, these will be added automatically.",
            name: "string",
            longitude: "number",
            latitude: "number",
            deleteKey4: "==COMMENT==// The length of your description should be at least 50 characters.",
            description: "string",
            deleteKey1:
                "==COMMENT==// The steps necessary to make the recipe, this should be at least a 100 characters long.",
            recipe: "string",
            thumbnail: "string",
            deleteKey2: "==COMMENT==// Time required to make this recipe, in minutes.",
            time: "int",
            deleteKey3: "==COMMENT==// The type of recipe, e.g. Breakfast, Diner, ....",
            type: "string",
            difficulty: "string",
            ingredients: [
                {
                    deleteKey1: "==COMMENT==// The name of the ingredient",
                    ingredient: "string",
                    amount: "int",
                    deleteKey2: "==COMMENT==// Defines the order your ingredients should be displayed in.",
                    index: "int",
                    deleteKey3: "==COMMENT==// The unit of your ingredient. E.g. kg, kilogram, gram, liter, pound, ...",
                    unit: "string",
                    deleteKey4:
                        "==COMMENT==// The category of your ingredient. This should be one of the following: " +
                        getValues(Object.values(Ingredient)),
                    category: "string",
                },
                "...",
            ],
        },
        returnType: "string",
        returnExplanation: "This is the ID of the newly created recipe.",
        example: {
            url: "/api/recipes",
            body: {
                body: JSON.stringify(
                    {
                        name: "APIRecipe",
                        longitude: 11,
                        latitude: 11,
                        description:
                            "This is the amazing description of your recipe, that we are going to add using our amazing API.",
                        recipe: "This is how you make this amazing recipe, that you can definitely actually make and is not an example because that would be stupid to actually add it.",
                        thumbnail: "/placeholder.svg",
                        time: 15,
                        type: "Breakfast",
                        difficulty: "Hard",
                        ingredients: [
                            {
                                ingredient: "Ingredient",
                                amount: 1,
                                index: 0,
                                unit: VolumeUnit.TablespoonUS,
                                category: Ingredient.Other,
                            },
                        ],
                    },
                    null,
                    4
                ),
                edit: ref(true),
            },
            run: { res: ref(), apiKey: "" },
        },
        authRequired: true,
    },
    {
        method: "GET",
        title: "Get specified recipe.",
        route: "/api/recipes/[ID]",
        explanation: "Get a recipe based on its ID.",
        example: { url: `/api/recipes/[ID]`, run: { res: ref() } },
        returnType: {
            id: "string",
            name: "string",
            longitude: "number",
            latitude: "number",
            description: "string",
            deleteKey1: "==COMMENT==// The steps necessary to make the recipe.",
            recipe: "string",
            deleteKey5: "==COMMENT==// The ID of the user that made this recipe.",
            user: { id: "string", name: "string" },
            thumbnail: "string",
            deleteKey2: "==COMMENT==// Time required to make this recipe, in minutes.",
            time: "int",
            deleteKey3: "==COMMENT==// The type of recipe, e.g. Breakfast, Diner, ....",
            type: "string",
            difficulty: "string",
            deleteKey4: "==COMMENT==// The rating of a recipe between 0 and 5.",
            score: "int",
            deleteKey6: "==COMMENT==// The time it was created, this has the format 'YYYY-MM-DDTHH:MM:SS.000Z'.",
            createdAt: "string",
            ingredients: [
                {
                    id: "string",
                    recipyId: "string",
                    deleteKey1: "==COMMENT==// The name of the ingredient",
                    ingredient: "string",
                    amount: "int",
                    deleteKey3: "==COMMENT==// The unit of your ingredient. E.g. kg, kilogram, gram, liter, pound, ...",
                    unit: "string",
                    deleteKey2: "==COMMENT==// Defines the order your ingredients should be displayed in.",
                    index: "int",
                    deleteKey4:
                        "==COMMENT==// The category of your ingredient. This should be one of the following: " +
                        getValues(Object.values(Ingredient)),
                    category: "string",
                },
                "...",
            ],
            comments: [
                {
                    id: "string",
                    deleteKey1: "==COMMENT==// The content of the comment",
                    comment: "string",
                    likes: "integer",
                    replied: "null",
                    userId: "string",
                    recipe: "string",
                    user: { id: "string", name: "string" },
                },
            ],
        },
    },
    {
        method: "POST",
        title: "Update recipe",
        explanation: "Updates the given recipe, in order to use this request you need to be logged in first.",
        route: "/api/recipes/[ID]",
        returnType: "boolean",
        bodyType: {
            deleteKey7:
                "==COMMENT==// Note that values like `ID`, `user` and `createdAt` should NOT be speciffied in the body, these will be added automatically.",
            name: "string",
            longitude: "number",
            latitude: "number",
            deleteKey4: "==COMMENT==// The length of your description should be at least 50 characters.",
            description: "string",
            deleteKey1:
                "==COMMENT==// The steps necessary to make the recipe, this should be at least a 100 characters long.",
            recipe: "string",
            thumbnail: "string",
            deleteKey2: "==COMMENT==// Time required to make this recipe, in minutes.",
            time: "int",
            deleteKey3: "==COMMENT==// The type of recipe, e.g. Breakfast, Diner, ....",
            type: "string",
            difficulty: "string",
            ingredients: [
                {
                    deleteKey5:
                        "==COMMENT==// The ID of the ingredient, if this is specified, the existing ingredient will be updated, otherwise a new ingredient will be created.",
                    id: "string?",
                    deleteKey1: "==COMMENT==// The name of the ingredient",
                    ingredient: "string",
                    amount: "int",
                    deleteKey2: "==COMMENT==// Defines the order your ingredients should be displayed in.",
                    index: "int",
                    deleteKey3: "==COMMENT==// The unit of your ingredient. E.g. kg, kilogram, gram, liter, pound, ...",
                    unit: "string",
                    deleteKey4:
                        "==COMMENT==// The category of your ingredient. This should be one of the following: " +
                        getValues(Object.values(Ingredient)),
                    category: "string",
                },
                "...",
            ],
        },
        authRequired: true,
        example: {
            url: "/api/recipes/[ID]",
            run: { res: ref(), apiKey: "" },
            body: {
                body: JSON.stringify(
                    {
                        name: "APIRecipe",
                        longitude: 11,
                        latitude: 11,
                        description:
                            "This is the amazing description of your recipe, that we are going to add using our amazing API.",
                        recipe: "This is how you make this amazing recipe, that you can definitely actually make and is not an example because that would be stupid to actually add it.",
                        thumbnail: "/placeholder.svg",
                        time: 15,
                        type: "Breakfast",
                        difficulty: "Hard",
                        ingredients: [
                            {
                                ingredient: "Ingredient",
                                amount: 1,
                                index: 0,
                                unit: VolumeUnit.TablespoonUS,
                                category: Ingredient.Other,
                            },
                        ],
                    },
                    null,
                    4
                ),
                edit: ref(true),
            },
        },
    },
    {
        method: "DELETE",
        title: "Delete recipe",
        explanation: "Deletes the given recipe, in order to use this request you need to be logged in first.",
        route: "/api/recipes/[ID]",
        returnType: "boolean",
        authRequired: true,
        example: {
            url: "/api/recipes/[ID]",
            run: { res: ref(), apiKey: "" },
        },
    },
];

const ratingRoutes: ApiRoute[] = [
    {
        title: "Rating",
        routes: [
            {
                method: "GET",
                title: "Get rating",
                explanation: "Get the rating for this recipe and a given user.",
                returnType: "integer | false",
                route: "/api/recipes/[ID]/rating",
                params: [
                    {
                        name: "user",
                        required: true,
                        type: "string",
                        description: "The user ID for the user that you want the rating for",
                    },
                ],
                example: {
                    url: {
                        url: ref("/api/recipes/[ID]/rating"),
                        parameters: { user: ref("") },
                        extra: "",
                    },
                    run: { res: ref() },
                },
            },
            {
                method: "POST",
                title: "Rate recipe",
                explanation: "",
                route: "/api/recipes/[ID]/rate",
                returnType: "int",
                returnExplanation: "The new rating of the given recipe",
                authRequired: true,
                bodyExplanation: "Your new rating, this should be a number between 0 and 5, inclusive.",
                bodyType: "int",
                example: {
                    url: "/api/recipes/[ID]/rate",
                    body: { body: "3", edit: ref(true) },
                    run: { res: ref(), apiKey: "" },
                },
            },
            {
                method: "DELETE",
                title: "Delete rating",
                explanation: "",
                route: "/api/recipes/[ID]/rate",
                returnType: "int",
                returnExplanation: "The new rating of the given recipe",
                authRequired: true,
                example: {
                    url: "/api/recipes/[ID]/rate",
                    run: { res: ref(), apiKey: "" },
                },
            },
        ],
    },
];

const userRoutes: Route[] = [
    {
        method: "GET",
        title: "Get user",
        route: "/api/users/[ID]",
        explanation: "Get the info about a specified user.",
        returnType: {
            id: "string",
            name: "string",
            image: "string",
        },
        example: { url: "/api/users/[ID]", run: { res: ref() } },
    },
    {
        method: "GET",
        title: "Get user recipes",
        route: "/api/users/[ID]/recipes",
        explanation:
            "Get all the recipes of a specified user. If you want to search through these recipes you should use the API route `/api/recipes` with the `user` query added.",
        params: [
            {
                name: "amount",
                type: "boolean",
                default: "false",
                description:
                    "If this is set, only the amount of recipes that a given user has will be returned, and no actuall recipes will be given.",
            },
        ],
        returnType: [
            {
                id: "string",
                name: "string",
                longitude: "number",
                latitude: "number",
                description: "string",
                deleteKey1: "==COMMENT==// The steps necessary to make the recipe.",
                recipe: "string",
                deleteKey5: "==COMMENT==// The ID of the user that made this recipe.",
                user: "string",
                thumbnail: "string",
                deleteKey2: "==COMMENT==// Time required to make this recipe, in minutes.",
                time: "int",
                deleteKey3: "==COMMENT==// The type of recipe, e.g. Breakfast, Diner, ....",
                type: "string",
                difficulty: "string",
                deleteKey4: "==COMMENT==// The rating of a recipe between 0 and 5.",
                score: "int",
                deleteKey6: "==COMMENT==// The time it was created, this has the format 'YYYY-MM-DDTHH:MM:SS.000Z'.",
                createdAt: "string",
                userName: "string",
            },
            "...",
        ],
        example: { url: "/api/users/[ID]/recipes", run: { res: ref() } },
    },
];

const unitRoutes: Route[] = [
    {
        method: "GET",
        title: "Convert unit",
        explanation:
            "Convert a quantity from one unit to another. The units you are converting between should be of the same type. They should for example both express mass. This api uses `https://clinicaltables.nlm.nih.gov/` internally, so if you want to know more you can go to that site. If you want to see what units are supported you can go here `https://clinicaltables.nlm.nih.gov/apidoc/ucum/v3/doc.html`",
        route: "/api/units",
        returnType: "int",
        params: [
            {
                name: "quantity",
                type: "int",
                description: "What quantity of the starting unit you want to convert",
                default: 1,
            },
            {
                name: "fromUnit",
                type: "string",
                description: "What unit you want to convert from",
                required: true,
            },
            {
                name: "toUnit",
                type: "string",
                description: "What unit you want to convert to",
                required: true,
            },
        ],
        example: {
            url: {
                url: ref("/api/units"),
                extra: "",
                parameters: { quantity: ref(), fromUnit: ref("kg"), toUnit: ref("[lb_av]") },
            },
            run: { res: ref() },
        },
    },
];

const commentRoutes: Route[] = [
    {
        method: "POST",
        title: "New comment",
        explanation: "",
        route: "/api/comments",
        returnType: "boolean",
        authRequired: true,
        example: {
            url: "/api/comments",
        },
    },
    {
        method: "GET",
        title: "Get comment",
        explanation: "",
        route: "/api/comments/[ID]",
        returnType: {},
        example: {
            url: "/api/comments/[ID]",
            run: { res: ref() },
        },
    },
    {
        method: "PUT",
        title: "Change comment",
        explanation: "",
        route: "/api/comments/[ID]",
        returnType: "void",
        example: {
            url: "/api/comments/[ID]",
        },
    },
    {
        method: "DELETE",
        title: "Delete comment",
        explanation: "",
        route: "/api/comments/[ID]",
        returnType: {},
        example: {
            url: "/api/comments/[ID]",
        },
    },
];

const likeRoutes: ApiRoute[] = [
    {
        title: "Likes",
        routes: [
            {
                method: "POST",
                title: "Add like",
                explanation: "",
                route: "/api/comments/[ID]/likes",
                returnType: "boolean",
                example: { url: "/api/comments/[ID]/likes" },
            },
        ],
    },
];

const followerRoutes: Route[] = [
    {
        method: "POST",
        title: "Add follower",
        explanation: "",
        route: "/api/followers",
        returnType: "boolean",
        example: { url: "/api/followers" },
    },
    {
        method: "DELETE",
        title: "Delete follower",
        explanation: "",
        route: "/api/followers",
        returnType: "void",
        example: { url: "/api/followers" },
    },
    {
        method: "GET",
        title: "Get follower",
        explanation: "",
        route: "/api/followers/[ID]",
        returnType: {},
        example: { url: "/api/followers/[ID]" },
    },
];

export const apiRoutes: ApiRoute[] = [
    { title: "Status", routes: statusRoute },
    { title: "Recipes", routes: recipeRoutes, subRoutes: ratingRoutes },
    { title: "Users", routes: userRoutes },
    { title: "Comments", routes: commentRoutes, subRoutes: likeRoutes },
    { title: "Followers", routes: followerRoutes },
    { title: "Units", routes: unitRoutes },
];
