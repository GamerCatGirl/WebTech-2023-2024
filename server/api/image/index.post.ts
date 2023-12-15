import crypto from "crypto";
import fs from "fs";

export default defineEventHandler(async (event) => {
    const body = await readMultipartFormData(event);

    const image = body[0];
    if (!image.type?.startsWith("image"))
        throw createError({ statusCode: 400, message: "Uploaded file is not an image." });

    const fileName = `/images/${crypto.randomUUID()}${image.filename || ""}`;
    fs.writeFile("public" + fileName, image.data, () => {});

    return fileName;
});
