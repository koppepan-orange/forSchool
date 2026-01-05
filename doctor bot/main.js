// dotenv（std）を使う例（バージョン固定）
import { load } from "https://deno.land/std@0.212.0/dotenv/mod.ts";

// Discordeno を npm: スキーマで読み込む（バージョンは例）
import { createBot } from "npm:@discordeno/bot@21.0.0";

const env = await load(); // env はオブジェクトで返る
const token = env.BOT_TOKEN || Deno.env.get("BOT_TOKEN");

if (!token) {
  console.error("BOT_TOKEN が見つからないよ。 .env に BOT_TOKEN=... を入れてるか確認して。");
  Deno.exit(1);
}

const bot = createBot({
  token,
  events: {
    ready: ({ shardId, user }) => {
      console.log(`Shard ${shardId} ready, user id: ${user.id}`);
    },
  },
});

await bot.start();
