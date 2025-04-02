import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { DatabaseModule } from "./modules/database/database.module";
import { MatchModule } from "./modules/match/match.module";
@Module({
  imports: [MatchModule, DatabaseModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
