import tkinter as tk
import random

def draw_card():
    return random.randint(1, 10)

def update_text():
    player_text.set(f"プレイヤー: {player_hand}（合計: {sum(player_hand)}）")
    dealer_text.set(f"ディーラー: {dealer_hand}（合計: {sum(dealer_hand)}）")

def hit():
    if sum(player_hand) >= 21:
        return
    player_hand.append(draw_card())
    update_text()
    if sum(player_hand) > 21:
        result_text.set("あ～..wwおにーさん欲張っちゃったねぇ～～？？")

def stand():
    root.after(1000, dealerDraw)

def dealerDraw():
    if sum(dealer_hand) < 17:
        dealer_hand.append(draw_card())
        update_text()
        root.after(1000, dealerDraw)
    else:
        update_text()
        player_total = sum(player_hand)
        dealer_total = sum(dealer_hand)
        if dealer_total > 21 or player_total > dealer_total:
            result_text.set("はっ...??い、今のなし！！ノーカン！！！")
        elif player_total < dealer_total:
            result_text.set("はーいおにーさんの負け～～～")
        else:
            result_text.set("引き分けってことはつまり私の勝ちってこと")

# 初期化

root = tk.Tk()
root.title("ブラックジャック（手抜き仕様）")

player_hand = [draw_card(), draw_card()]
dealer_hand = [draw_card()]

player_text = tk.StringVar()
dealer_text = tk.StringVar()
result_text = tk.StringVar()

update_text()


def reset():
    global player_hand, dealer_hand
    player_hand = [draw_card(), draw_card()]
    dealer_hand = [draw_card()]
    result_text.set("")
    update_text()


tk.Label(root, textvariable=player_text).pack()
tk.Label(root, textvariable=dealer_text).pack()
tk.Button(root, text="draw", command=hit).pack()
tk.Button(root, text="stand", command=stand).pack()
tk.Label(root, text="").pack()
tk.Label(root, textvariable=result_text, fg="red").pack()
tk.Button(root, text="reset", command=reset).pack()

root.mainloop()