document.addEventListener('DOMContentLoaded', () => {
    const sectionSelect = document.getElementById('sectionSelect');
    const questionsContainer = document.getElementById('questionsContainer');
    const saveSectionButton = document.getElementById('saveSection');
    const showSummaryButton = document.getElementById('showSummary');
    const summaryContainer = document.getElementById('summaryContainer');
    const summaryContent = document.getElementById('summaryContent');

    // Global object to store all answers
    let allAnswers = {};

    // Load saved answers from localStorage if available
    if (localStorage.getItem('covemQuestionnaireAnswers')) {
        allAnswers = JSON.parse(localStorage.getItem('covemQuestionnaireAnswers'));
        // Populate project info if saved
        document.getElementById('projectName').value = allAnswers.projectName || '';
        document.getElementById('clientName').value = allAnswers.clientName || '';
        document.getElementById('clientAddress').value = allAnswers.clientAddress || '';
        document.getElementById('clientTel').value = allAnswers.clientTel || '';
        document.getElementById('clientEmail').value = allAnswers.clientEmail || '';

        // Show summary button if there are any answers
        if (Object.keys(allAnswers).length > 5) { // More than just initial project info
            showSummaryButton.style.display = 'inline-block';
        }
    }


    // Define all questions categorized by section
    // Each question object has:
    //   id: Unique identifier for the input/textarea (used for name attribute)
    //   label: The question text displayed to the user
    //   type: 'text', 'textarea', 'radio', 'checkbox', 'date', 'number'
    //   options: (Optional) Array of { value: '...', text: '...' } for radio/checkbox/select
    //   notes: (Optional) Additional notes/questions from the document for context
    const allQuestions = {
        contexteGeneral: [
            { id: 'raisonProjet', label: 'Quelle est la principale raison de ce projet ? (agrandir, rénover, vendre, adapter, louer, etc.)', type: 'text' },
            { id: 'elementDeclencheur', label: 'Quel est l’élément déclencheur ? (problème structurel, besoin de plus d’espace, héritage, etc.)', type: 'text' },
            { id: 'echeancier', label: 'Avez-vous un échéancier en tête ?', type: 'text', placeholder: 'Ex: 6 mois, Printemps 2026' },
            { id: 'contraintes', label: 'Y a-t-il des contraintes familiales, financières, légales ou personnelles importantes à considérer ?', type: 'textarea' },
            { id: 'honoraireNotes', label: 'HONORAIRE (0001 00) NOTES ET QUESTION:', type: 'textarea' }
        ],
        plansDocuments: [
            { id: 'avezPlans', label: 'Avez-vous des plans ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'plansDeposesVille', label: 'Ces plans ont-ils été déposés à la Ville ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'plansAJour', label: 'Ces plans sont-ils à jour avec vos intentions actuelles ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'avisNonConformite', label: 'Avez-vous reçu un avis de non-conformité ou un refus de permis ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'plansIngenieux', label: 'Avez-vous des plans ingénieux ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] }
        ],
        fraisGeneraux: [
            { id: 'fraisGenerauxNotes', label: 'FRAIS GÉNÉRAUX (0001 50) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'stationnementTravaux', label: 'Y a-t-il un espace pour stationnement pendant les travaux ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'accesVehiculeLivraisonFacile', label: 'Les accès pour tout type de véhicule et livraison sont-ils faciles ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'accesMachinerieFacile', label: 'Accessibilité facile pour la machinerie ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'habiterPendantTravaux', label: 'Est ce que vous allez habiter dans la résidence durant les travaux ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'espaceRangementTemporaire', label: 'Avez-vous prévu un espace de rangement temporaire ?', type: 'checkbox', options: [{ value: 'goCube', text: 'Go cube' }, { value: 'miniEntrepot', text: 'Mini- entrepôt' }, { value: 'autreMaison', text: 'Autre maison' }] },
            { id: 'fraisGenerauxCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        excavation: [
            { id: 'excavationNotes', label: 'EXCAVATION (0002 30) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'protectionCheminAcces', label: 'Besoin de protection des chemin d\'accès (Pavé, asphalte, etc)', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'clotureEnleverReplacer', label: 'Clôture à enlever et replacer', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'terrainMaterielRemblai', label: 'Espace de terrain disponible pour le matériel de remblai laissé sur place', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'demolitionAutreQuePlan', label: 'Démolition à retirer autre que selon plan ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'elementsAEmonderRetirer', label: 'Éléments à émonder/retirer :', type: 'checkbox', options: [{ value: 'emondage', text: 'Émondage' }, { value: 'soucheHaie', text: 'Souche - haie' }, { value: 'haie', text: 'Haie' }, { value: 'balcon', text: 'Balcon' }, { value: 'cabanon', text: 'Cabanon' }] },
            { id: 'etendueTravauxDrainFrancais', label: 'L\'étendue des travaux pour le drain français ?', type: 'radio', options: [{ value: 'refaireComplet', text: 'Refaire complet' }, { value: 'refairePartielAgrandissement', text: 'Refaire partiel ou seulement agrandissement' }, { value: 'maisonNeuve', text: 'Maison neuve' }] },
            { id: 'typeMembraneFondations', label: 'Type de membrane pour les fondations ?', type: 'radio', options: [{ value: 'enduitBitumeElastomere', text: 'Enduit bitume / Élastomère' }, { value: 'delta', text: 'Delta' }] },
            { id: 'excavationCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        demolition: [
            { id: 'demolitionNotes', label: 'DÉMOLITION (0002 40) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'demolitionPrevues', label: 'Démolition prévue :', type: 'radio', options: [{ value: 'partiel', text: 'Partiel' }, { value: 'complet', text: 'Complet' }] },
            { id: 'demolitionCommentaire', label: 'Commentaire :', type: 'textarea' },
            { id: 'elementsConserverReinstaller', label: 'Avez vous des éléments à conserver pour réinstaller ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'materiauxEntreposerSurPlace', label: 'Des matériaux à entreposer sur place ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] }
        ],
        beton: [
            { id: 'betonNotes', label: 'BÉTON (0003 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'fondationExistanteBonEtat', label: 'Vos fondation existantes sont-elles en bonne état ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'fissuresApparentes', label: 'Est-ce que vous avez des fissures apparentes ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'finitionDalleFondation', label: 'Finition de la dalle de fondation ?', type: 'checkbox', options: [{ value: 'truelle', text: 'Truelle' }, { value: 'mecanique', text: 'Mécanique' }, { value: 'scellant', text: 'Scellant' }, { value: 'epoxy', text: 'Epoxy' }] },
            { id: 'betonCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        pieuxVisses: [
            { id: 'pieuxVissesNotes', label: 'PIEUX VISSÉS (0003 40) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'accessibiliteMachineriePieux', label: 'Accessibilité de machinerie pour pieuter ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'pieuxVissesCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        maconnerie: [
            { id: 'maconnerieNotes', label: 'MAÇONNERIE (0004 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'etatMaconnerieExistante', label: 'Quel est l’état de la maçonnerie existante (brique, pierre, mortier) ?', type: 'radio', options: [{ value: 'aRemplacer', text: 'À remplacer' }, { value: 'aReparer', text: 'À réparer' }, { value: 'enBonEtat', text: 'En bonne état' }] },
            { id: 'choixMateriauxMaconnerieArretes', label: 'Vos choix de matériaux de maçonnerie sont-ils arrêtés ?', type: 'checkbox', options: [{ value: 'brique', text: 'Brique' }, { value: 'pierre', text: 'Pierre' }, { value: 'maconnerieDecorative', text: 'Maçonnerie décorative' }] },
            { id: 'maconnerieCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        acierMetaux: [
            { id: 'acierMetauxNotes', label: 'ACIER MÉTAUX OUVRÉS (0005 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'accesLivraisonAcier', label: 'Accès pour la livraison ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'necessiteGrueInstallation', label: 'Nécessite une grue pour l’installation ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'acierMetauxCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        charpenteStructure: [
            { id: 'charpenteStructureNotes', label: 'CHARPENTE – STRUCTURE & RÉNOVATION INTÉRIEURE (0006 10) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'plancherTravauxNivellement', label: 'Des travaux sont-ils à prévoir pour un nivellement des planchers ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'plancherMouRebondit', label: 'Avez-vous remarqué des endroits où le plancher ou le plafond est "mou" ou rebondit ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'plancherDroitCreuxPentes', label: 'Le plancher est-il droit ou présente-t-il des creux ou des pentes à redresser ?', type: 'radio', options: [{ value: 'droit', text: 'Droit' }, { value: 'creuxPentes', text: 'Creux ou Pentes' }, { value: 'nonApplicable', text: 'N/A' }] },
            { id: 'signesAffaissementMouvementStructurel', label: 'Présente-t-il des signes d’affaissement ou de mouvement structurel ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'corrigerHauteurPlancher', label: 'Faut-il corriger une hauteur de plancher (matcher une extension ou un ancien plancher) ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'besoinRenforcerModifierStructure', label: 'Y a-t-il un besoin de renforcer ou modifier la structure existante ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'travauxCharpenteRenfortPasse', label: 'Y a-t-il déjà eu des travaux de charpente ou de renfort par le passé ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'modifieSansPermisIngenierie', label: 'Modifiée sans permis ou sans ingénierie ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }, { value: 'neSaitPas', text: 'Ne sait pas' }] },
            { id: 'elementsStructurelsDegarnirInspecter', label: 'Y a-t-il des éléments structurels à dégarnir ou mettre à nu pour inspection ou renforcement ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'espacesToitureEntreEtagesAccessibles', label: 'Les espaces de toiture ou entre-étages sont-ils facilement accessibles pour inspection ou renfort ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'charpenteCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        menuiserieBoiserie: [
            { id: 'menuiserieBoiserieNotes', label: 'MENUISERIE ET BOISERIE (0006 30) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'remplacePortesBoiseries', label: 'Remplace-t-on les portes et boiseries ?', type: 'radio', options: [{ value: 'maisonComplet', text: 'Maison complet' }, { value: 'maisonPartiel', text: 'Maison partiel' }] },
            { id: 'choixTypeMoulure', label: 'Avez-vous fait un choix sur le type de moulure voulue ?', type: 'checkbox', options: [{ value: 'carree', text: 'Carrée' }, { value: 'zenBiseaute', text: 'Zen biseauté' }, { value: 'colonial', text: 'Colonial' }, { value: 'retourGypse', text: 'Retour en gypse' }] },
            { id: 'menuiserieCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        ebenisterie: [
            { id: 'ebenisterieNotes', label: 'ÉBÉNISTERIE (0006 40) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'ebenisteriePriseEnChargePar', label: 'L’ébénisterie du projet est prise en charge par ?', type: 'radio', options: [{ value: 'client', text: 'Le client' }, { value: 'covem', text: 'COVEM' }] },
            { id: 'budgetArmoireCuisine', label: 'Voulez-vous un budget d’armoire cuisine ? Et le type de qualité souhaité ?', type: 'radio', options: [{ value: 'hautGamme', text: 'Haut gamme' }, { value: 'moyenneGamme', text: 'Moyenne gamme' }, { value: 'basDeGamme', text: 'Bas de gamme' }, { value: 'non', text: 'Non' }] },
            { id: 'vaniteArmoireFourniesPar', label: 'Les vanités et armoires de rangement sauront fournir par :', type: 'radio', options: [{ value: 'client', text: 'Le client' }, { value: 'covem', text: 'COVEM' }] },
            { id: 'ebenisterieCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        escalier: [
            { id: 'escalierNotes', label: 'ESCALIER (0006 45) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'travauxEscalier', label: 'Travaux à faire pour l’escalier ?', type: 'checkbox', options: [{ value: 'nouvelleEscalier', text: 'Nouvelle escalier' }, { value: 'remplacementMarche', text: 'Remplacement de marche' }, { value: 'remplacementGardeCorps', text: 'Remplacement des garde corps' }, { value: 'sablerVernir', text: 'Sabler vernir' }] },
            { id: 'choixClientEscalier', label: 'Votre choix client d’escalier (Bois, acier, etc.)', type: 'radio', options: [{ value: 'plein', text: 'Plein' }, { value: 'limonCentrale', text: 'Limon centrale' }] },
            { id: 'essenceBoisEscalier', label: 'Essence du bois ?', type: 'checkbox', options: [{ value: 'erable', text: 'Érable' }, { value: 'chene', text: 'Chêne' }, { value: 'merisier', text: 'Merisier' }, { value: 'autre', text: 'Autre' }] },
            { id: 'escalierCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        balcon: [
            { id: 'balconNotes', label: 'BALCON (0006 60) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'choixStyleBalcon', label: 'Choix du style de balcon souhaité ?', type: 'radio', options: [{ value: 'boisTraitePlancherBoisTraiteBrun', text: 'Structure en Bois traité et Plancher bois traité brun' }, { value: 'boisTraitePlancherCedreRouge', text: 'Structure en Bois traité et Plancher en cèdre rouge' }, { value: 'boisTraitePlancherIpe', text: 'Structure en Bois traité et Plancher ipé' }, { value: 'boisTraitePlancherComposite', text: 'Structure en Bois traité et Plancher en composite' }, { value: 'aluminiumPlancherComposite', text: 'Structure en aluminium et Plancher composite' }] },
            { id: 'choixStyleGardeCorps', label: 'Choix du style de garde du corps souhaité ?', type: 'radio', options: [{ value: 'boisTraiteBrun', text: 'Bois traité brun' }, { value: 'aluminium', text: 'Aluminium' }, { value: 'verre', text: 'Verre' }] },
            { id: 'balconCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        isolation: [
            { id: 'isolationNotes', label: 'ISOLATION (0007 20) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'verifierIsolationToitExistant', label: 'Avez-vous besoin de vérifier l’isolation du toit existant ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'renoclimatSubventions', label: 'Avez-vous fait affaire avec Rénoclimat pour les subventions ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'anneeConstructionResidence', label: 'La résidence a été construite en quelle année ?', type: 'radio', options: [{ value: '1950', text: '1950' }, { value: '1960', text: '1960' }, { value: '1970', text: '1970' }, { value: '1980', text: '1980' }, { value: '1990', text: '1990' }, { value: '2000', text: '2000' }, { value: '2010', text: '2010' }, { value: '2020', text: '2020' }] },
            { id: 'isolationCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        toiturePente: [
            { id: 'toiturePenteNotes', label: 'TOITURE PENTE (0007 30) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'remplacementBardeaux', label: 'Remplacement du bardeaux ?', type: 'radio', options: [{ value: 'toitureComplete', text: 'Toiture complète' }, { value: 'panToitureAnnexeSeulement', text: 'Pan de toiture seulement avec l\'annexe' }, { value: 'toiturePartielReagreage', text: 'Toiture partielle réagréage de la nouvelle à l\'existence' }] },
            { id: 'marqueCouleurBardeaux', label: 'Connaissez-vous la marque et la couleur de bardeaux ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'bardeauxRemplaceAnnee', label: 'Votre bardeaux a été remplacé il y a combien d’années ?', type: 'number', placeholder: 'Nombre d\'années' },
            { id: 'toiturePenteCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        toiturePlat: [
            { id: 'toiturePlatNotes', label: 'TOITURE PLAT (0007 31) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'remplacementMembrane', label: 'Remplacement de membrane ?', type: 'radio', options: [{ value: 'reparationSeulement', text: 'Réparation seulement' }, { value: 'toitureComplete', text: 'Toiture complète' }, { value: 'toiturePartielReagreage', text: 'Toiture partielle réagréage de la nouvelle à l\'existence' }] },
            { id: 'typeMembraneToiturePlat', label: 'Type membrane ?', type: 'radio', options: [{ value: 'asphalteGravier', text: 'Asphalte et gravier' }, { value: 'elastomere', text: 'Élastomère' }, { value: 'tpo', text: 'TPO' }, { value: 'epdm', text: 'EPDM' }] },
            { id: 'toiturePlatCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        revetementExterieur: [
            { id: 'revetementExterieurNotes', label: 'REVÊTEMENT EXTÉRIEUR (0007 40) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'remplacageRevetement', label: 'Est-ce que nous remplaçons le revêtement ?', type: 'radio', options: [{ value: 'partieNeuveSeulement', text: 'Sur la partie neuve seulement' }, { value: 'facesParticulieres', text: 'Sur des faces en particulier (Ex.: arrière complet)' }, { value: 'maisonComplete', text: 'Remplacement du revêtement de la maison complète' }] },
            { id: 'choixRevetement', label: 'Quel est votre choix de revêtement ?', type: 'checkbox', options: [{ value: 'vinyle', text: 'Vinyle' }, { value: 'canexel', text: 'Canexel' }, { value: 'fibrociment', text: 'Fibrociment' }, { value: 'maibecBois', text: 'Maibec ou bois' }, { value: 'aluminium', text: 'Aluminium' }, { value: 'acierStyleMac', text: 'Acier style (MAC)' }] },
            { id: 'sensPoseRevetement', label: 'Le sens de pose ?', type: 'radio', options: [{ value: 'horizontale', text: 'Horizontale' }, { value: 'verticale', text: 'Verticale' }] },
            { id: 'choixCouleurFasciaGouttiere', label: 'Choix client couleur de fascia gouttière suffit ?', type: 'radio', options: [{ value: 'blanc', text: 'Blanc' }, { value: 'noir', text: 'Noir' }, { value: 'brunCommercial', text: 'Brun commercial' }, { value: 'autre', text: 'Autre' }] },
            { id: 'gouttiereTravaux', label: 'Gouttière', type: 'radio', options: [{ value: 'enleverReinstaller', text: 'Enlever et réinstaller' }, { value: 'remplacementPartiel', text: 'Remplacement partiel' }, { value: 'remplacementComplet', text: 'Remplacement complet' }] },
            { id: 'revetementExterieurCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        portesFenetres: [
            { id: 'portesFenetresNotes', label: 'PORTES ET FENÊTRES (0008 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'typeOuvrant', label: 'Type d’ouvrant', type: 'checkbox', options: [{ value: 'guillotine', text: 'Guillotine' }, { value: 'battant', text: 'Battant' }, { value: 'coulissante', text: 'Coulissante' }] },
            { id: 'typeFenetres', label: 'Type de fenêtres', type: 'checkbox', options: [{ value: 'pvc', text: 'PVC' }, { value: 'hybride', text: 'Hybride' }] },
            { id: 'choixCouleurPortesFenetres', label: 'Choix client couleur', type: 'checkbox', options: [{ value: 'blanc', text: 'Blanc' }, { value: 'noir', text: 'Noir' }, { value: 'brunCommercial', text: 'Brun commercial' }, { value: 'charcoal', text: 'Charcoal' }] },
            { id: 'choixTypeVerre', label: 'Choix client type de verre', type: 'radio', options: [{ value: 'double', text: 'Double' }, { value: 'triple', text: 'Triple' }] },
            { id: 'portesFenetresCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        vitrerie: [
            { id: 'vitrerieNotes', label: 'VITRERIE (0008 80) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'vitreDoucheFournisPar', label: 'Vitre de douche fournis par :', type: 'radio', options: [{ value: 'client', text: 'Fournis par le client' }, { value: 'covem', text: 'Fournis par COVEM' }] },
            { id: 'styleVitre', label: 'Style de vitre', type: 'radio', options: [{ value: 'prefabrique', text: 'Vitre préfabriqué' }, { value: 'surMesure', text: 'Vitre sur mesure' }] },
            { id: 'vitrerieCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        systemeInterieur: [
            { id: 'systemeInterieurNotes', label: 'SYSTÈME INTÉRIEUR (0009 20) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'retourGypsePortesFenetres', label: 'Retour en gypse pour les portes, fenêtres ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'autreFinitionGypseNonStandard', label: 'Autre type de finition en gypse non standard.', type: 'textarea' },
            { id: 'systemeInterieurCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        ceramique: [
            { id: 'ceramiqueNotes', label: 'CÉRAMIQUE (0009 30) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'ceramiqueFourniePar', label: 'La Céramique est fournie :', type: 'radio', options: [{ value: 'client', text: 'Par le client' }, { value: 'covem', text: 'Par COVEM budgétaire' }] },
            { id: 'plancherChauffantCeramique', label: 'Est-ce que nous installons des planchers chauffants ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'ceramiqueCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        revetementSol: [
            { id: 'revetementSolNotes', label: 'REVÊTEMENT DE SOL (0009 60) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'revetementPlancherFournisPar', label: 'Le revêtement de plancher est fourni :', type: 'radio', options: [{ value: 'client', text: 'Par le client' }, { value: 'covem', text: 'Par COVEM budgétaire' }] },
            { id: 'typePlancherActuel', label: 'Quel est le type de votre plancher actuel ?', type: 'radio', options: [{ value: 'marqueterie', text: 'Marqueterie' }, { value: 'boisFranc', text: 'Bois franc' }, { value: 'ingenierie', text: 'Ingénierie' }, { value: 'vinyleClic', text: 'Vinyle clic' }, { value: 'flottant', text: 'Flottant' }] },
            { id: 'etatPlancherActuel', label: 'Quel est l\'état de votre plancher actuel ?', type: 'checkbox', options: [{ value: 'droit', text: 'Droit' }, { value: 'vallonne', text: 'Vallonné' }, { value: 'croche', text: 'Croche' }, { value: 'aSabler', text: 'À sabler' }] },
            { id: 'plancherChauffantRevetement', label: 'Est-ce que nous installons des planchers chauffants ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'choixClientTypePlancher', label: 'Choix client type de plancher ?', type: 'radio', options: [{ value: 'boisFranc', text: 'Bois franc' }, { value: 'ingenierie', text: 'Ingénierie' }, { value: 'vinyleClic', text: 'Vinyle clic' }, { value: 'flottant', text: 'Flottant' }] },
            { id: 'revetementSolCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        peintureEnduit: [
            { id: 'peintureEnduitNotes', label: 'PEINTURE ET ENDUIT (0009 90) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'etendueTravauxPeinture', label: 'Quelle est l’étendue des travaux ?', type: 'radio', options: [{ value: 'sectionRenoveeAgrandie', text: 'Peindre seulement la section rénovée ou agrandie' }, { value: 'toutEtageTravaux', text: 'Peindre tout l’étage des travaux' }, { value: 'touteMaison', text: 'Peindre toute la maison' }] },
            { id: 'zonesTransitionExclure', label: 'Zones de transition à exclure (ex. : corridors, plafonds, murs attenants)', type: 'textarea' },
            { id: 'choixCouleurs', label: 'Choix de vos couleurs', type: 'text', placeholder: 'Ex: Blanc cassé, Gris perle...' },
            { id: 'couleurUniqueOuDifferente', label: 'Voulez-vous une seule couleur partout ou des couleurs différentes par pièce?', type: 'radio', options: [{ value: 'unique', text: 'Une seule couleur partout' }, { value: 'differenteParPiece', text: 'Couleurs différentes par pièce' }] },
            { id: 'finiStandardOuSpecial', label: 'Préférez-vous un fini standard ou quelque chose de spécial (Plafond mat, Mur velour, boiseries semi lustré) ?', type: 'text', placeholder: 'Ex: Standard, Plafond mat, Mur velours...' },
            { id: 'etatMursPlafondsExistants', label: 'Les murs et plafonds sont-ils en bon état ou nécessitent-ils des réparations ?', type: 'text', placeholder: 'Décrire l\'état et les réparations si nécessaires' },
            { id: 'maisonPeinteRecemment', label: 'Est-ce que la maison a été peinte récemment ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'peintureCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        aspirateurCentral: [
            { id: 'aspirateurCentralNotes', label: 'ASPIRATEUR CENTRAL (0011 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'travauxBalayeuseCentrale', label: 'Balayeuse centrale', type: 'radio', options: [{ value: 'nouvelle', text: 'Nouvelle balayeuse' }, { value: 'modifierDeplacerSorties', text: 'Modifier ou déplacer les sorties seulement' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            { id: 'aspirateurCentralCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        plomberie: [
            { id: 'plomberieNotes', label: 'PLOMBERIE (0022 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'typeTravauxPlomberie', label: 'Type de travaux de plomberie', type: 'checkbox', options: [{ value: 'nouvelleComplete', text: 'Nouvelle plomberie complète' }, { value: 'sousDalle', text: 'Plomberie sous dalle' }, { value: 'roughSeulement', text: 'Plomberie rough seulement' }, { value: 'roughInstallationFinition', text: 'Plomberie rough et installation de la finition' }, { value: 'remplacementAppareilsTelQuel', text: 'Remplacement des appareils tel quel' }] },
            { id: 'complexiteTravauxPlomberie', label: 'Complexité des travaux de plomberie', type: 'radio', options: [{ value: 'facileAccessible', text: 'La plomberie est facile accessible' }, { value: 'deplacementMineur', text: 'Déplacement mineur' }, { value: 'deplacementMajeur', text: 'Déplacement majeur' }] },
            { id: 'baseDoucheChoisie', label: 'Base de douche choisie', type: 'radio', options: [{ value: 'acrylique', text: 'Acrylique' }, { value: 'doucheItalienSansSeuil', text: 'Douche Italien sans seuil' }] },
            { id: 'accessoiresFournisPar', label: 'Les accessoires sont fournis :', type: 'radio', options: [{ value: 'client', text: 'Par le client' }, { value: 'covem', text: 'Par COVEM budgétaire' }] },
            { id: 'plomberieCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        ventilation: [
            { id: 'ventilationNotes', label: 'VENTILATION (0023 00) NOTES ET QUESTION:', type: 'textarea' },
            // Hotte de cuisine
            { id: 'hotteCuisineTravaux', label: 'Hotte de cuisine :', type: 'radio', options: [{ value: 'nouveauConduitsFinition', text: 'Nouveau conduits et finition' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            // Ventilateur de salle de bain
            { id: 'ventilateurSalleBainTravaux', label: 'Ventilateur de salle de bain :', type: 'radio', options: [{ value: 'nouveauConduitsFinition', text: 'Nouveau conduits et finition' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            // Sortie de sécheuse
            { id: 'sortieSecheuseTravaux', label: 'Sortie de sécheuse :', type: 'radio', options: [{ value: 'nouveauConduitsFinition', text: 'Nouveau conduits et finition' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            // Thermopompe murale
            { id: 'thermopompeMuraleTravaux', label: 'Thermopompe murale :', type: 'radio', options: [{ value: 'nouvelleInstallation', text: 'Nouvelle installation' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            // Thermopompe centrale
            { id: 'thermopompeCentraleTravaux', label: 'Thermopompe centrale :', type: 'radio', options: [{ value: 'nouvelleInstallation', text: 'Nouvelle installation' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            // Échangeur d’air existant
            { id: 'echangeurAirExistantTravaux', label: 'Échangeur d’air existant :', type: 'radio', options: [{ value: 'nouvelleInstallation', text: 'Nouvelle installation' }, { value: 'modifierDeplacer', text: 'Modifier ou déplacer' }, { value: 'remplacer', text: 'Remplacer' }, { value: 'enleverReinstaller', text: 'Enlever et réinstaller' }] },
            { id: 'ventilationCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        chauffageGaz: [
            { id: 'chauffageGazNotes', label: 'CHAUFFAGE ET GAZ (0024 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'foyerGazEnPlace', label: 'Avez-vous un foyer au gaz déjà en place?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'foyerConformeFonctionnel', label: 'Est-ce qu’il est conforme et fonctionnel selon vos connaissances?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }, { value: 'neSaitPas', text: 'Ne sait pas' }] },
            { id: 'cuisiniereGazNaturelPropane', label: 'Est-ce que votre cuisinière ou autre appareil fonctionne au gaz naturel ou propane?', type: 'radio', options: [{ value: 'naturel', text: 'Gaz naturel' }, { value: 'propane', text: 'Propane' }, { value: 'electrique', text: 'Électrique' }] },
            { id: 'ajouterLigneGazExterieureBBQ', label: 'Souhaitez-vous ajouter une ligne de gaz extérieure pour un BBQ ou un autre appareil ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'chauffageGazCommentaire', label: 'Commentaire :', type: 'textarea' }
        ],
        electricite: [
            { id: 'electriciteNotes', label: 'ÉLECTRICITÉ (0026 00) NOTES ET QUESTION:', type: 'textarea' },
            { id: 'typePanneauElectrique', label: 'Type de panneau électrique', type: 'radio', options: [{ value: 'siemens', text: 'Siemens' }, { value: 'eatonCutlerHammer', text: 'Eaton / Cutler-Hammer' }, { value: 'squareD', text: 'Square D (Schneider Electric)' }, { value: 'federalPioneerSchneider', text: 'Federal Pioneer / Schneider' }, { value: 'homeline', text: 'Homeline (Schneider Electric)' }, { value: 'autre', text: 'Autre' }] },
            { id: 'typeTravauxElectricite', label: 'Type de travaux', type: 'checkbox', options: [{ value: 'menageAjoutBreaker', text: 'Ménage du panneaux et ajout de breaker' }, { value: 'ajoutPanneauSecondaire', text: 'Ajout de panneaux secondaire' }, { value: 'remplacementPanneauExistant', text: 'Remplacement du panneaux existant' }] },
            { id: 'capacitePanneauSecondaire', label: 'Capacité du panneau secondaire (si ajouté)', type: 'radio', options: [{ value: '30circuit', text: '30 circuit' }, { value: '60circuit', text: '60 circuit' }] },
            { id: 'capacitePanneauExistant', label: 'Capacité du panneau existant (si remplacé)', type: 'radio', options: [{ value: '100amp', text: '100 amp' }, { value: '200amp', text: '200 amp' }, { value: '300amp', text: '300 amp' }, { value: '400amp', text: '400 amp' }, { value: '600amp', text: '600 amp' }] },
            { id: 'panneauxEviterRemplacer', label: 'Panneaux à éviter ou à remplacer', type: 'checkbox', options: [{ value: 'commander', text: 'Commander' }, { value: 'zincoChallenger', text: 'Zinco et Challenger' }, { value: 'fpe', text: 'FPE (Federal Pacific Electric)' }] },
            { id: 'souhaitezGradateur', label: 'Souhaitez-vous des Gradateurs ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'souhaitezFixturesLuminairesParticuliers', label: 'Souhaitez-vous des fixtures ou des luminaires particuliers ?', type: 'radio', options: [{ value: 'oui', text: 'Oui' }, { value: 'non', text: 'Non' }] },
            { id: 'electriciteCommentaire', label: 'Commentaire :', type: 'textarea' }
        ]
    };

    // Function to render questions for a selected section
    function renderQuestions(sectionKey) {
        questionsContainer.innerHTML = ''; // Clear previous questions
        saveSectionButton.style.display = 'none'; // Hide save button initially

        const questions = allQuestions[sectionKey];

        if (questions) {
            questions.forEach(q => {
                const formGroup = document.createElement('div');
                formGroup.classList.add('form-group');

                const label = document.createElement('label');
                label.setAttribute('for', q.id);
                label.textContent = q.label;
                formGroup.appendChild(label);

                // Add "NOTES ET QUESTION:" as a special text for these fields if it's the first element in section and matches pattern
                if (q.notes) {
                    const notesSpan = document.createElement('span');
                    notesSpan.classList.add('question-notes');
                    notesSpan.textContent = q.notes;
                    label.appendChild(notesSpan);
                }

                if (q.type === 'text' || q.type === 'date' || q.type === 'number' || q.type === 'email' || q.type === 'tel') {
                    const input = document.createElement('input');
                    input.type = q.type;
                    input.id = q.id;
                    input.name = q.id;
                    if (q.placeholder) input.placeholder = q.placeholder;
                    input.value = allAnswers[sectionKey]?.[q.id] || ''; // Load saved answer
                    formGroup.appendChild(input);
                } else if (q.type === 'textarea') {
                    const textarea = document.createElement('textarea');
                    textarea.id = q.id;
                    textarea.name = q.id;
                    textarea.rows = 4;
                    textarea.value = allAnswers[sectionKey]?.[q.id] || ''; // Load saved answer
                    formGroup.appendChild(textarea);
                } else if (q.type === 'radio') {
                    const radioGroup = document.createElement('div');
                    radioGroup.classList.add('radio-group');
                    q.options.forEach(option => {
                        const radioInput = document.createElement('input');
                        radioInput.type = 'radio';
                        radioInput.id = `${q.id}-${option.value}`;
                        radioInput.name = q.id;
                        radioInput.value = option.value;
                        // Check if this option was previously selected
                        if (allAnswers[sectionKey]?.[q.id] === option.value) {
                            radioInput.checked = true;
                        }

                        const radioLabel = document.createElement('label');
                        radioLabel.setAttribute('for', `${q.id}-${option.value}`);
                        radioLabel.textContent = option.text;

                        radioGroup.appendChild(radioInput);
                        radioGroup.appendChild(radioLabel);
                    });
                    formGroup.appendChild(radioGroup);
                } else if (q.type === 'checkbox') {
                    const checkboxGroup = document.createElement('div');
                    checkboxGroup.classList.add('checkbox-group');
                    q.options.forEach(option => {
                        const checkboxInput = document.createElement('input');
                        checkboxInput.type = 'checkbox';
                        checkboxInput.id = `${q.id}-${option.value}`;
                        checkboxInput.name = q.id;
                        checkboxInput.value = option.value;
                        // Check if this option was previously selected (for checkboxes, it's an array)
                        if (Array.isArray(allAnswers[sectionKey]?.[q.id]) && allAnswers[sectionKey][q.id].includes(option.value)) {
                            checkboxInput.checked = true;
                        }

                        const checkboxLabel = document.createElement('label');
                        checkboxLabel.setAttribute('for', `${q.id}-${option.value}`);
                        checkboxLabel.textContent = option.text;

                        checkboxGroup.appendChild(checkboxInput);
                        checkboxGroup.appendChild(checkboxLabel);
                    });
                    formGroup.appendChild(checkboxGroup);
                }

                questionsContainer.appendChild(formGroup);
            });
            saveSectionButton.style.display = 'inline-block'; // Show save button when questions are rendered
            showSummaryButton.style.display = 'inline-block'; // Always show summary button once user interacts
        }
    }

    // Function to save project general info
    window.saveProjectInfo = function() {
        allAnswers.projectName = document.getElementById('projectName').value;
        allAnswers.clientName = document.getElementById('clientName').value;
        allAnswers.clientAddress = document.getElementById('clientAddress').value;
        allAnswers.clientTel = document.getElementById('clientTel').value;
        allAnswers.clientEmail = document.getElementById('clientEmail').value;
        localStorage.setItem('covemQuestionnaireAnswers', JSON.stringify(allAnswers));
        alert('Informations générales du projet enregistrées !');
        showSummaryButton.style.display = 'inline-block'; // Ensure summary button is visible
    };

    // Function to save answers for the current section
    function saveSectionAnswers() {
        const selectedSection = sectionSelect.value;
        if (!selectedSection) return;

        const currentSectionAnswers = {};
        const questionsInCurrentSection = allQuestions[selectedSection];

        questionsInCurrentSection.forEach(q => {
            if (q.type === 'text' || q.type === 'date' || q.type === 'number' || q.type === 'email' || q.type === 'tel' || q.type === 'textarea') {
                const input = document.getElementById(q.id);
                if (input) {
                    currentSectionAnswers[q.id] = input.value;
                }
            } else if (q.type === 'radio') {
                const selectedRadio = document.querySelector(`input[name="${q.id}"]:checked`);
                if (selectedRadio) {
                    currentSectionAnswers[q.id] = selectedRadio.value;
                } else {
                    currentSectionAnswers[q.id] = ''; // No option selected
                }
            } else if (q.type === 'checkbox') {
                const checkedCheckboxes = Array.from(document.querySelectorAll(`input[name="${q.id}"]:checked`))
                                                .map(cb => cb.value);
                currentSectionAnswers[q.id] = checkedCheckboxes;
            }
        });

        allAnswers[selectedSection] = currentSectionAnswers;
        localStorage.setItem('covemQuestionnaireAnswers', JSON.stringify(allAnswers));
        alert(`Réponses pour la section "${sectionSelect.options[sectionSelect.selectedIndex].text}" enregistrées !`);
        showSummaryButton.style.display = 'inline-block'; // Ensure summary button is visible
    }

    // Function to display all collected answers
    function displaySummary() {
        summaryContainer.style.display = 'block';
        let summaryText = '--- Résumé du Questionnaire COVEM ---\n\n';

        // Add general project info
        summaryText += 'INFORMATIONS GÉNÉRALES DU PROJET:\n';
        summaryText += `Nom du projet: ${allAnswers.projectName || 'Non renseigné'}\n`;
        summaryText += `Nom client: ${allAnswers.clientName || 'Non renseigné'}\n`;
        summaryText += `Adresse: ${allAnswers.clientAddress || 'Non renseigné'}\n`;
        summaryText += `Tél.: ${allAnswers.clientTel || 'Non renseigné'}\n`;
        summaryText += `Courriel: ${allAnswers.clientEmail || 'Non renseigné'}\n\n`;
        summaryText += '-------------------------------------\n\n';

        // Add answers for each section
        for (const sectionKey in allQuestions) {
            if (allAnswers[sectionKey]) {
                const sectionName = sectionSelect.querySelector(`option[value="${sectionKey}"]`).textContent;
                summaryText += `SECTION: ${sectionName.toUpperCase()}\n`;
                allQuestions[sectionKey].forEach(q => {
                    let answer = allAnswers[sectionKey][q.id];
                    if (Array.isArray(answer)) { // For checkboxes
                        answer = answer.length > 0 ? answer.join(', ') : 'Non sélectionné';
                    } else if (answer === undefined || answer === null || answer === '') {
                        answer = 'Non renseigné';
                    }
                    summaryText += `  ${q.label}: ${answer}\n`;
                });
                summaryText += '\n';
            }
        }
        summaryContent.textContent = summaryText;
    }


    // Event Listeners
    sectionSelect.addEventListener('change', (event) => {
        const selectedSection = event.target.value;
        renderQuestions(selectedSection);
    });

    saveSectionButton.addEventListener('click', saveSectionAnswers);
    showSummaryButton.addEventListener('click', displaySummary);
});
