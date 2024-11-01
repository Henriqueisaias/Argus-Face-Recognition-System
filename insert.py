from pymongo import MongoClient
import gridfs
from bson import ObjectId
import tkinter as tk
from tkinter import filedialog, messagebox


client = MongoClient("mongodb://localhost:27017/")
db = client["faces"]


fs = gridfs.GridFS(db)

def inserir_dados():
    nome = entry_nome.get()
    idade = entry_idade.get()
    crimes = entry_crimes.get().split(",")
    imagem_path = entry_imagem.get()
    condenado_em = entry_condenado.get()
    foragido = var_foragido.get() 

    if not nome or not idade or not crimes or not imagem_path or not condenado_em:
        messagebox.showerror("Erro", "Por favor, preencha todos os campos.")
        return

    try:
      
        with open(imagem_path, "rb") as imagem_file:
            imagem_id = fs.put(imagem_file, filename=imagem_path)

       
        documento = {
            "nome": nome,
            "idade": int(idade),
            "crimes": [crime.strip() for crime in crimes],
            "foto": ObjectId(imagem_id), 
            "condenado_em": condenado_em, 
            "foragido": foragido 
        }

     
        collection = db["wanted"]
        result = collection.insert_one(documento)

        messagebox.showinfo("Sucesso", f"Documento inserido com ID: {result.inserted_id}\nImagem salva com ID: {imagem_id}")

    except Exception as e:
        messagebox.showerror("Erro", str(e))

def selecionar_imagem():
    caminho_imagem = filedialog.askopenfilename(filetypes=[("Imagens", "*.jpg;*.jpeg;*.png")])
    if caminho_imagem:
        entry_imagem.delete(0, tk.END) 
        entry_imagem.insert(0, caminho_imagem) 


root = tk.Tk()
root.title("Inserir Dados no MongoDB")


tk.Label(root, text="Nome:").grid(row=0, column=0)
entry_nome = tk.Entry(root)
entry_nome.grid(row=0, column=1)

tk.Label(root, text="Idade:").grid(row=1, column=0)
entry_idade = tk.Entry(root)
entry_idade.grid(row=1, column=1)

tk.Label(root, text="Crimes (separados por vírgula):").grid(row=2, column=0)
entry_crimes = tk.Entry(root)
entry_crimes.grid(row=2, column=1)

tk.Label(root, text="Condenado Em (data):").grid(row=3, column=0)
entry_condenado = tk.Entry(root)
entry_condenado.grid(row=3, column=1)

tk.Label(root, text="Caminho da Imagem:").grid(row=4, column=0)
entry_imagem = tk.Entry(root)
entry_imagem.grid(row=4, column=1)
tk.Button(root, text="Selecionar Imagem", command=selecionar_imagem).grid(row=4, column=2)


var_foragido = tk.BooleanVar()  
tk.Checkbutton(root, text="Foragido", variable=var_foragido).grid(row=5, column=0, columnspan=2)


tk.Button(root, text="Inserir Dados", command=inserir_dados).grid(row=6, columnspan=3)


root.mainloop()
