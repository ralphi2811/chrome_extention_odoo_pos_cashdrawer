// Fonction pour vérifier si nous sommes sur une page POS
function isPOSPage() {
    const url = window.location.href;
    return url.includes('/pos/ui') && url.includes('config_id=');
}

// Fonction principale d'initialisation
function initPOSCashDrawer() {
    console.log('Extension tiroir-caisse chargée');

    // Ne continuer que si nous sommes sur une page POS
    if (!isPOSPage()) {
        console.log('Page non-POS détectée, extension inactive');
        return;
    }

    console.log('Page POS détectée, activation de l\'extension');

    // Fonction pour créer le bouton du tiroir caisse
    function createCashDrawerButton() {
        try {
            const button = document.createElement('button');
            button.className = 'control-button btn btn-light rounded-0 fw-bolder cash-drawer-button';
            button.innerHTML = '<i class="fa fa-cash-register me-1" role="img" aria-label="Ouvrir tiroir" title="Ouvrir tiroir"></i> Ouvrir Tiroir';
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clic sur le bouton tiroir');
                fetch('http://localhost:22548/open-cash-drawer', {
                    mode: 'no-cors',
                    method: 'GET',
                    headers: {
                        'Accept': '*/*'
                    }
                })
                    .then(() => {
                        // En mode no-cors, on ne peut pas accéder à response.ok
                        console.log('Tiroir ouvert avec succès');
                    })
                    .catch(error => {
                        console.error('Erreur:', error);
                    });
            });
            
            return button;
        } catch (error) {
            console.error('Erreur lors de la création du bouton:', error);
            return null;
        }
    }

    // Fonction pour injecter le bouton
    function injectButton() {
        try {
            console.log('Tentative d\'injection du bouton');
            // On cherche tous les conteneurs possibles
            const possibleContainers = [
                '.control-buttons',
                '.pos .control-buttons',
                '.pos-content .control-buttons',
                '.pos .buttons .control-buttons'
            ];

            console.log('Recherche des conteneurs possibles...');
            for (const selector of possibleContainers) {
                const container = document.querySelector(selector);
                if (container) {
                    console.log(`Conteneur trouvé avec le sélecteur: ${selector}`);
                    if (!document.querySelector('.cash-drawer-button')) {
                        const button = createCashDrawerButton();
                        if (button) {
                            container.appendChild(button);
                            console.log('Bouton du tiroir caisse ajouté avec succès');
                            return true;
                        }
                    } else {
                        console.log('Le bouton existe déjà');
                        return false;
                    }
                }
            }
            console.log('Aucun conteneur trouvé pour le moment');
            return false;
        } catch (error) {
            console.error('Erreur lors de l\'injection du bouton:', error);
            return false;
        }
    }

    // Variable pour compter les tentatives
    let attempts = 0;
    const MAX_ATTEMPTS = 30; // 30 secondes maximum

    // Fonction pour vérifier périodiquement et injecter le bouton
    function checkAndInject() {
        attempts++;
        if (attempts === 1) {
            console.log('Démarrage des tentatives d\'injection...');
        }
        
        if (injectButton()) {
            console.log('Injection réussie, arrêt des vérifications périodiques');
            return;
        }
        
        if (attempts >= MAX_ATTEMPTS) {
            console.log('Nombre maximum de tentatives atteint, arrêt des vérifications');
            return;
        }
        
        setTimeout(checkAndInject, 1000);
    }

    // Démarrer la vérification périodique
    checkAndInject();

    // Observer les changements dans le DOM pour les nouvelles opportunités d'injection
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length && !document.querySelector('.cash-drawer-button')) {
                injectButton();
                break;
            }
        }
    });

    // Démarrer l'observation du DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    console.log('Observateur DOM démarré');

    // Écouter également le clic sur le bouton de paiement en espèces
    document.addEventListener('click', function(e) {
        try {
            const cashPaymentButton = e.target.closest('.payment-method-display');
            if (cashPaymentButton && cashPaymentButton.querySelector('img[src*="money.png"]')) {
                console.log('Clic détecté sur le bouton de paiement en espèces');
                fetch('http://localhost:22548/open-cash-drawer', {
                    mode: 'no-cors',
                    method: 'GET',
                    headers: {
                        'Accept': '*/*'
                    }
                })
                    .then(() => {
                        // En mode no-cors, on ne peut pas accéder à response.ok
                        console.log('Tiroir ouvert avec succès (paiement en espèces)');
                    })
                    .catch(error => {
                        console.error('Erreur:', error);
                    });
            }
        } catch (error) {
            console.error('Erreur lors du traitement du clic:', error);
        }
    });
}

// Démarrer l'extension
initPOSCashDrawer();
