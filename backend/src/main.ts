import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cors from "cors";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { config } from "dotenv";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

// Load environment variables from .env file
config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());
  app.useWebSocketAdapter(new IoAdapter(app));
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: "*", // Allow the frontend to connect
    methods: ["GET", "POST"], // You can adjust methods if needed
  });

  // Serve static files from the "public" directory
  app.useStaticAssets(join(__dirname, "..", "public"));

  await app.listen(3006);
}
bootstrap();
