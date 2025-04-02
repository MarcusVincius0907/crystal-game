import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { User } from "../../models/User";
import { MatchService } from "./match.service";

@Controller("match")
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post("find")
  async findMatch(@Body() user: User) {
    const ownerId = await this.matchService.findMatch(user);
    return { ownerId };
  }

  @Get("status/:ownerId")
  getMatchStatus(@Param("ownerId") ownerId: string) {
    const matchId = this.matchService.getMatchStatus(ownerId);
    if (!matchId) {
      return { status: "waiting" };
    }
    return { status: "matched", matchId };
  }

  @Get("all")
  async getMatches() {
    const match = await this.matchService.getMatches();
    return { match };
  }

  @Delete(":id")
  async deleteMatch(@Param("id") id: string) {
    try {
      const resp = await this.matchService.deleteById(id);
      return { status: "success", data: resp };
    } catch (e) {
      console.log(e);
      return { status: "failed" };
    }
  }

  @Get(":id/:ownerId")
  async getMatchById(
    @Param("id") id: string,
    @Param("ownerId") ownerId: string,
  ) {
    try {
      const resp = await this.matchService.getMatchById(id, ownerId);
      return { status: "success", data: resp };
    } catch (e) {
      console.log(e);
      return { status: "failed" };
    }
  }

  @Put("change-first-half/:id")
  async changeFirstHalf(@Param("id") id: string) {
    try {
      await this.matchService.changeFirstHalf(id);
      return { status: "success" };
    } catch (e) {
      console.log(e);
      return { status: "failed" };
    }
  }
}
