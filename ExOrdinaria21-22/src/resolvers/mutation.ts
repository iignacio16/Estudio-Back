import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { MatchCollection } from "../db/mongo.ts";
import { MatchSchema } from "../db/schema.ts";
import { Match } from "../types.ts";

const resultRegex = /^\d{1,2}-\d{1,2}$/;

const validateResult = (result: string) => {
  if (!resultRegex.test(result)) {
    throw new Error("Result format not valid");
  }
};

export const Mutation = {
  startMatch: async (
    _: unknown,
    args: { team1: string; team2: string },
  ): Promise<MatchSchema> => {
    try {
      const { team1, team2 } = args;

      const match = await MatchCollection.findOne({
        $or: [
          { team1: team1, team2: team2, Finalizado: false },
          { team1: team2, team2: team1, Finalizado: false },
        ],
      });

      if (match) throw new Error("Match already exists");

      const newMatch: Partial<Match> = {
        team1,
        team2,
        result: "0-0",
        minute: 0,
        Finalizado: false,
      };

      const _id = await MatchCollection.insertOne(newMatch as MatchSchema);

      return {
        _id,
        team1,
        team2,
        result: "0-0",
        minute: 0,
        Finalizado: false,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  setMatchData: async (
    _: unknown,
    args: { id: string; result: string; minute: number; ended: boolean },
  ): Promise<MatchSchema> => {
    try {
      const { id, result, minute, ended } = args;

      validateResult(result);
      const match = await MatchCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!match) throw new Error("Match not found");

      const resultActualizar = result.split("-");
      const pointsTeam1Actualizar = parseInt(resultActualizar[0]);
      const pointsTeam2Actualizar = parseInt(resultActualizar[1]);

      const resultActual = match.result.split("-");
      const pointsTeam1Actual = parseInt(resultActual[0]);
      const pointsTeam2Actual = parseInt(resultActual[1]);

      if (
        pointsTeam1Actual > pointsTeam1Actualizar ||
        pointsTeam2Actual > pointsTeam2Actualizar ||
        match.minute >= minute ||
        match.Finalizado
      ) throw new Error("Error 442");

      const updateMatch = await MatchCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            result,
            minute,
            Finalizado: ended,
          },
        },
      );

      if (updateMatch.matchedCount === 0) throw new Error("Match not updated");

      return (await MatchCollection.findOne({
        _id: new ObjectId(id),
      }) as MatchSchema);
    } catch (e) {
      throw new Error(e);
    }
  },
};
