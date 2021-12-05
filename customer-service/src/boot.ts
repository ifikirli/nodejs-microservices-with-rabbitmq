import app from "./app";
import logger from "./logger/logger";

app.init()
    .then(async () => {
        
        logger.info("[Boot] is successful");
        await app.listen();

    }).catch((error) => {

        logger.error(`Error booting app : ${error}`);
        process.exit(1);
    });