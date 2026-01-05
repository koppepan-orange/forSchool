
import discord
from discord import app_commands
from discord.ext import commands
import json
import os
import typing

intents = discord.Intents.default()
intents.message_content = True

# TOKENは好きに使うがいい〜

# TOKENを.envから読み込む
TOKEN = os.getenv("BOT_TOKEN")

bot = commands.Bot(command_prefix = "kP", intents = intents)

Pingpong = [
    {
        "ping": 'hello',
        "pong": 'hello!'
    },
    {
        "ping": 'おもち',
        "pong": 'もちもち'
    },
    {
        "ping": '@everyone',
        "pong": '@everyone @everyone @everyone'
    }
]

DATA_FILE = os.path.join(os.path.dirname(__file__), "kpclear_data.json")
def load_data():
    if not os.path.exists(DATA_FILE):
        return {"users": [], "roles": []}
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


class MyBot(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.data = load_data()
        self.bot.tree.add_command(self.echo)
        self.bot.tree.add_command(self.clear)
        self.bot.tree.add_command(self.clear_nuser)
        self.bot.tree.add_command(self.clear_nrole)
        self.bot.tree.add_command(self.clear_r)

    # ~~command name:コマンド名, description:リストの横に出るコマンドの説明
    # ~~describe 何か:{何か}にはその下に記す関数の、interaction以降の引数sが入る それぞれの説明を

    # echoするやつ
    @app_commands.command(name="echo", description="Botがあなたの代わりに喋りますぜ")
    @app_commands.describe(message="Botに言わせたい内容")
    async def echo(self, interaction: discord.Interaction, message: str):
        await interaction.response.send_message(message)  # 通知はBotからだけ

    # 削除するやつ
    @app_commands.command(name="clear", description="指定数だけ最新のメッセージを削除する")
    @app_commands.describe(amount="消し去る数")
    async def clear(self, interaction: discord.Interaction, amount: int):
        if amount <= 0:
            await interaction.response.send_message("0以下は無理。")
            return

        deleted = 0
        limit_scan = max(amount * 10, 200)  # 探索の上限（過度な遡りで無限ループしないように）
        async for msg in interaction.channel.history(limit=limit_scan):
            if deleted >= amount:
                break
            if msg.id == interaction.id:
                continue
            if msg.pinned:
                continue

            # 免除判定（ユーザーID or ロールID が保存されているか）
            if str(msg.author.id) in self.data.get("users", []):
                continue
            if any(str(r.id) in self.data.get("roles", []) for r in getattr(msg.author, "roles", [])):
                continue

            try:
                await msg.delete()
                deleted += 1
            except discord.Forbidden:
                await interaction.response.send_message("権限が足りない。manage_messages と message管理権限を確認しろ。")
                return
            except discord.HTTPException:
                # 失敗しても続行
                continue

        await interaction.response.send_message(f"完了。削除したメッセージ: {deleted}")

    @app_commands.command(name="clear_nuser", description="以降 kPclear ではこのユーザーのメッセージは消さない")
    @app_commands.describe(member="免除するユーザーさん")
    async def clear_nuser(self, interaction: discord.Interaction, member: discord.Member):
        uid = str(member.id)
        if uid in self.data.get("users", []):
            await interaction.response.send_message("既に免除済み。")
            return
        self.data.setdefault("users", []).append(uid)
        save_data(self.data)
        await interaction.response.send_message(f"{member} を免除リストに追加した。")

    @app_commands.command(name="clear_nrole", description="以降 kPclear ではこのロールのユーザーのメッセージは消さない")
    @app_commands.describe(role="免除する役職 政治家的な")
    async def clear_nrole(self, interaction: discord.Interaction, role: discord.Role):
        rid = str(role.id)
        if rid in self.data.get("roles", []):
            await interaction.response.send_message("既にロールは免除済み。")
            return
        self.data.setdefault("roles", []).append(rid)
        save_data(self.data)
        await interaction.response.send_message(f"ロール {role.name} を免除リストに追加した。")

    @app_commands.command(name="clear_r", description="免除リスト（ユーザー/ロール）を全部クリアする")
    async def clear_r(self, interaction: discord.Interaction):
        self.data["users"] = []
        self.data["roles"] = []
        save_data(self.data)
        await interaction.response.send_message("免除リストを全てクリアした。今後は以前免除されていた人も削除対象になる。")

    @app_commands.command(name="mi-se-te", description="この .py ファイルをそのまま送る（読み取り権限が必要）")
    async def mi_sete(self, interaction: discord.Interaction):
        try:
            # __file__ はこのモジュールのファイルパス
            path = __file__
            if not os.path.exists(path):
                await interaction.response.send_message("ファイルが見つからない。")
                return

            # Discord ファイル送信（サイズ制限に引っかかると失敗する）
            await interaction.response.send_message(file=discord.File(path, filename=os.path.basename(path)))
        except Exception as e:
            await interaction.response.send_message(f"送信に失敗: {e}")


@bot.event
async def on_ready():
    print(f"ログインしました: {bot.user}")
    # ギルド単位で登録（開発用ならこっち、全体ならコメントアウトして次の行）
    await bot.tree.sync(guild=discord.Object(id=1406436373434466304))

import math
@bot.event
async def on_message(message):
    if message.author.bot:return;
    
    for item in Pingpong:
        if message.content == item['ping']:
            await message.channel.send(item['pong'])

    await bot.process_commands(message)  # ←コマンド動かすため必須

        

@bot.command()
async def echo(ctx, *, message: str):
    try:
        await ctx.message.delete()  # コマンドを消す
    except discord.Forbidden:
        pass
    await ctx.send(message, allowed_mentions=discord.AllowedMentions(everyone=True, roles=False, users=True))



bot.add_cog(MyBot(bot))
bot.run(TOKEN)