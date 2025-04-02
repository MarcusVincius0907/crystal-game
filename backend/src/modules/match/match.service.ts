import { v4 as uuidv4 } from "uuid";
import { User } from "../../models/User";
import { Match, Round } from "../../models/Match";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Match as MatchSchema } from "../database/schemas/Match";
import { generateMatch } from "../../utils/match.utils";

@Injectable()
export class MatchService {
  private queue: User[] = [];
  private matches: Map<string, string> = new Map();

  constructor(
    @InjectModel(MatchSchema.name)
    private readonly model: Model<Match>,
  ) {}

  async findMatch(user: User) {
    const ownerId = uuidv4();
    const userWithId = { ...user, ownerId, date: new Date() };

    if (this.queue.length === 1) {
      const user = this.queue[0];
      const userDate = user?.date || new Date();
      const currentDate = new Date();
      const diff = Math.abs(userDate.getTime() - currentDate.getTime());
      const diffHours = Math.ceil(diff / (1000 * 60 * 60));

      if (diffHours > 1) {
        //we should clean the queue
        this.queue = [];
      }
    }

    this.queue.push(userWithId);

    if (this.queue.length === 2) {
      const [player1, player2] = this.queue.splice(0, 2);

      const match = generateMatch(player1, player2);
      let matchId = "";

      try {
        const matchCreated = await this.model.create(match);
        matchId = matchCreated._id;
      } catch (e) {
        console.log(e);
      }

      this.matches.set(player1.ownerId || "", matchId);
      this.matches.set(player2.ownerId || "", matchId);

      this.queue = [];
    }

    return ownerId;
  }

  /* 
    Returns match id
  */
  getMatchStatus(ownerId: string): string | null {
    return this.matches.get(ownerId) || null;
  }

  async getMatches() {
    return await this.model.find().exec();
  }

  async deleteById(id: string) {
    return await this.model.deleteOne({ _id: id }).exec();
  }

  async getMatchById(id: string, ownerId: string) {
    const match = await this.model.findById({ _id: id }).exec();

    if (!match) {
      return null;
    }

    const userPanel = match.panels.find((panel) => panel.ownerId === ownerId);

    const oponentPanel = match.panels.find(
      (panel) => panel.ownerId !== ownerId,
    );

    //check round
    if (match.round === Round.FIRST) {
      userPanel?.boards.forEach((board) => {
        //hide all boards
        board.blocks.forEach((block, i, arr) => {
          arr[i].value = "";
        });
      });

      oponentPanel?.boards.forEach((board, boardIndex) => {
        //hide 2nd and 3rd board
        if (boardIndex !== 0) {
          board.blocks.forEach((block, i, arr) => {
            arr[i].value = "";
          });
        }
      });
    } else if (match.round === Round.SECOND) {
      //hide user prizes
      userPanel?.boards.forEach((board, boardIndex) => {
        //hide 2nd and 3rd board
        if (boardIndex > 0) {
          board.blocks.forEach((block, i, arr) => {
            arr[i].value = "";
          });
        }
      });

      oponentPanel?.boards.forEach((board, boardIndex) => {
        //hide 3rd board
        if (boardIndex === 2) {
          board.blocks.forEach((block, i, arr) => {
            arr[i].value = "";
          });
        }
      });
    } else if (match.round === Round.THIRD) {
      userPanel?.boards.forEach((board, boardIndex) => {
        //hide 3rd board
        if (boardIndex === 2) {
          board.blocks.forEach((block, i, arr) => {
            arr[i].value = "";
          });
        }
      });

      //show all oponent prizes
    } else if (match.round === Round.FOURTH) {
      //show all prizes
      match.users.forEach((user) => {
        this.matches.delete(ownerId);
      });
    }

    const newMatch = {
      round: match.round,
      users: match.users.map((user) => ({
        id: user.ownerId === ownerId ? ownerId : "",
        name: user.name,
        score: user.score,
      })),
      firstHalf: match.firstHalf,
      panels: [
        {
          boards: oponentPanel?.boards,
        },
        {
          boards: userPanel?.boards,
        },
      ],
    };

    return newMatch;
  }

  async changeFirstHalf(id: string) {
    const match = await this.model.findById({ _id: id }).exec();
    if (!match) {
      return null;
    }

    if (match.firstHalf === false) {
      this.calcScore(match);
      match.round = match.round + 1;
    }

    match.firstHalf = !match.firstHalf;

    return await this.model.findByIdAndUpdate(id, match).exec();
  }

  async updateBlocksWithAction(
    id: string,
    data: { _id: string; action: string }[],
  ) {
    const match = await this.model.findById({ _id: id }).exec();
    if (!match) {
      return null;
    }

    //brutal force, we can sort based on round
    match.panels.forEach((panel) => {
      panel.boards.forEach((board) => {
        board.blocks.forEach((block, i, arr) => {
          data.forEach((d) => {
            if (block._id?.toString() === d._id) {
              arr[i].action = d.action;
            }
          });
        });
      });
    });

    return await this.model.findByIdAndUpdate(id, match).exec();
  }

  private calcScore(match: Match) {
    const score: Map<string, number> = new Map();

    const playerA = match.panels[0].ownerId;
    const playerB = match.panels[1].ownerId;

    //brutal force, we can sort based on round
    match.panels.forEach((panel) => {
      panel.boards[match.round - 1].blocks.forEach((block) => {
        if (block.action === "selected") {
          if (score.has(panel.ownerId)) {
            score.set(
              panel.ownerId,
              (score.get(panel.ownerId) || 0) + Number(block.value),
            );
          } else {
            score.set(panel.ownerId, Number(block.value));
          }
        }

        if (block.action === "rob") {
          if (panel.ownerId === playerA) {
            score.set(playerB, (score.get(playerB) || 0) + Number(block.value));
          } else {
            score.set(playerA, (score.get(playerA) || 0) + Number(block.value));
          }
        }
      });
    });

    match.users.forEach((user, i, arr) => {
      if (score.has(user.ownerId || "")) {
        arr[i].score = user.score + (score.get(user.ownerId || "") || 0);
      }
    });

    return score;
  }
}
