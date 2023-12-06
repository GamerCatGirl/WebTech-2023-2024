import { Meal, Difficulty } from "~/composables/recipes";

export const seedData = {
    users: [
        {
            id: "1",
            name: "user1",
            email: "user1@email.com",
            emailVerified: new Date(),
            image: "",
        },
        {
            id: "2",
            name: "Silken",
            email: "user2@email.com",
            emailVerified: new Date(),
            image: "",
        },
        {
            id: "30",
            name: "Ely",
            email: "user3@email.com",
            emailVerified: new Date(),
            image: "",
        },
    ],
    recipes: [
        {
            id: "1",
            description:
                "This is the most amazing recipe I have ever tasted, it is a recipe that tastes amazing and this is a short description of that recipe. I think you would love this recipe. (recipe not yet made, please be pacient)",
            location: "loc1",
            name: "Amazing recipe",
            thumbnail: "/Tiramisu.png",
            user: "1",
            time: 60,
            type: Meal.Diner.toString(),
            difficulty: Difficulty.Hard,
            score: 1,
        },
        {
            id: "2",
            description: "desc2",
            location: "loc2",
            name: "name2",
            thumbnail: "/Tiramisu.png",
            user: "1",
            time: 70,
            type: Meal.Lunch.toString(),
            difficulty: Difficulty.Easy,
            score: 2.5,
        },
        {
            id: "3",
            description: "description to make the Tiramisu coming soon...",
            location: "Belgium",
            name: "Tiramisu",
            thumbnail: "/placeholder.svg",
            user: "2",
            time: 15,
            type: Meal.Soup.toString(),
            difficulty: Difficulty.Medium,
            score: 3,
        },
    ],
    ingredients: [
        {
            id: "0",
            recipyId: "3",
            ingredient: "Mascarpone",
            amount: "500",
            type: "gramms",
            category: "cheese",
        },
        {
            id: "1",
            recipyId: "3",
            ingredient: "Eggs",
            amount: "3",
            type: "Pieces",
            category: "Dairy",
        },
        {
            id: "2",
            recipyId: "3",
            ingredient: "Sugar",
            amount: "150",
            type: "gramms",
            category: "Dry Goods",
        },
        {
            id: "3",
            recipyId: "3",
            ingredient: "Vanilla Sugar",
            amount: "24",
            type: "gramms",
            category: "Dry Goods",
        },
        {
            id: "4",
            recipyId: "3",
            ingredient: "Boudoir (Cookies)",
            amount: "2",
            type: "Packs",
            category: "Dry Goods",
        },
        {
            id: "5",
            recipyId: "3",
            ingredient: "Coffee",
            amount: "3",
            type: "Cups",
            category: "Liquids",
        },
        {
            id: "6",
            recipyId: "3",
            ingredient: "Amaretto",
            amount: "40",
            type: "ml",
            category: "Liquids",
        },
        {
            id: "7",
            recipyId: "3",
            ingredient: "Cacao",
            amount: "/",
            type: "/",
            category: "Dry Goods",
        },
    ],
};
