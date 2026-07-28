/**
 * Quick acceptance checks for chat intent + mock replies (no LLM key required).
 * Run: npx tsx src/scripts/verifyChatAcceptance.ts
 */
import { connectDB } from "../db/connect";
import { classifyIntent } from "../services/chat/intent";
import { runMockChat } from "../services/chat/mock";

const cases: Array<{ msg: string; expect: RegExp; forbid?: RegExp }> = [
  {
    msg: "are there any orders of mine",
    expect: /sign in|recent orders|No orders on this account/i,
    forbid: /matching sarees/i,
  },
  {
    msg: "kya mera kuch order hai",
    expect: /sign in|orders|order|Account/i,
    forbid: /matching sarees/i,
  },
  {
    msg: "i have just placed a order",
    expect: /sign in|orders|No orders|recent orders/i,
    forbid: /matching sarees/i,
  },
  {
    msg: "do you know my name",
    expect: /sign in|guest|name/i,
    forbid: /matching sarees/i,
  },
  {
    msg: "agar mujhe kuch samaan vapas karna hai to",
    expect: /return|7 days|tags/i,
    forbid: /matching sarees/i,
  },
  {
    msg: "tell best saree to me",
    expect: /popular|featured|catalog|₹/i,
  },
  {
    msg: "ok tell return policy",
    expect: /return/i,
    forbid: /matching sarees/i,
  },
];

async function main() {
  await connectDB();
  let failed = 0;

  for (const c of cases) {
    const intent = classifyIntent(c.msg);
    const result = await runMockChat(c.msg, {});
    const okExpect = c.expect.test(result.reply);
    const okForbid = c.forbid ? !c.forbid.test(result.reply) : true;
    const pass = okExpect && okForbid;
    console.log(
      `${pass ? "PASS" : "FAIL"} [${intent.intent}/${intent.language}] ${c.msg}`
    );
    if (!pass) {
      failed += 1;
      console.log("  reply:", result.reply.slice(0, 200));
    }
  }

  if (failed) {
    console.error(`\n${failed} case(s) failed`);
    process.exit(1);
  }
  console.log("\nAll acceptance cases passed");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
