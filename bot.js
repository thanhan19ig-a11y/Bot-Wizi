"use strict";

require("dotenv").config({ path: require("path").resolve(__dirname, "..", "..", ".env") });
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

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
    const RULES_ID = process.env.RULES_CHANNEL_ID || "1551593351323713547";
    const j = member.joinedAt || new Date();
    const p2 = (n) => String(n).padStart(2, "0");
    const joinDate = p2(j.getDate()) + "/" + p2(j.getMonth() + 1) + "/" + j.getFullYear();
    const emb = new EmbedBuilder()
      .setColor(0x5eead4)
      .setTitle("Ch\u00e0o m\u1eebng " + name + " \u0111\u1ebfn v\u1EDBi " + server + "!")
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription("🎈 Th\u00e0nh vi\u00ean th\u1ee9 " + member.guild.memberCount + "\n\n📅 Ng\u00e0y v\u00e0o: " + joinDate + "\n\n💬 L\u1EDDi nh\u1EAFn: Ch\u00fac b\u1EA1n c\u00f3 tr\u1EA3i nghi\u1EC7m tuy\u1EC7t v\u1EDBi t\u1EA1i server!")
      .setFooter({ text: "Wizi Bot" });
    const content = member.toString() + "\n**Ch\u00e0o m\u1eebng " + name + " \u0111\u1ebfn v\u1EDBi " + server + "!**\n\u0110\u1ECDc lu\u1EADt t\u1EA1i <#" + RULES_ID + "> nh\u00e9!";
    await ch.send({ content: content, embeds: [emb] });
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
