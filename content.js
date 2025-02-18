console.log('Extension tiroir-caisse chargée');

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
            fetch('http://localhost:22548/open-cash-drawer')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP: ${response.status}`);
                    }
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
        // On cherche le conteneur des boutons de contrôle
        const controlButtons = document.querySelector('.control-buttons');
        if (controlButtons && !document.querySelector('.cash-drawer-button')) {
            console.log('Conteneur trouvé, injection du bouton');
            const button = createCashDrawerButton();
            if (button) {
                controlButtons.appendChild(button);
                console.log('Bouton du tiroir caisse ajouté avec succès');
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'injection du bouton:', error);
    }
}

// Variable pour suivre si l'observateur est déjà actif
let observerActive = false;

// Fonction pour observer les changements dans le DOM
function observeDOM() {
    if (observerActive) {
        console.log('Observateur déjà actif');
        return;
    }

    try {
        console.log('Démarrage de l\'observateur DOM');
        const observer = new MutationObserver((mutations) => {
            try {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        const controlButtons = document.querySelector('.control-buttons');
                        if (controlButtons && !document.querySelector('.cash-drawer-button')) {
                            console.log('Nouveau conteneur détecté');
                            injectButton();
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error('Erreur dans l\'observateur:', error);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        observerActive = true;
        console.log('Observateur DOM démarré avec succès');
    } catch (error) {
        console.error('Erreur lors du démarrage de l\'observateur:', error);
    }
}

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation de l\'extension');
    setTimeout(() => {
        observeDOM();
        injectButton();
    }, 1000);
});

// Écouter également le clic sur le bouton de paiement en espèces
document.addEventListener('click', function(e) {
    try {
        const cashPaymentButton = e.target.closest('.payment-method-display');
        if (cashPaymentButton && cashPaymentButton.querySelector('img[src*="money.png"]')) {
            console.log('Clic détecté sur le bouton de paiement en espèces');
            fetch('http://localhost:22548/open-cash-drawer')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP: ${response.status}`);
                    }
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
