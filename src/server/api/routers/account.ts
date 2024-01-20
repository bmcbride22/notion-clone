import { publicProcedure, router } from "src/lib/server/trpc";
import { getUserSubscriptionPlan } from "src/lib/stripe/subscription";
export const accountRouter = router({
  getUser: publicProcedure.query(async () => {
    const { session } = await getUserAuth();
    return session;
  }),
  getSubscription: publicProcedure.query(async () => {
    const sub = await getUserSubscriptionPlan();
    return sub;
  }),
});
