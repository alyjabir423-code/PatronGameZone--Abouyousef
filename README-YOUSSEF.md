# Abou Youssef — sept prises, adaptation de la référence CP1

Version préparée le 6 novembre 2026. Aucun site de production, aucune règle Firebase et aucune prise réelle n’ont été modifiés pendant la préparation.

## Résultat

Les pages Patron et Gérant utilisent exclusivement `gamzone-youssef-7e8ae` et `gz_YOUSSEF`. Les commandes utilisent `pilotage_v1/commands/1` à `7`. Les sept identifiants physiques sont vérifiés avant le démarrage du relais. Une configuration d’une autre salle est refusée avant toute connexion.

Activation confirmée, Pause/Reprendre, ajout/retrait de temps, extinction réservée au Patron, annulation Patron et gestion des recettes/historiques/Gym/bonus proviennent des interfaces CP1 actuelles. Le Gérant ne dispose pas d’un OFF direct. Les tarifs existants et les noms affichés de Youssef ne sont pas remplacés par ceux de CP1. Les postes manquants 1 à 7 sont ajoutés après lecture conditionnelle; un doublon physique bloque l’initialisation. La journée de gestion reste à 08:00, comme la référence GitHub CP1 inspectée, et les crédits sauvegardés expirent à 08:00.

Le relais confirme DP1 et DP9, conserve les minuteurs natifs pendant une perte de connexion, ne rallume pas automatiquement une prise après une coupure, et refuse deux relais simultanés grâce à une présence conditionnelle Firebase. Ne pas lancer Termux et l’APK simultanément. L’APK Youssef existante n’est pas recompilée dans cette modification; le moteur livré est destiné à Termux.

## Installation et vérifications encore nécessaires

1. Connecter le projet Firebase Youssef pour récupérer et sauvegarder les règles en vigueur. Le fichier `database.rules.DRAFT.json` est un candidat de travail, pas une instruction de publication. Il a été vérifié comme JSON mais pas compilé/testé par l’émulateur Firebase. Il ne doit pas être déployé tel quel sans confrontation avec les règles réellement en vigueur et tests d’autorisations.
2. Installer le moteur Termux sur le téléphone Youssef seulement, après arrêt du relais Youssef et de son superviseur. `installer-mise-a-jour.sh` vérifie les sept IDs, sauvegarde les fichiers existants localement avec permissions privées et refuse une installation par-dessus un moteur lancé. Les fichiers privés `devices.json`, `prive_firebase.json` et `etat_firebase.json` ne sont pas livrés, affichés ni téléversés.
3. Exécuter `python relais_firebase.py verifier` sur le Wi-Fi des prises. Cette commande ne modifie aucun relais électrique. Vérifier les sept confirmations.
4. Sur des postes libres, tester activation, pause, reprise, +temps, −temps, sauvegarde/restauration et fin native de deux minutes, puis écran verrouillé et coupure Internet après confirmation du minuteur natif. Vérifier les comptes Patron et Gérant et l’absence d’accès d’un compte CP1.
5. Fusionner les deux demandes GitHub et publier les règles uniquement après accord du propriétaire et validation coordonnée. L’ordre de bascule doit éviter de laisser une page nouvelle face à un ancien relais incompatible.

## Tests exécutés hors production

45 tests Python et 18 tests JavaScript réussis, avec prises et Firebase simulés. Les tests couvrent la septième prise, le rejet d’identités étrangères, les commandes idempotentes, les droits Gérant, les minuteurs natifs, la sauvegarde du crédit, les fins de séance sans doublon et la conservation des recettes. Les scripts intégrés aux deux pages sont analysés pour vérifier leur syntaxe et leurs dépendances locales.

Ces tests ne prouvent pas encore le fonctionnement des sept prises réelles ni la compatibilité des règles de production. Aucune activation réelle n’a été faite.

## Son et notifications

La sélection d’une voix masculine du téléphone est conservée. Les fichiers MP3 référencés par CP1 n’étaient pas présents dans les dépôts inspectés; les interfaces Youssef n’en dépendent plus et ne sélectionnent pas automatiquement une autre voix. Les notifications locales nécessitent l’autorisation du navigateur et GameZone ouvert. Les notifications site fermé nécessitent un serveur Web Push/FCM séparé, non présent dans cette référence et non configuré par cette modification.

## Accès GitHub

Le connecteur a refusé les écritures (403). L’enregistrement des branches de test est effectué par le navigateur autorisé. Aucune fusion et aucun déploiement en production ne font partie de cette étape.

## Points de retour

Patron Youssef avant modification : `3233a3cb7c9fc42f66ef27b42b808a8eda45f8de`.
Gérant Youssef avant modification : `b54e65dcb2bd183ca60ee3448329eed8992e4a39`.
Les dépôts CP1 ne sont pas modifiés.
