import os
from supabase import create_client, Client

# Configurações do Supabase (Substitua pelas suas envs)
url = "https://rlgvbyvhlfqmuwsmutyo.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ3ZieXZobGZxbXV3c211dHlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyMDg3NywiZXhwIjoyMDg3OTk2ODc3fQ.QLeNS4spW8fTAytiEVGYl8_KAUWgNarz2aqvchFJaaE" # Use service_role para bypass RLS em scripts
supabase: Client = create_client(url, key)

def get_full_order_details(order_id: str):
    """Retorna o pedido completo com dados do cliente, endereço e itens."""
    try:
        response = supabase.table("orders").select(
            "id, total, status, created_at, "
            "profiles(full_name, phone, email), "
            "addresses(street, number, neighborhood, cep), "
            "order_items(quantity, price, products(name))"
        ).eq("id", order_id).single().execute()
        
        order = response.data
        print(f"--- Pedido GoGreen: {order['id']} ---")
        print(f"Cliente: {order['profiles']['full_name']}")
        print(f"Endereço: {order['addresses']['street']}, {order['addresses']['number']}")
        print("Itens:")
        for item in order['order_items']:
            print(f"- {item['quantity']}x {item['products']['name']} (R$ {item['price']})")
        
        return order
    except Exception as e:
        print(f"Erro ao buscar checkout: {e}")

if __name__ == "__main__":
    # Exemplo de uso: substitua pelo ID de um pedido real
    # get_full_order_details("id-do-pedido")
    pass