# GameZone Abou Youssef 2.0 — sept prises

Préparation du 6 novembre 2026, distincte de CP1. Les sites de production et les règles Firebase ne sont pas encore basculés. Les prises réelles n’ont pas été commandées pendant la préparation.

## Livré et vérifié
- Application Android dédiée `ci.gamezone.relais.youssef.v20`, version 2.0, compilation GitHub réussie le 6 novembre 2026. Elle fonctionne sans Termux ni Cloudflare.
- Source Android : branche `youssef-relais-android-v20` du dépôt privé de relais, commit `b628a3b8ed21ad98acba8b8c337a2130e9e1bc08`.
- Build vérifié : `42174638016`, artifact `GameZone-Relais-Youssef-2.0` (22,2 Mo).
- Correspondance stricte des sept prises Youssef, refus des identités CP1/Imran.
- Activation, pause, reprise, ajout/retrait, sauvegarde/restauration et crédit valable jusqu’à 08:00. Les minuteurs natifs continuent lors d’une perte de réseau; une perte de réseau seule ne prouve pas une coupure de courant.
- Annulation Gérant avec motif, extinction confirmée, recette conservée. Annulation Patron et ses corrections comptables restent dans l’interface Patron. OFF TV reste réservé au Patron.
- Annonces masculines MP3 intégrées dans les deux interfaces. Notifications locales après accord du navigateur, avec GameZone ouvert. Aucun serveur push site fermé n’est installé.
- 47 tests Python du moteur et du pont Android; 18 tests des interfaces; 13 scénarios d’annulation/retrait/reprise; contrôles audio et notifications; 28 contrôles des règles compilées dans l’émulateur Firebase. Les refus permission_denied des scénarios négatifs sont attendus.

## Installation coordonnée
1. Arrêter le relais Youssef v09 et tout relais Termux Youssef; conserver l’ancienne application et les fichiers privés. Ne pas utiliser CP1 pour cet import.
2. Installer le nouvel APK Youssef. Son identifiant Android est distinct: l’import est nécessaire. Ne pas désinstaller l’ancienne application avant les vérifications.
3. Importer le ZIP privé Youssef déjà utilisé (`prive.json` et `echeances.json` à la racine). Le pack des sept prises a été validé avec le nouveau moteur. Aucun secret n’est intégré à cet ensemble de sources.
4. La publication des nouvelles règles doit être autorisée: elles donnent au relais Youssef un accès à la salle nécessaire à la synchronisation et aux temps sauvegardés. Elles retirent au Gérant la lecture globale et limitent les recettes consultables au jour courant. Le candidat est `firebase/database.rules.DRAFT.json`; la sauvegarde réelle est `database.rules.BEFORE-20261106.json`.
5. Publier les interfaces Patron/Gérant préparées dans leurs branches `test/youssef-7-prises-2026-11-06`, puis démarrer le nouvel APK et vérifier sept prises confirmées. Les tarifs et les noms Youssef existants sont conservés.
6. Essais réels sur un poste libre: 2 minutes, pause/reprise, +temps, −temps, annulation avec chaque rôle, sauvegarde puis autre client et restauration, extinction à zéro, téléphone verrouillé, perte et retour du réseau. Vérifier recettes et droits Gérant du lendemain. Ces essais physiques restent à effectuer.

## Reproduire les contrôles
`python3 -m unittest discover -s tests -q`
`node --test tests/interfaces.test.mjs`
`node tests/feedback.cjs`
`node tests/cancel.cjs gerant`
`node tests/cancel.cjs patron`
Pour les règles: Java 21, Node 24, `npm install`, puis `npm run test:rules`. Le projet demo-youssef est émulé; ces tests n’appellent pas Firebase de production.

Le navigateur de travail a bloqué la récupération automatique de l’artifact Android. Le fichier compilé reste accessible dans la page GitHub du build. Cet ensemble contient les sources et non le binaire APK.
