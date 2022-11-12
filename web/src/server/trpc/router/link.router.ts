import { router, publicProcedure } from "../trpc";
import { Link } from "@prisma/client";
import { z } from "zod";
import { create, getOne } from "../../services/link.service";

export const linkRouter = router({
  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ input, ctx }): Promise<Link | undefined> => {
      const { session } = ctx;

      const { id, title, content, type } = input;

      if (!session?.user) return undefined;

      const { user } = session;

      return await create({
        linkId: id,
        title: title,
        content: content,
        type: type,
        visibility: "public",
        userId: user.id,
      });
    }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }): Promise<Link | null> => {
      return await getOne(input.id);
    }),
});
