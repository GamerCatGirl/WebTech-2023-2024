import { likedComments, InsertLikedComments } from "~/database/auth"; 

export defaultEventHandler(async (event) => {
	const putLikedComment = async (likedComment: InsertLikedComments) => {
		return database.insert(likedComments).values(likedComment);};
		const commentToPost = await readBody(event);
		await putLikedComment(commentToPost);
		return true; 
	})
