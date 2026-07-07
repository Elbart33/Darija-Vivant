import os
import sys
import re
import subprocess
from google import genai

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("ERR : La cle GEMINI_API_KEY n'est pas configuree.")
    sys.exit(1)

client = genai.Client(api_key=api_key)

DOSSIER_CIBLE = '.'
DOSSIERS_EXCLUS = ['.git', '__pycache__', 'venv', 'env', 'node_modules', '.next', 'repo_source']
EXTENSIONS_UTILES = ('.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json')

def lire_code_local():
    contexte_code = ""
    for racine, dossiers, fichiers in os.walk(DOSSIER_CIBLE):
        dossiers[:] = [d for d in dossiers if d not in DOSSIERS_EXCLUS]
        for fichier in fichiers:
            if fichier.endswith(EXTENSIONS_UTILES):
                chemin_complet = os.path.join(racine, fichier)
                try:
                    with open(chemin_complet, 'r', encoding='utf-8') as f:
                        contexte_code += "\n\n--- DEBUT_FICHIER : " + chemin_complet + " ---\n"
                        contexte_code += f.read()
                        contexte_code += "\n--- FIN_FICHIER : " + chemin_complet + " ---\n"
                except Exception:
                    pass
    return contexte_code

def git_push(message):
    try:
        subprocess.run(["git", "add", "."], check=True)
        result = subprocess.run(["git", "commit", "-m", message], capture_output=True, text=True)
        if result.returncode != 0:
            print("Rien a committer ou erreur commit :")
            print(result.stdout + result.stderr)
            return
        subprocess.run(["git", "push"], check=True)
        print("Pousse sur GitHub avec succes. Cloudflare va redeployer automatiquement.")
    except subprocess.CalledProcessError as e:
        print("Erreur pendant le git push :")
        print(e)

print("Agent connecte sur le vrai repo Next.js.")
print("--------------------------------------------------")
print("Analyse du projet...")
code_du_repo = lire_code_local()

if not code_du_repo.strip():
    print("Attention : Aucun code trouve.")

while True:
    try:
        consigne = input("\nQue veux-tu faire ? (ou tape 'quitter')\n> ")
        if consigne.lower() in ['quitter', 'exit', 'q']:
            print("Au revoir !")
            break
        if not consigne.strip():
            continue

        print("\nL'agent modifie les fichiers...")

        prompt_instruction = "Tu es un developpeur expert. Tu dois modifier DIRECTEMENT les fichiers du projet Next.js ci-dessous.\n\nVoici le code actuel complet :\n" + code_du_repo + "\n\nMission : " + consigne + "\n\nPour CHAQUE fichier que tu modifies ou crees, retourne ton code EXACTEMENT sous ce format :\n\n=== ENREGISTRER: [chemin/du/fichier] ===\n[tout le code du fichier ici]\n=== FIN ===\n\nSois rigoureux : reecris le fichier ENTIER modifie, ne coupe jamais avec des commentaires du type reste inchange."

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt_instruction,
        )

        texte_reponse = response.text
        blocs = re.findall(r"=== ENREGISTRER: (.*?) ===\s*(.*?)\s*=== FIN ===", texte_reponse, re.DOTALL)

        if blocs:
            for chemin, contenu in blocs:
                chemin = chemin.strip().lstrip('./')
                os.makedirs(os.path.dirname(chemin) or '.', exist_ok=True)
                with open(chemin, 'w', encoding='utf-8') as f:
                    f.write(contenu)
                print("Fichier modifie : " + chemin)

            code_du_repo = lire_code_local()

            reponse_push = input("\nEnvoyer ces changements sur GitHub maintenant ? (o/n)\n> ")
            if reponse_push.strip().lower() in ['o', 'oui', 'y', 'yes']:
                git_push("Modification via agent Gemini: " + consigne)
            else:
                print("Ok, rien envoye. Fais 'git push' toi-meme plus tard si besoin.")

            print("\nModification terminee !")
        else:
            print("\nL'agent a repondu sans modification directe :")
            print(texte_reponse)

    except KeyboardInterrupt:
        print("\nSession interrompue.")
        break
