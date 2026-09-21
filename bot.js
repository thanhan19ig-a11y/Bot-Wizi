"use strict";

require("dotenv").config({ path: require("path").resolve(__dirname, "..", "..", ".env") });
const { Client, GatewayIntentBits } = require("discord.js");

// Keep-alive HTTP (Render free yeu cau service mo cong)
// Local dung 3001 (tranh PORT=3000 cua Wizi server trong .env), tren Render dung $PORT
const keepPort = process.env.BOT_PORT || (process.env.RENDER ? process.env.PORT : 3001) || 3001;
require("http").createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Wizi bot alive");
}).listen(keepPort);

const TOKEN = process.env.DISCORD_TOKEN || "";
const WELCOME_ID = process.env.WELCOME_CHANNEL_ID || "";

if (!TOKEN) {
  console.error("Thieu DISCORD_TOKEN (set env truoc khi chay).");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("guildMemberAdd", async (member) => {
  try {
    const ch = member.guild.channels.cache.get(WELCOME_ID)
      || member.guild.systemChannel;
    if (!ch || !ch.isTextBased()) return;
    const name = member.user.username;
    const server = member.guild.name;
    await ch.send("Ch\u00e0o m\u1eebng " + name + " \u0111\u1eben v\u1edbi " + server + "!");
    console.log("welcomed:", name);
  } catch (e) {
    console.error("welcome loi:", e.message);
  }
});

client.once("ready", () => {
  console.log("Bot online:", client.user.tag);
});

client.login(TOKEN).catch((e) => {
  console.error("Login that bai:", e.message);
  process.exit(1);
});
