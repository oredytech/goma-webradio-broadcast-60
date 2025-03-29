<?php
// --- Configuration ---
define('WP_API_BASE_URL', 'https://totalementactus.net/wp-json/wp/v2'); // Base de votre API WP
define('SITE_BASE_URL', 'https://gomawebradio.com'); // URL de base de VOTRE application web
define('DEFAULT_TITLE', 'GOMA WEBRADIO - La voix de Goma');
define('DEFAULT_DESCRIPTION', 'La voix de Goma - Musique, Actualités et Émissions');
define('DEFAULT_IMAGE_URL', SITE_BASE_URL . '/images/votre-image-par-defaut.jpg'); // Mettez un chemin vers une image par défaut

// --- Initialisation des variables Meta ---
$metaTitle = DEFAULT_TITLE;
$metaDescription = DEFAULT_DESCRIPTION;
$metaImageUrl = DEFAULT_IMAGE_URL;
$metaUrl = SITE_BASE_URL . $_SERVER['REQUEST_URI']; // URL actuelle
$ogType = 'website'; // Type par défaut

// --- Détection de la route d'article et récupération des données ---
$requestUri = $_SERVER['REQUEST_URI'];
$articleSlug = null;
$isArticlePage = false;

// Essayer de matcher une URL d'article (ex: /article/mon-slug ou /article/mon-slug/)
if (preg_match('/^\/article\/([a-zA-Z0-9-]+)\/?$/', $requestUri, $matches)) {
    $isArticlePage = true;
    $articleSlug = $matches[1];
}

if ($isArticlePage && $articleSlug) {
    // Construire l'URL de l'API pour cet article
    $apiUrl = WP_API_BASE_URL . "/posts?slug=" . urlencode($articleSlug) . "&_embed";

    // --- Utilisation de cURL pour l'appel API (plus robuste que file_get_contents) ---
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10); // Timeout de 10 secondes
    // Optionnel: Désactiver la vérification SSL si vous avez des problèmes locaux (NON RECOMMANDÉ EN PRODUCTION)
    // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    // Optionnel: Ajouter un User-Agent
    curl_setopt($ch, CURLOPT_USERAGENT, 'GomaWebRadio-MetaFetcher/1.0');

    $responseJson = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    // --- Fin de l'appel cURL ---

    if ($curlError) {
        // Gérer l'erreur cURL (logguer l'erreur, par exemple)
        error_log("cURL Error fetching WP API: " . $curlError);
    } elseif ($httpcode == 200 && $responseJson) {
        $posts = json_decode($responseJson);

        // Vérifier si on a bien reçu un article
        if (!empty($posts) && isset($posts[0])) {
            $article = $posts[0];

            // Mettre à jour les variables meta avec les données de l'article
            $metaTitle = isset($article->title->rendered) ? html_entity_decode($article->title->rendered) : DEFAULT_TITLE;
            // Nettoyer l'extrait: supprimer les balises HTML et décoder les entités
            $metaDescription = isset($article->excerpt->rendered) ? trim(strip_tags(html_entity_decode($article->excerpt->rendered))) : DEFAULT_DESCRIPTION;
            $ogType = 'article'; // C'est un article

            // Essayer de récupérer l'image mise en avant via _embed
            if (isset($article->_embedded->{'wp:featuredmedia'}[0]->source_url)) {
                 $metaImageUrl = $article->_embedded->{'wp:featuredmedia'}[0]->source_url;
            }

            // Construire l'URL canonique de l'article
            $metaUrl = SITE_BASE_URL . '/article/' . (isset($article->slug) ? $article->slug : $articleSlug);

        } else {
             // L'API a répondu mais l'article avec ce slug n'existe pas
             // On pourrait potentiellement définir $metaTitle différemment ou logger
        }
    } else {
        // Gérer les erreurs HTTP de l'API (logguer $httpcode)
        error_log("WP API Error: HTTP Status " . $httpcode . " for slug " . $articleSlug);
    }
     // Si l'appel échoue ou si l'article n'est pas trouvé, les valeurs par défaut restent.
}

?>
<!DOCTYPE html>
<html lang="fr" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- ======================================================= -->
    <!-- Balises Meta Générées Dynamiquement par PHP -->
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
    <?php // Optionnel: Ajouter la date de publication si récupérée
        // if ($ogType === 'article' && isset($article->date)) {
        //     echo '<meta property="article:published_time" content="' . htmlspecialchars($article->date) . '" />';
        // }
    ?>

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="<?php echo htmlspecialchars($metaUrl); ?>" />
    <meta name="twitter:title" content="<?php echo htmlspecialchars($metaTitle); ?>" />
    <meta name="twitter:description" content="<?php echo htmlspecialchars($metaDescription); ?>" />
    <meta name="twitter:image" content="<?php echo htmlspecialchars($metaImageUrl); ?>" />
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
    <!-- Assurez-vous que ce chemin est correct par rapport à votre build -->
    <!-- Exemple: <link rel="stylesheet" href="/assets/index.xxxx.css"> -->

</head>
<body>
    <!-- Le conteneur pour votre application React - Reste inchangé -->
    <div id="root"></div>

    <!-- Script externe - Reste inchangé -->
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>

    <!-- IMPORTANT: Chargement de votre application React compilée -->
    <!-- Le chemin '/src/main.tsx' est pour le développement avec Vite. -->
    <!-- En production, vous devez mettre le chemin vers le fichier JS généré par 'npm run build' -->
    <!-- Exemple: <script type="module" src="/assets/index.yyyy.js"></script> -->
    <script type="module" src="/src/main.tsx"></script>

</body>
</html>
