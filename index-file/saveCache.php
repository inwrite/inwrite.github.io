<?php
header("Content-Type: application/json");

$cacheFile = "cache.json";
$pagesDir = "pages/";

// Check if the "/pages/" directory exists; if not, create it.
if (!is_dir($pagesDir)) {
    mkdir($pagesDir, 0777, true);
}

// Retrieve data from the request
$data = json_decode(file_get_contents("php://input"), true);
$question = mb_strtolower(trim($data["question"] ?? ""));
$answer = trim($data["answer"] ?? "");
$providedImage = trim($data["image"] ?? ""); // Image provided in the request

if (!$question || !$answer) {
    echo json_encode(["error" => "Invalid data"]);
    exit;
}

// Process <img> tags within $answer to replace relative src paths with full URLs.
$baseUrlForImages = "https://inwrite.org/gpt/";
$answer = preg_replace_callback("/<img\s+[^>]*src=[\"']([^\"']+)[\"']/i", function($matches) use ($baseUrlForImages) {
    $src = $matches[1];
    if (stripos($src, 'http') !== 0) {
        $src = $baseUrlForImages . ltrim($src, '/');
    }
    return str_replace($matches[1], $src, $matches[0]);
}, $answer);

// Escape the question for use in HTML attributes and elements
$safeQuestion = htmlspecialchars($question, ENT_QUOTES, 'UTF-8');

// Create a plain-text version of the answer (removing HTML tags) for meta tags and JSON-LD
$plainAnswer = strip_tags($answer);

// Format the description for meta tags: remove newlines and escape special characters
$formattedDescription = htmlspecialchars(str_replace(array("\r", "\n"), ' ', $plainAnswer), ENT_QUOTES, 'UTF-8');

// Load the current cache
$cache = file_exists($cacheFile) ? json_decode(file_get_contents($cacheFile), true) : [];

// Add the new answer to the cache
$cache[$question] = $answer;
file_put_contents($cacheFile, json_encode($cache, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Generate a URL-friendly filename (slug) with support for non-Latin characters
$pageSlug = preg_replace('/[^a-z0-9а-яё]+/iu', '-', trim($question));
$pageSlug = trim($pageSlug, '-');
$pageFile = $pagesDir . $pageSlug . ".html";

// URL of the page to be used in meta tags
$pageUrl = "https://inwrite.org/gpt/pages/$pageSlug.html";

// Default image (leave empty if no default image is set)
$defaultImage = "https://inwrite.org/gpt/images/default.jpg";

// Determine which image to use: if provided in the request, use it; otherwise, use the default image
$imageToUse = "";
if (!empty($providedImage)) {
    if (stripos($providedImage, 'http') !== 0) {
         $imageToUse = "https://inwrite.org/gpt/" . ltrim($providedImage, '/');
    } else {
         $imageToUse = $providedImage;
    }
} elseif (!empty($defaultImage)) {
    $imageToUse = $defaultImage;
}

// Create image meta tags if an image is provided
$imageMetaTags = "";
if ($imageToUse) {
    $imageMetaTags = "
    <meta property='og:image' content='$imageToUse'>
    <meta name='twitter:image' content='$imageToUse'>
    ";
}

// Create the image section for the page if an image is provided
$imageSection = "";
if ($imageToUse) {
    $imageSection = "<figure style='height: 0; width: 0; overflow: hidden;'><img src='$imageToUse' alt='Image for $safeQuestion'></figure>";
}

// Generate JSON-LD data using json_encode for proper escaping
$jsonLdData = [
    "@context" => "https://schema.org",
    "@type" => "FAQPage",
    "mainEntity" => [
        [
            "@type" => "Question",
            "name" => $question,
            "acceptedAnswer" => [
                "@type" => "Answer",
                "text" => $plainAnswer
            ]
        ]
    ]
];
$jsonLdJson = json_encode($jsonLdData, JSON_UNESCAPED_UNICODE | JSON_HEX_APOS | JSON_HEX_QUOT);

// Create the HTML page with SEO optimization
$htmlContent = "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>$safeQuestion</title>
    <meta name='description' content='$formattedDescription'>
    <meta name='robots' content='index, follow'>
    <link rel='canonical' href='$pageUrl'>

    <!-- Open Graph -->
    <meta property='og:title' content='$safeQuestion'>
    <meta property='og:description' content='$formattedDescription'>
    <meta property='og:url' content='$pageUrl'>
    <meta property='og:type' content='website'>

    <!-- Twitter Card -->
    <meta name='twitter:card' content='summary_large_image'>
    <meta name='twitter:title' content='$safeQuestion'>
    <meta name='twitter:description' content='$formattedDescription'>
    
    $imageMetaTags

    <!-- JSON-LD Structured Data for FAQPage -->
    <script type='application/ld+json'>
    $jsonLdJson
    </script>
</head>
<body>
    <article>
        <header>
            <h1>$safeQuestion</h1>
        </header>
        $imageSection
        <section>
            <p>$answer</p>
        </section>
    </article>
    <footer>
        <a href='/'>Return to chat</a>
    </footer>
</body>
</html>";

// Write the HTML file
file_put_contents($pageFile, $htmlContent);

echo json_encode(["success" => true, "page" => "/pages/$pageSlug.html"]);

// Generate a new sitemap.xml
$sitemapFile = "sitemap.xml";
$sitemapContent = "<?xml version='1.0' encoding='UTF-8'?>\n";
$sitemapContent .= "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>\n";

// Add the main page
$sitemapContent .= "<url>\n<loc>https://inwrite.org/gpt/</loc>\n<priority>1.0</priority>\n</url>\n";

// Add FAQ pages
foreach (glob($pagesDir . "*.html") as $page) {
    $pageUrlSitemap = "https://inwrite.org/gpt/" . str_replace($pagesDir, "pages/", $page);
    $sitemapContent .= "<url>\n<loc>$pageUrlSitemap</loc>\n<priority>0.8</priority>\n</url>\n";
}

$sitemapContent .= "</urlset>";
file_put_contents($sitemapFile, $sitemapContent);
?>
