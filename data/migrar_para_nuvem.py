import sqlite3
from supabase import create_client, Client
import os

# --- 1. CONFIGURAÇÃO DE CAMINHOS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'tabacaria.db')

print(f"📂 Buscando banco de dados em: {DB_PATH}")

# --- 2. CREDENCIAIS DO SUPABASE ---
# Coloque suas chaves aqui novamente
SUPABASE_URL = "https://rlgvbyvhlfqmuwsmutyo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ3ZieXZobGZxbXV3c211dHlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyMDg3NywiZXhwIjoyMDg3OTk2ODc3fQ.QLeNS4spW8fTAytiEVGYl8_KAUWgNarz2aqvchFJaaE" 

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"❌ Erro de conexão Supabase: {e}")
    exit()

# --- 3. CONECTAR AO BANCO LOCAL ---
if not os.path.exists(DB_PATH):
    print(f"❌ ERRO: '{DB_PATH}' não encontrado.")
    exit()

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

print("⏳ Iniciando migração...")

# --- 4. MIGRAÇÃO DE PRODUTOS (MODO COMPATIBILIDADE) ---
print("📦 Lendo produtos do SQLite...")

# Vamos tentar ler apenas as colunas que TEM CERTEZA que existem
try:
    cursor.execute("SELECT id, nome, qtd_estoque, custo_unitario, preco_venda FROM produtos")
    rows = cursor.fetchall()
except Exception as e:
    print(f"❌ Erro ao ler tabela: {e}")
    exit()

sucesso = 0
erros = 0

for row in rows:
    # Desempacota apenas os 5 campos básicos
    old_id, nome, estoque, custo, preco = row
    
    # Define valores padrão para o que não existe no banco antigo
    imagem_final = "/products/placeholder.png"
    categoria_final = "Geral"

    # Tenta adivinhar a imagem pelo nome (Opcional, mas ajuda)
    # Ex: se o nome for "Seda Zomo", tenta usar "/products/seda_zomo.png"
    nome_formatado = nome.lower().replace(" ", "_")
    caminho_tentativa = f"/products/{nome_formatado}.png"
    # (Aqui poderíamos verificar se o arquivo existe, mas vamos simplificar)
    
    # Dados para o Supabase
    data = {
        "old_id": old_id,
        "name": nome,
        "stock": estoque,
        "cost": custo,
        "price": preco,
        "image_url": imagem_final, # Vai subir como placeholder, depois vc edita no admin
        "category": categoria_final
    }

    try:
        response = supabase.table("products").upsert(data, on_conflict="old_id").execute()
        print(f"✅ Migrado: {nome}")
        sucesso += 1
    except Exception as e:
        print(f"❌ Falha em '{nome}': {e}")
        erros += 1

print("-" * 30)
print(f"🎉 Resumo: {sucesso} sucessos | {erros} falhas")
conn.close()