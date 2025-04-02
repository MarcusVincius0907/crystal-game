import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MatchSchema } from "../database/schemas/Match";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";
import { GameGateway } from "../socket";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Match", schema: MatchSchema }]),
  ],
  controllers: [MatchController],
  providers: [GameGateway, MatchService],
})
export class MatchModule {}
