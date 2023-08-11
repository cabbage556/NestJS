import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import * as config from "config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const serverConfig = config.get("server");
  const port = serverConfig.port;

  await app.listen(port, () => {
    logger.log(`application listening on port ${port}`);
  });
}
bootstrap();
