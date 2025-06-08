#import tkinter as tk
import multiprocessing as mult
processes=[]
def roop(e):
	print("fast")
	if __name__ == '__main__':
		mult.freeze_support()
		#print("bb")
		p=mult.Process(target=main,args=("e",))
		processes.append(p)
		p.start()

	#for p in processes:
	#	p.join()
	
	print("final")

def main(e):
	print("aa")
	import multiprocessing as mult
	import tkinter
	#from tkinter import PhotoImage
	def end():
		for a in [0,1]:
			print("aaaaaa")
			if __name__ == '__main__' or True:
				mult.freeze_support()
				print("bb")
				p=mult.Process(target=main,args=("e",))
				p.start()
		root.destroy()
	root = tkinter.Tk()
	
	def event(e):
		root.destroy()
	
	root.title("ポケットの中にはビスケットが一つ")
	root.geometry("400x400")
	canvas = tkinter.Canvas(bg = "blue", width = 400,height = 400)
	canvas.place(x = 0,y = 0)
	aa=tkinter.PhotoImage(file="img.png")
	#root.iconbitmap(default=img.ico)
	canvas.create_image(200,200,image = aa)
	#bb = tkinter.Button(root, image=aa,command = event,bg="blue")
	#bb.pack()
	root.bind("<Key>",event)
	root.protocol("WM_DELETE_WINDOW", end)
	root.mainloop()

roop("")