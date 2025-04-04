// database.module.ts
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { config } from "dotenv";

config();

@Module({
  imports: [MongooseModule.forRoot(`${process.env.MONGO_URL}/crystal`)],
})
export class DatabaseModule {}
