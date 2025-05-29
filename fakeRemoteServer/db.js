var agent = require('./data/agent.json');
var users = require('./db.json');
var civilites = require('./data/civilite.json');
var bureau = require('./data/bureau.json');
var filtreRA = require('./data/filtre-recherche-avance.json');
var service = require('./data/service.json');
var structure = require('./data/structure.json');
var parametres = require('./data/parametres.json');
var typePieceIdentite = require('./data/type-piece-identite.json');
var menus = require('./data/menu.json');
var processus = require('./data/processus.json');
var transitions = require('./data/transition.json');
var historique = require('./data/historique.json');
var typeImmeuble = require('./data/type-immeuble.json');
var typeDocument = require('./data/type-document.json');
var destinationParcelle = require('./data/destination-parcelle.json');
var typeBatiment = require('./data/type-batiment.json');
var quartiers = require('./data/quartier.json');
var attributionSource = require('./data/attribution-source');
var arrondissementZone = require('./data/arrondissement-zone.json');
var apType = require('./data/ap-type.json');
var categorieImmeuble = require('./data/categorie-immeuble.json');
var planSource = require('./data/plan-source.json');
var coefficients = require('./data/coefficient.json');
var parcelleBareme = require('./data/parcelle-bareme.json');
var gestions = require('./data/gestion.json');
var natureImpot = require('./data/nature-impot.json');
var typeTitreRecette = require('./data/type-titre-recette.json');
var elementLiquidation = require('./data/element-liquidation.json');
var packageImpot = require('./data/package-impot.json');
var elementImpot = require('./data/element-impot.json');
var immeubles = require('./data/immeuble.json');
var batiments = require('./data/batiment.json');
var amenagementParticulier = require('./data/amenagement-particulier.json');
var parcelleDelimitation = require('./data/parcelle-delimitation.json');
var exonerationCategorie = require('./data/exoneration-categorie.json');
var exonerations = require('./data/exoneration.json');
var systemImposition = require('./data/system-imposition.json');
var degresuccessoral = require('./data/degre-successoral.json');
var exerciceFiscale = require('./data/exercice-fiscale.json');
var baremeImpot = require('./data/bareme-impot.json');
var attributions = require('./data/attribution.json');
var mandats = require('./data/mandat.json');
// and so on

module.exports = function() {
    return {
        bureaux: bureau,
        agents: agent,
        users: users,
        civilites: civilites,
        bureaux: bureau,
        services: service,
        structures: structure,
        parametres: parametres,
        menu: menus,
        "processus-page": processus,
        transitions: transitions,
        historiques: historique,

        "type-piece-identite": typePieceIdentite,
        "filtre-recherche-avance": filtreRA,
        quartier: quartiers,
        gestion: gestions,
        "type-immeuble": typeImmeuble,
        "type-document": typeDocument,
        "destination-parcelle": destinationParcelle,
        "type-batiment": typeBatiment,
        "cession-source": attributionSource,
        "arrondissement-zone": arrondissementZone,
        "categorie-immeuble": categorieImmeuble,
        "plan-source": planSource,
        "ap-type": apType,
        "parcelle-bareme": parcelleBareme,
        "nature-impot": natureImpot,
        "type-titre-recette": typeTitreRecette,
        "element-liquidation": elementLiquidation,
        "package-impot": packageImpot,
        "element-impot": elementImpot,
        "amenagement-particulier": amenagementParticulier,
        "parcelle-delimitation": parcelleDelimitation,
        "exoneration-categorie": exonerationCategorie,
        "system-imposition": systemImposition,
        "degre-successoral": degresuccessoral,
        "exercice-fiscale": exerciceFiscale,
        "bareme-impot": baremeImpot,
        coefficient: coefficients,
        immeuble: immeubles,
        batiment: batiments,
        exoneration: exonerations,
        attribution: attributions,
        mandat: mandats,
        //    thirdRoute: thirdRoute,
        //     fourthRoute: fourthRoute
        // and so on
    }
}