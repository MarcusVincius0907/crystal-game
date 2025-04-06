// database.module.ts
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { config } from "dotenv";
import { join } from "path";

// Load environment variables from .env file
const envFile = (process?.argv.find((el) => el.includes("env")) || "").includes(
  "dev",
)
  ? ".env.development"
  : ".env";
config({ path: join(__dirname, "../../../", envFile) });


@Module({
  imports: [MongooseModule.forRoot(`${process.env.MONGO_URL}/crystal`)],
})
export class DatabaseModule {}
