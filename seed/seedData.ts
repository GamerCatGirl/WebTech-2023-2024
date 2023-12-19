import crypto from "crypto";
import { MassUnit, VolumeUnit } from "~/composables/unit";
import { Meal, Difficulty, Ingredient } from "~/composables/recipes";

const randomPasswordSize = 20;
function createRandomPassword(size: number): string {
    return crypto.randomBytes(size).toString("ascii");
}

const users = [
    {
        id: crypto.randomUUID(),
        name: "user1",
        email: "user1@email.com",
        emailVerified: new Date(),
        image: "",
        country: "fr",
    },
    {
        id: crypto.randomUUID(),
        name: "Silken",
        email: "user2@email.com",
        emailVerified: new Date(),
        image: "",
        country: "be",
    },
    {
        id: crypto.randomUUID(),
        name: "Ely",
        email: "user3@email.com",
        emailVerified: new Date(),
        image: "",
        country: "be",
    },
];

const usersWithCredentials = [
    {
        //TODO: make special admin rights in app
        id: 1,
        name: "admin",
        password: createRandomPassword(randomPasswordSize), //generates random password
        email: "randomUser2@email.com",
        emailVerified: new Date(),
        image: "",
        country: "nl",
    },
    {
        id: crypto.randomUUID(),
        name: "randomUser2",
        password: createRandomPassword(randomPasswordSize),
        email: "randomUser2@email.com",
        emailVerified: new Date(),
        image: "",
        country: "nl",
    },
    {
        id: crypto.randomUUID(),
        name: "elyTesting",
        password: createRandomPassword(randomPasswordSize),
        email: "randomUser3@email.com",
        emailVerified: new Date(),
        image: "",
        country: "be",
    },
];

const recipes = [
    {
        id: crypto.randomUUID(),
        description:
            "This is the most amazing recipe I have ever tasted, it is a recipe that tastes amazing and this is a short description of that recipe. I think you would love this recipe. (recipe not yet made, please be pacient)",
        longitude: 51,
        latitude: 4,
        name: "Frieten met Stoofvlees (BE) - Fries with stewed meat (ENG)",
        recipe: "1. ...\n2. ...\n3. ...",
        thumbnail: "/FrietenMetStoofvlees.webp",
        user: users[0].id,
        time: 60,
        type: Meal.Diner.toString(),
        difficulty: Difficulty.Hard,
        score: 1,
        ratings: 1,
    },
    {
        id: crypto.randomUUID(),
        description: "desc2",
        longitude: 50,
        latitude: 50,
        name: "name2",
        thumbnail: "/Tiramisu.png",
        recipe: "1. ...\n2. ...\n3. ...",
        user: users[0].id,
        time: 70,
        type: Meal.Lunch.toString(),
        difficulty: Difficulty.Easy,
        score: 2.5,
        ratings: 2,
    },
    {
        id: crypto.randomUUID(),
        description: "description to make the Tiramisu coming soon...",
        longitude: 43,
        latitude: 12,
        name: "Tiramisu",
        thumbnail: "/Tiramisu.png",
        recipe: "1. ...\n2. ...\n3. ...",
        user: users[1].id,
        time: 30,
        type: Meal.Dessert.toString(),
        difficulty: Difficulty.Medium,
        score: 0,
    },
];

const ratings = [
    {
        recipe: recipes[0].id,
        user: users[0].id,
        rating: 1,
    },
    {
        recipe: recipes[1].id,
        user: users[0].id,
        rating: 1,
    },
    {
        recipe: recipes[1].id,
        user: users[1].id,
        rating: 5,
    },
];

const ingredients = [
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Mascarpone",
        amount: 500,
        unit: MassUnit.Gram,
        category: Ingredient.Dairy,
        index: 0,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Eggs",
        amount: 3,
        unit: "/",
        category: Ingredient.Other,
        index: 1,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Sugar",
        amount: 150,
        unit: MassUnit.Gram,
        category: Ingredient.Sugar,
        index: 2,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Vanilla Sugar",
        amount: 24,
        unit: MassUnit.Gram,
        category: Ingredient.Sugar,
        index: 3,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Boudoir (Cookies)",
        amount: 2,
        unit: "Packs",
        category: Ingredient.Other,
        index: 4,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Coffee",
        amount: 30,
        unit: VolumeUnit.Centiliter,
        category: Ingredient.Liquid,
        index: 5,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Amaretto",
        amount: 40,
        unit: VolumeUnit.MilliLiter,
        category: Ingredient.Liquid,
        index: 6,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Cacao",
        amount: 0,
        unit: "Some amount",
        category: Ingredient.Other,
        index: 6,
    },
];

export const seedData = { users, recipes, ratings, ingredients, usersWithCredentials };
