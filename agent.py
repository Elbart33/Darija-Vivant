import os
from crewai import Agent, Task, Crew, Process
from crewai.tools import tool

# 
=====================================================================
# 1. CONFIGURATION DE LA CLÉ API (Remplace par ta 
vraie clé OpenAI)
# 
=====================================================================
os.environ["OPENAI_API_KEY"] = 
"sk-proj-TON-LOCKED-KEY-ICI"
os.environ["OPENAI_MODEL_NAME"] = "gpt-4o"  # Un 
modèle puissant est requis pour le code

# 
=====================================================================
# 2. LES OUTILS (TOOLS) DE L'AGENT
# 
=====================================================================
@tool("Lire un fichier local")
def lire_fichier(chemin_fichier: str) -> str:
    """Lit le contenu d'un fichier du repo source 
pour l'analyser."""
    try:
        with open(chemin_fichier, 'r', 
encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Erreur lors de la lecture : 
{str(e)}"

@tool("Créer ou écrire dans un fichier")
def ecrire_fichier(chemin_fichier: str, contenu: 
str) -> str:
    """Crée un nouveau fichier dans le nouveau 
repo et y écrit le code."""
    try:
        # Crée les dossiers parents si nécessaire
        
os.makedirs(os.path.dirname(chemin_fichier), 
exist_ok=True)
        with open(chemin_fichier, 'w', 
encoding='utf-8') as f:
            f.write(contenu)
        return f"Fichier {chemin_fichier} créé 
avec succès !"
    except Exception as e:
        return f"Erreur lors de l'écriture : 
{str(e)}"

# 
=====================================================================
# 3. DÉFINITION DES AGENTS
# 
=====================================================================
analyste = Agent(
    role="Architecte Logiciel Senior",
    goal="Analyser l'architecture et la logique 
d'un code source existant.",
    backstory="Tu es un expert en 
rétro-ingénierie. Tu sais lire un dossier de code, 
comprendre comment les fichiers interagissent et 
en faire un plan clair.",
    tools=[lire_fichier],
    verbose=True
)

developpeur = Agent(
    role="Développeur Fullstack Senior",
    goal="Générer un tout nouveau repository 
fonctionnel basé sur les spécifications de 
l'analyste.",
    backstory="Tu es une machine à coder. Tu écris 
un code propre, moderne, respectant les dossiers 
et l'architecture demandée.",
    tools=[ecrire_fichier],
    verbose=True
)

# 
=====================================================================
# 4. DÉFINITION DES TÂCHES (TASKS)
# 
=====================================================================
tache_analyse = Task(
    description=(
        "Examine les fichiers du projet source 
situé dans le dossier './repo_source'. "
        "Comprend l'architecture (quelles 
fonctions appellent quels fichiers) et rédige un 
plan "
        "détaillé de ce qu'il faut recréer."
    ),
    expected_output="Un rapport complet en 
Markdown décrivant l'architecture et la logique du 
code.",
    agent=analyste
)

tache_generation = Task(
    description=(
        "Prends le rapport de l'analyste. Recrée 
entièrement le projet dans un nouveau dossier "
        "nommé './nouveau_repo'. Tu dois générer 
tous les fichiers de code nécessaires (.py, .js, 
README.md, etc.) "
        "en utilisant l'outil 'ecrire_fichier'."
    ),
    expected_output="La confirmation que tous les 
nouveaux fichiers ont été générés dans 
./nouveau_repo.",
    agent=developpeur
)

# 
=====================================================================
# 5. COOPÉRATION ET LANCEMENT
# 
=====================================================================
equipe_ia = Crew(
    agents=[analyste, developpeur],
    tasks=[tache_analyse, tache_generation],
    process=Process.sequential # L'analyste 
travaille d'abord, le développeur ensuite
)

if __name__ == "__main__":
    print("🚀 Lancement de l'agent autonome...")
    resultat = equipe_ia.kickoff()
    print("\n✅ Travail terminé !")
    print(resultat)
