export const seedData = {
    users: [
        {
            id: "1",
            name: "user1",
            email: "user1@email.com",
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
            thumbnail: "thumbnail2",
            user: "1",
        },
        {
            id: "2",
            description: "desc2",
            location: "loc2",
            name: "name2",
            thumbnail: "thumbnail1",
            user: "1",
        },
    ],
    images: [
        {
            id: "1",
            url: "1.jpg",
            recipe: "1",
        },
        {
            id: "2",
            url: "2.jpg",
            recipe: "1",
        },
        {
            id: "3",
            url: "3.jpg",
            recipe: "2",
        },
    ],
};
