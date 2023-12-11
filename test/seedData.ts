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
            description: "desc1",
            location: "loc1",
            name: "name1",
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
};
