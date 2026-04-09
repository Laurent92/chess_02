# Sectional Checkerboard — Règles du jeu

Brevet Henry Luers, New York, 7 septembre 1880 (US Patent n°231,963).

## Matériel

- Un plateau **8×8** (64 cases)
- **15 pièces** de formes différentes (polyominos), chacune composée de plusieurs cases carrées
- Chaque case est colorée en **rouge ou jaune** (noir/blanc dans la version originale), imprimé directement sur la pièce — les couleurs sont **fixes**

## Objectif

Assembler les 15 pièces pour remplir exactement la grille 8×8, avec deux contraintes simultanées :

1. **Remplissage parfait** : pas de trou, pas de chevauchement — les 64 cases doivent être couvertes
2. **Motif damier valide** : les couleurs rouge/jaune doivent alterner correctement sur tout le plateau — les bords adjacents de deux pièces voisines doivent avoir des couleurs qui se correspondent

## Contrainte clé

Les pièces ont des couleurs **fixes** : on ne peut pas retourner une pièce pour tricher. Il faut trouver le bon emplacement ET la bonne orientation tout en respectant le motif damier.

## Solutions

Le puzzle admet exactement **6 013 solutions** (calculé à l'ère des micro-ordinateurs ; les estimations manuelles de l'époque allaient de 4 631 à 5 361).

## Les 15 pièces

Les pièces sont numérotées de 1 à 16 (un numéro absent), de formes variées allant de 2 à 6 cases, visibles dans `docs/pieces.webp`. Une solution complète est visible dans `docs/1.webp`.

## Interface à développer

- Afficher les 15 pièces avec leurs couleurs fixes
- Permettre le placement par **drag & drop** sur le plateau
- Valider la cohérence du motif damier en temps réel
- Afficher le **nombre de solutions restantes possibles** à chaque étape du placement
