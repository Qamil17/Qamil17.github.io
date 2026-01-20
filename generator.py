import os
import json

# --- KONFIGURACJA ---
# Nazwa folderu, który chcesz przeskanować (musi być w tym samym miejscu co skrypt)
FOLDER_TO_SCAN = "pliki" 
# Nazwa pliku wynikowego
OUTPUT_FILE = "dane.json"
# Podstawowy adres URL do plików na Twoim serwerze IP lub GitHubie
# Ważne: Zakończ go znakiem /
BASE_URL = "/pliki/"

def get_file_format(filename):
    ext = filename.split('.')[-1].lower()
    if ext in ['jpg', 'jpeg', 'png', 'gif', 'bmp']:
        return "img"
    elif ext == 'pdf':
        return "pdf"
    elif ext in ['mp3', 'wav', 'ogg']:
        return "audio"
    else:
        return "file" # Dla .zip, .doc, .exe itp.

def scan_directory(path, node_name):
    node = {
        "name": node_name,
        "type": "folder",
        "content": []
    }
    
    try:
        # Pobieramy listę plików i folderów, ignorując ukryte pliki Maca (zaczynające się od .)
        items = [i for i in os.listdir(path) if not i.startswith('.')]
    except Exception as e:
        print(f"Błąd dostępu do {path}: {e}")
        return node

    for item in items:
        full_path = os.path.join(path, item)
        
        if os.path.isdir(full_path):
            # Jeśli to folder, wchodzimy głębiej (rekurencja)
            node["content"].append(scan_directory(full_path, item))
        else:
            # Jeśli to plik, tworzymy wpis
            file_format = get_file_format(item)
            
            # Tworzymy względną ścieżkę do adresu URL
            # Na Macu/Linuxie używamy replace dla bezpieczeństwa, choć ścieżki są zgodne z URL
            relative_path = os.path.relpath(full_path, FOLDER_TO_SCAN).replace("\\", "/")
            
            node["content"].append({
                "name": item,
                "type": "file",
                "format": file_format,
                "url": BASE_URL + relative_path
            })
            
    return node

if __name__ == "__main__":
    if not os.path.exists(FOLDER_TO_SCAN):
        print(f"BŁĄD: Folder '{FOLDER_TO_SCAN}' nie istnieje!")
    else:
        print(f"Skanowanie folderu: {FOLDER_TO_SCAN}...")
        tree = scan_directory(FOLDER_TO_SCAN, "root")
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(tree, f, indent=4, ensure_ascii=False)
            
        print(f"SUKCES! Plik {OUTPUT_FILE} został wygenerowany.")
        print(f"Znaleziono obiekty i zapisano strukturę drzewiastą.")