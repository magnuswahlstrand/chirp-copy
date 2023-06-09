import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { User } from "@clerk/nextjs/api";
import { clerkClient } from "@clerk/nextjs/server";

const filterUserForClient = (user: User) => {
  return { id: user.id, username: user.username, profileImageUrl: user.profileImageUrl };
};

export const exampleRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // TODO: Why do I get this error?
    // ESLint: Unsafe call of an `any` typed value.(@typescript-eslint/no-unsafe-call)
    // ESLint: Unsafe member access .findMany on an `any` value.(@typescript-eslint/no-unsafe-member-access)
    const posts = await ctx.prisma.post.findMany({ take: 100 });
    
    const users = (await clerkClient.users.getUserList({
      limit: 100
    })).map(filterUserForClient);

    return posts.map((post) => ({
        author: users.find((user) => user.id === post.authorId)
      }
    ));
  })
});
