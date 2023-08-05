import fs from 'fs-extra';
import ImageKit from "imagekit";

import { PUBLIC_KEY, PRIVATE_KEY, URL_ENDPOINT } from "./config.js";

const imagekit = new ImageKit({
    publicKey: PUBLIC_KEY,
    privateKey: PRIVATE_KEY,
    urlEndpoint: URL_ENDPOINT,
});

export const uploadImage = async({ folder, filePath, fileName }) => {
    const file = await fs.readFile(filePath);

    try {
        const { fileId, url: photoURL, thumbnailUrl } = await imagekit.upload({
            folder,
            file,
            fileName,
        });
        
        fs.unlink(filePath);

        return { fileId, photoURL, thumbnailUrl }
    }catch(error) {
        throw('Error al subir la imagen.');
    }
}

