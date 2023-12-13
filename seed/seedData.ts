import crypto from "crypto";
import { MassUnit, VolumeUnit, UnitType } from "~/composables/api";
import { Meal, Difficulty, Ingredient } from "~/composables/recipes";

const users = [
    {
        id: crypto.randomUUID(),
        name: "user1",
        email: "user1@email.com",
        emailVerified: new Date(),
        image: "",
    },
    {
        id: crypto.randomUUID(),
        name: "Silken",
        email: "user2@email.com",
        emailVerified: new Date(),
        image: "",
    },
    {
        id: crypto.randomUUID(),
        name: "Ely",
        email: "user3@email.com",
        emailVerified: new Date(),
        image: "",
    },
];
const recipes = [
    {
        id: crypto.randomUUID(),
        description:
            "This is the most amazing recipe I have ever tasted, it is a recipe that tastes amazing and this is a short description of that recipe. I think you would love this recipe. (recipe not yet made, please be pacient)",
        location: "loc1",
        name: "Amazing recipe",
        recipe: "1. ...\n2. ...\n3. ...",
        thumbnail: "/Tiramisu.png",
        user: users[0].id,
        time: 60,
        type: Meal.Diner.toString(),
        difficulty: Difficulty.Hard,
        score: 1,
    },
    {
        id: crypto.randomUUID(),
        description: "desc2",
        location: "loc2",
        name: "name2",
        thumbnail: "/Tiramisu.png",
        recipe: "1. ...\n2. ...\n3. ...",
        user: users[0].id,
        time: 70,
        type: Meal.Lunch.toString(),
        difficulty: Difficulty.Easy,
        score: 2.5,
    },
    {
        id: crypto.randomUUID(),
        description: "description to make the Tiramisu coming soon...",
        location: "Belgium",
        name: "Tiramisu",
        thumbnail: "/placeholder.svg",
        recipe: "1. ...\n2. ...\n3. ...",
        user: users[1].id,
        time: 15,
        type: Meal.Soup.toString(),
        difficulty: Difficulty.Medium,
        score: 3,
    },
];
const ingredients = [
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Mascarpone",
        amount: 500,
        unit: MassUnit.Gram,
        unitType: UnitType.Mass,
        category: Ingredient.Dairy,
        index: 0,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Eggs",
        amount: 3,
        unit: "/",
        unitType: UnitType.Custom,
        category: Ingredient.Other,
        index: 1,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Sugar",
        amount: 150,
        unit: MassUnit.Gram,
        unitType: UnitType.Mass,
        category: Ingredient.Sugar,
        index: 2,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Vanilla Sugar",
        amount: 24,
        unit: MassUnit.Gram,
        unitType: UnitType.Mass,
        category: Ingredient.Sugar,
        index: 3,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Boudoir (Cookies)",
        amount: 2,
        unit: "Packs",
        unitType: UnitType.Custom,
        category: Ingredient.Other,
        index: 4,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Coffee",
        amount: 30,
        unit: VolumeUnit.Centiliter,
        unitType: UnitType.Volume,
        category: Ingredient.Liquid,
        index: 5,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Amaretto",
        amount: 40,
        unit: VolumeUnit.MilliLiter,
        unitType: UnitType.Volume,
        category: Ingredient.Liquid,
        index: 6,
    },
    {
        id: crypto.randomUUID(),
        recipyId: recipes[2].id,
        ingredient: "Cacao",
        amount: 0,
        unit: "Some amount",
        unitType: UnitType.Custom,
        category: Ingredient.Other,
        index: 6,
    },
];
export const seedData = { users, recipes, ingredients };
