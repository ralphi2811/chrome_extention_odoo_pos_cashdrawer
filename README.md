# 🛍️ Odoo POS Cash Drawer Extension

Extension Chrome pour ouvrir automatiquement le tiroir caisse sur l'interface POS d'Odoo.

## 🎯 Fonctionnalités

- 🔘 Ajoute un bouton "Ouvrir Tiroir" dans l'interface POS
- 💶 Ouvre automatiquement le tiroir lors des paiements en espèces
- 🌐 Compatible avec toutes les instances Odoo (cloud et auto-hébergées)
- 🔄 Injection automatique du bouton lors du chargement de la page
- 📊 Logs détaillés dans la console pour le débogage

## 🔧 Installation

1. Clonez ce dépôt :
```bash
git clone https://github.com/votre-username/odoo_pos_cashdrawer_extension
```

2. Installez l'extension dans Chrome :
   - Ouvrez Chrome et allez dans le menu (⋮) > Plus d'outils > Extensions
   - Activez le "Mode développeur" en haut à droite
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier du projet

3. Installez le [webservice pour le tiroir caisse](https://github.com/ralphi2811/odoo_pos_cashdrawer_webservice)

## 🏗️ Architecture

```mermaid
graph TD
    A[Extension Chrome] -->|Détecte| B[Page POS Odoo]
    B -->|Injecte| C[Bouton Ouvrir Tiroir]
    B -->|Surveille| D[Bouton Paiement Espèces]
    C -->|Clic| E[Requête HTTP]
    D -->|Clic| E
    E -->|localhost:22548| F[Webservice Tiroir]
    F -->|Commande| G[Tiroir Caisse]
```

## 🔄 Flux de fonctionnement

```mermaid
sequenceDiagram
    participant POS as Page POS Odoo
    participant Ext as Extension Chrome
    participant WS as Webservice
    participant Drawer as Tiroir Caisse
    
    POS->>Ext: Chargement de la page
    Ext->>POS: Injection du bouton
    
    alt Clic sur "Ouvrir Tiroir"
        POS->>Ext: Événement clic
        Ext->>WS: GET /open-cash-drawer
        WS->>Drawer: Commande d'ouverture
    else Paiement en espèces
        POS->>Ext: Détection paiement
        Ext->>WS: GET /open-cash-drawer
        WS->>Drawer: Commande d'ouverture
    end
```

## 📋 Prérequis

- Google Chrome
- [Webservice Tiroir Caisse](https://github.com/ralphi2811/odoo_pos_cashdrawer_webservice) installé et fonctionnel
- Instance Odoo avec module Point de Vente (POS)

## 🔍 Débogage

1. Ouvrez la console développeur (F12)
2. Observez les logs :
   - "Extension tiroir-caisse chargée"
   - "Page POS détectée"
   - "Injection réussie"
   - "Tiroir ouvert avec succès"

## 📝 Changelog

### Version 1.0.0 (18/02/2024)
- ✨ Première version stable
- 🎯 Injection automatique du bouton
- 🔄 Détection des paiements en espèces
- 🌐 Support de toutes les instances Odoo
- 📊 Logs de débogage

### Prochaines évolutions prévues
- [ ] Interface de configuration pour l'URL du webservice
- [ ] Support de plusieurs tiroirs caisses
- [ ] Statistiques d'utilisation
- [ ] Mode hors-ligne
- [ ] Support des raccourcis clavier

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🔗 Liens utiles

- [Webservice Tiroir Caisse](https://github.com/ralphi2811/odoo_pos_cashdrawer_webservice)
- [Documentation Odoo POS](https://www.odoo.com/documentation/17.0/applications/sales/point_of_sale.html)
