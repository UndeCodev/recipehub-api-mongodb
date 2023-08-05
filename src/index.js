import app from "./app.js";
import { connectToDB } from "./utils/database.js";

const main = async() => {
    await connectToDB()

    app.listen(3000)
    console.log(`Server listen on port ${3000}`);
}

main()
