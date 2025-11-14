export async function findArticleSmart(
  slugOrTitle: string,
  baseUrl = "https://gomawebradio.com/news"
) {
  // ---------------------------------------------
  // 1) ESSAYER PAR SLUG DIRECT
  // ---------------------------------------------
  let response = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slugOrTitle)}`
  );
  let posts = await response.json();

  if (posts && posts.length > 0) {
    return posts[0]; // trouvé par slug
  }

  // ---------------------------------------------
  // 2) ESSAYER PAR TITRE (recherche interne WP)
  // ---------------------------------------------
  response = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?search=${encodeURIComponent(slugOrTitle)}`
  );
  posts = await response.json();

  if (posts && posts.length > 0) {
    return posts[0]; // trouvé via recherche
  }

  // ---------------------------------------------
  // 3) FUZZY MATCHING — récupérer un lot d’articles
  // ---------------------------------------------
  response = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?per_page=50`
  );
  const allPosts = await response.json();

  if (!Array.isArray(allPosts) || allPosts.length === 0) {
    return null;
  }

  // ---------------------------------------------
  // 3B) FONCTION DE SIMILARITÉ SIMPLE
  // ---------------------------------------------
  const similarity = (a: string, b: string) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    let matches = 0;
    for (let char of a) {
      if (b.includes(char)) matches++;
    }
    return matches / Math.max(a.length, b.length);
  };

  // ---------------------------------------------
  // 3C) TROUVER LE TITRE QUI SE RAPPELLE DE TON SLUG
  // ---------------------------------------------
  let bestPost = null;
  let bestScore = 0;

  for (const p of allPosts) {
    const score = similarity(slugOrTitle, p.title.rendered);
    if (score > bestScore) {
      bestScore = score;
      bestPost = p;
    }
  }

  // score trop faible = probablement mauvais article
  if (bestScore < 0.3) {
    return null;
  }

  return bestPost;
}
