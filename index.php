<?php
// --- Configuration ---
define('WP_API_BASE_URL', 'https://totalementactus.net/wp-json/wp/v2'); // Base de votre API WP
define('SITE_BASE_URL', 'https://gomawebradio.com'); // URL de base de VOTRE application web
define('DEFAULT_TITLE', 'GOMA WEBRADIO - La voix de Goma');
define('DEFAULT_DESCRIPTION', 'La voix de Goma - Musique, Actualités et Émissions');
// Assurez-vous que cette image par défaut existe et est accessible publiquement
define('DEFAULT_IMAGE_URL', SITE_BASE_URL . '/images/goma_webradio_og_default.jpg'); // Mettez un chemin VALIDE vers une image par défaut

// --- Initialisation des variables Meta ---
$metaTitle = DEFAULT_TITLE;
$metaDescription = DEFAULT_DESCRIPTION;
$metaImageUrl = DEFAULT_IMAGE_URL;
// Construire l'URL complète demandée
$metaUrl = SITE_BASE_URL . (isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/');
$ogType = 'website'; // Type par défaut

// --- Détection de la route d'article et récupération des données ---
$requestUri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';
$articleSlug = null;
$isArticlePage = false;
$apiDataFetched = false; // Indicateur pour savoir si on a tenté de récupérer les données

// Essayer de matcher une URL d'article (ex: /article/mon-slug ou /article/mon-slug/)
// Le pattern semble correct pour capturer les slugs alphanumériques avec tirets
if (preg_match('/^\/article\/([a-zA-Z0-9-]+)\/?$/', $requestUri, $matches)) {
    $isArticlePage = true;
    $articleSlug = $matches[1];
    $ogType = 'article'; // On sait déjà que c'est un article si le pattern match
}

// Si c'est une page d'article et qu'on a extrait un slug
if ($isArticlePage && $articleSlug) {
    // Construire l'URL de l'API pour cet article
    // _embed est crucial pour récupérer les données associées comme l'image mise en avant
    $apiUrl = WP_API_BASE_URL . "/posts?slug=" . urlencode($articleSlug) . "&_embed=true"; // Explicitement true

    // Logguer l'URL API appelée pour le débogage
    // error_log("Fetching WP API for slug '{$articleSlug}': {$apiUrl}");

    // --- Utilisation de cURL pour l'appel API ---
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15); // Augmenté légèrement le timeout à 15s
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Suivre les redirections éventuelles
    // Optionnel: Désactiver la vérification SSL (NON RECOMMANDÉ EN PRODUCTION, sauf si nécessaire pour le dev/test)
    // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    // Ajouter un User-Agent identifiable
    curl_setopt($ch, CURLOPT_USERAGENT, 'GomaWebRadio-MetaFetcher/1.1 (+' . SITE_BASE_URL . ')');

    $responseJson = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    // --- Fin de l'appel cURL ---

    $apiDataFetched = true; // On a tenté de récupérer les données

    if ($curlError) {
        // Gérer l'erreur cURL (logguer l'erreur)
        error_log("GomaWebRadio Meta: cURL Error fetching WP API for slug '{$articleSlug}'. Error: " . $curlError);
    } elseif ($httpcode >= 200 && $httpcode < 300 && $responseJson) { // Vérifier une réponse HTTP 2xx
        $posts = json_decode($responseJson);

        // Vérifier si la réponse est un tableau JSON valide et contient au moins un post
        if (is_array($posts) && !empty($posts) && isset($posts[0]->id)) {
            $article = $posts[0];

            // Mettre à jour les variables meta avec les données de l'article
            // Utiliser html_entity_decode pour convertir les entités HTML (ex: & -> &) puis htmlspecialchars pour sécuriser l'affichage
            $metaTitle = isset($article->title->rendered) ? strip_tags(html_entity_decode($article->title->rendered)) : DEFAULT_TITLE;

            // Nettoyer l'extrait: supprimer les balises HTML et décoder les entités, puis limiter la longueur si nécessaire
            if (isset($article->excerpt->rendered) && !empty(trim($article->excerpt->rendered))) {
                 $metaDescription = trim(strip_tags(html_entity_decode($article->excerpt->rendered)));
                 // Optionnel : Limiter la longueur pour être sûr
                 // $metaDescription = mb_substr($metaDescription, 0, 160) . (mb_strlen($metaDescription) > 160 ? '...' : '');
            } else {
                 $metaDescription = DEFAULT_DESCRIPTION; // Fallback si l'extrait est vide
            }


            // Essayer de récupérer l'image mise en avant via _embed
            // La structure exacte peut varier légèrement, vérifier la réponse API si ça ne marche pas
            if (isset($article->_embedded->{'wp:featuredmedia'}[0]->source_url)) {
                 $metaImageUrl = $article->_embedded->{'wp:featuredmedia'}[0]->source_url;
                 // Optionnel: Essayer d'obtenir une taille spécifique si disponible (ex: 'medium_large')
                 // if (isset($article->_embedded->{'wp:featuredmedia'}[0]->media_details->sizes->medium_large->source_url)) {
                 //    $metaImageUrl = $article->_embedded->{'wp:featuredmedia'}[0]->media_details->sizes->medium_large->source_url;
                 // }
            } else {
                $metaImageUrl = DEFAULT_IMAGE_URL; // Fallback si pas d'image trouvée
            }

            // Construire l'URL canonique de l'article en utilisant le slug de l'API (plus fiable)
            // S'assurer qu'il n'y a pas de double slash
            $articleApiSlug = isset($article->slug) ? $article->slug : $articleSlug;
            $metaUrl = rtrim(SITE_BASE_URL, '/') . '/article/' . $articleApiSlug;

            // Log succès (optionnel)
            // error_log("GomaWebRadio Meta: Successfully fetched meta for article slug '{$articleSlug}' (ID: {$article->id})");

        } else {
             // L'API a répondu mais l'article avec ce slug n'existe pas ou la réponse est vide/invalide
             error_log("GomaWebRadio Meta: WP API returned 2xx but no valid post found for slug '{$articleSlug}'. Response: " . substr($responseJson, 0, 200));
             // Les valeurs par défaut seront utilisées, ce qui est le comportement souhaité.
             // On pourrait changer le titre en "Article non trouvé" mais ce n'est pas idéal pour le SEO/partage.
             $ogType = 'website'; // Revenir au type par défaut si l'article n'est pas trouvé
        }
    } else {
        // Gérer les erreurs HTTP de l'API (ex: 404 Not Found, 500 Server Error)
        error_log("GomaWebRadio Meta: WP API Error for slug '{$articleSlug}'. HTTP Status: " . $httpcode . ". Response: " . substr($responseJson, 0, 200));
        // Les valeurs par défaut seront utilisées.
        $ogType = 'website'; // Revenir au type par défaut en cas d'erreur API
    }
     // Si l'appel échoue ou si l'article n'est pas trouvé, les valeurs par défaut définies au début restent.
}

// Si ce N'EST PAS une page d'article détectée par le preg_match, les valeurs par défaut sont utilisées automatiquement.

?>
<!DOCTYPE html>
<html lang="fr" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- ======================================================= -->
    <!-- Balises Meta Générées Dynamiquement par PHP -->
    <!-- TOUJOURS utiliser htmlspecialchars pour éviter les attaques XSS lors de l'affichage -->
    <!-- ======================================================= -->
    <title><?php echo htmlspecialchars($metaTitle); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($metaDescription); ?>" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="<?php echo htmlspecialchars($ogType); ?>" />
    <meta property="og:url" content="<?php echo htmlspecialchars($metaUrl); ?>" />
    <meta property="og:title" content="<?php echo htmlspecialchars($metaTitle); ?>" />
    <meta property="og:description" content="<?php echo htmlspecialchars($metaDescription); ?>" />
    <meta property="og:image" content="<?php echo htmlspecialchars($metaImageUrl); ?>" />
    <meta property="og:site_name" content="GOMA WEBRADIO" />
    <meta property="og:locale" content="fr_FR" />
    <?php
        // Optionnel: Ajouter la date de publication si elle a été récupérée ET que c'est un article trouvé
        if ($ogType === 'article' && $apiDataFetched && isset($article->date_gmt)) {
             // Format ISO 8601 recommandé (ex: 2023-10-27T10:30:00+00:00)
             // L'API WP renvoie souvent date et date_gmt dans ce format. Utiliser date_gmt pour être indépendant du fuseau horaire.
            echo '<meta property="article:published_time" content="' . htmlspecialchars($article->date_gmt) . '" />';
        }
        // Optionnel: Ajouter la date de modification si disponible
        // if ($ogType === 'article' && $apiDataFetched && isset($article->modified_gmt)) {
        //     echo '<meta property="article:modified_time" content="' . htmlspecialchars($article->modified_gmt) . '" />';
        // }
    ?>

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" /> <?php // summary_large_image est mieux si vous avez de belles images ?>
    <meta name="twitter:url" content="<?php echo htmlspecialchars($metaUrl); ?>" />
    <meta name="twitter:title" content="<?php echo htmlspecialchars($metaTitle); ?>" />
    <meta name="twitter:description" content="<?php echo htmlspecialchars($metaDescription); ?>" />
    <meta name="twitter:image" content="<?php echo htmlspecialchars($metaImageUrl); ?>" />
    <?php // Optionnel: Si vous avez un compte Twitter associé au site
       // echo '<meta name="twitter:site" content="@VotreCompteTwitter">';
    ?>
    <!-- ======================================================= -->
    <!-- Fin des Balises Meta Dynamiques -->
    <!-- ======================================================= -->

    <!-- Balises Meta Fixes -->
    <meta name="author" content="Oredy TECHNOLOGIES" />
    <meta name="google-adsense-account" content="ca-pub-9651519664878161">

    <!-- Google tag (gtag.js) - Reste inchangé -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZJFRKKGTTS"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-ZJFRKKGTTS');
    </script>

    <!-- IMPORTANT: Lien vers votre CSS compilé -->
    <!-- En production, ce chemin DOIT pointer vers le fichier CSS généré par 'npm run build' -->
    <!-- Exemple: <link rel="stylesheet" href="/assets/index.abcdef.css"> -->
    <!-- Vérifiez le contenu de votre dossier 'dist' ou 'build' après la compilation -->
    <link rel="stylesheet" href="/assets/index-styles.css"> <!-- Mettez le vrai nom généré ici -->

</head>
<body>
    <!-- Le conteneur pour votre application React - Reste inchangé -->
    <div id="root">
        <!-- Le contenu de l'application React sera injecté ici par le JavaScript -->
        <!-- Il est normal que ce soit vide dans le code source initial -->
    </div>

    <!-- Script externe - Reste inchangé -->
    <!-- <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script> --> <!-- Commentez ou supprimez si non utilisé -->

    <!-- IMPORTANT: Chargement de votre application React compilée -->
    <!-- En production, ce chemin DOIT pointer vers le fichier JS généré par 'npm run build' -->
    <!-- Le chemin '/src/main.tsx' est UNIQUEMENT pour le serveur de développement Vite -->
    <!-- Exemple: <script type="module" src="/assets/index.123456.js"></script> -->
    <!-- Vérifiez le contenu de votre dossier 'dist' ou 'build' après la compilation -->
   <script type="module" src="/src/main.tsx"></script> <!-- Mettez le vrai nom généré ici -->

</body>
</html>
