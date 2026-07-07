import os
import sys
import re
from google import genai

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("ERR : La cle GEMINI_API_KEY n'est pas configuree.")
    sys.exit(1)

client = genai.Client(api_key=api_key)

def lire_code_local():
    contexte_code = ""
    extensions_utiles = ('.py', '.js', '.html', '.css', '.json', '.txt')
    dossier_cible = './repo_source'
    
    if not os.path.exists(dossier_cible):
        print(f"⚠️ Erreur : Le dossier '{dossier_cible}' est introuvable.")
        return ""
        
    for racine, dossiers, fichiers in os.walk(dossier_cible):
        if any(d in racine for d in ['.git', '__pycache__', 'env', 'venv', 'node_modules']):
            continue
        for fichier in fichiers:
            if fichier.endswith(extensions_utiles):
                chemin_complet = os.path.join(racine, fichier)
                try:
                    with open(chemin_complet, 'r', encoding='utf-8') as f:
                        contexte_code += f"\n\n--- DEBUT_FICHIER : {chemin_complet} ---\n"
                        contexte_code += f.read()
                        contexte_code += f"\n--- FIN_FICHIER : {chemin_complet} ---\n"
                except Exception:
                    pass
    return contexte_code

print("🤖 Super-Agent (Écriture Directe) connecté.")
print("--------------------------------------------------")
print("⏳ Analyse du dossier repo_source...")
code_du_repo = lire_code_local()

if not code_du_repo.strip():
    print("⚠️ Attention : Aucun code trouvé dans 'repo_source'.")

while True:
    try:
        consigne = input("\n📝 Que veux-tu faire ? (ou tape 'quitter')\n> ")
        if consigne.lower() in ['quitter', 'exit', 'q']:
            print("🤖 Au revoir !")
            break
        if not consigne.strip():
            continue

        print("\n⏳ L'agent transforme l'application et réécrit les fichiers...")

        prompt_instruction = f"""
        Tu es un développeur expert. Tu dois modifier DIRECTEMENT les fichiers du projet situé dans repo_source.
        
        Voici le code actuel complet :
        {code_du_repo}
        
        Mission : {consigne}
        
        Pour CHAQUE fichier que tu décides de modifier ou de réécrire pour le transformer en application d'arabe, tu DOIS retourner ton code exactement sous ce format :
        
        === ENREGISTRER: [chemin/du/fichier] ===
        [tout le code du fichier ici]
        === FIN ===
        
        Sois hyper rigoureux, ne coupe pas le code avec des '// le reste reste inchangé'. Réécris le fichier en entier avec les adaptations en arabe.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt_instruction,
        )

        # Logique pour intercepter la réponse de l'IA et modifier les vrais fichiers
        texte_reponse = response.text
        blocs = re.findall(r"=== ENREGISTRER: (.*?) ===\s*(.*?)\s*=== FIN ===", texte_reponse, re.DOTALL)
        
        if blocs:
            for chemin, contenu in blocs:
                chemin = chemin.strip()
                # Sécurité pour s'assurer qu'on écrit bien dans repo_source
                if not chemin.startswith('./repo_source') and not chemin.startswith('repo_source'):
                    chemin = os.path.join('./repo_source', chemin)
                
                # Créer les sous-dossiers si nécessaire
                os.makedirs(os.path.dirname(chemin), exist_ok=True)
                
                with open(chemin, 'w', encoding='utf-8') as f:
                    f.write(contenu)
                print(f"✅ Fichier modifié avec succès : {chemin}")
            print("\n🤖 Modification terminée ! Vérifie ton dossier repo_source.")
        else:
            print("\n🤖 L'agent a fait des suggestions mais n'a pas appliqué de changements directs. Voici son message :")
            print(texte_reponse)

    except KeyboardInterrupt:
        print("\n🤖 Session interrompue.")
        break
