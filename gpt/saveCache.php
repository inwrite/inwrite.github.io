<?php
header("Content-Type: application/json");

$cacheFile = "cache.json";
$pagesDir = "pages/";

// Проверяем, есть ли директория `/pages/`
if (!is_dir($pagesDir)) {
    mkdir($pagesDir, 0777, true);
}

// Получаем данные из запроса
$data = json_decode(file_get_contents("php://input"), true);
$question = mb_strtolower(trim($data["question"] ?? ""));
$answer = trim($data["answer"] ?? "");
$providedImage = trim($data["image"] ?? ""); // Изображение, переданное в запросе

if (!$question || !$answer) {
    echo json_encode(["error" => "Неверные данные"]);
    exit;
}

// Загружаем текущий кэш
$cache = file_exists($cacheFile) ? json_decode(file_get_contents($cacheFile), true) : [];

// Добавляем новый ответ в кэш
$cache[$question] = $answer;
file_put_contents($cacheFile, json_encode($cache, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Генерируем URL-совместимое имя файла с поддержкой кириллицы
$pageSlug = preg_replace('/[^a-z0-9а-яё]+/iu', '-', trim($question));
$pageSlug = trim($pageSlug, '-');
$pageFile = $pagesDir . $pageSlug . ".html";

// URL страницы для использования в мета-тегах
$pageUrl = "https://inwrite.org/gpt/pages/$pageSlug.html";

// Дефолтное изображение (оставьте пустым, если дефолтного изображения нет)
$defaultImage = "https://inwrite.org/gpt/images/default.jpg";

// Определяем, какое изображение использовать: если передано в запросе - берем его, иначе дефолтное (если задано)
$imageToUse = "";
if (!empty($providedImage)) {
    $imageToUse = $providedImage;
} elseif (!empty($defaultImage)) {
    $imageToUse = $defaultImage;
}

// Формируем блок метатегов для изображения, если изображение задано
$imageMetaTags = "";
if ($imageToUse) {
    $imageMetaTags = "
    <meta property='og:image' content='$imageToUse'>
    <meta name='twitter:image' content='$imageToUse'>
    ";
}

// Формируем блок для изображения в теле страницы, если изображение задано
$imageSection = "";
if ($imageToUse) {
    $imageSection = "<figure><img src='$imageToUse' alt='Изображение для $question'></figure>";
}

// Форматирование описания: удаляем переносы строк, заменяя их пробелами
$formattedDescription = str_replace(array("\r", "\n"), ' ', $answer);

// Создаём HTML-страницу с SEO-оптимизацией
$htmlContent = "<!DOCTYPE html>
<html lang='ru'>
<head>
    <meta charset='UTF-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>$question</title>
    <meta name='description' content='$formattedDescription'>
    <meta name='robots' content='index, follow'>
    <link rel='canonical' href='$pageUrl'>

    <!-- Open Graph -->
    <meta property='og:title' content='$question'>
    <meta property='og:description' content='$formattedDescription'>
    <meta property='og:url' content='$pageUrl'>
    <meta property='og:type' content='website'>

    <!-- Twitter Card -->
    <meta name='twitter:card' content='summary_large_image'>
    <meta name='twitter:title' content='$question'>
    <meta name='twitter:description' content='$formattedDescription'>
    
    $imageMetaTags

    <!-- JSON-LD Structured Data для FAQPage -->
    <script type='application/ld+json'>
    {
      \"@context\": \"https://schema.org\",
      \"@type\": \"FAQPage\",
      \"mainEntity\": [{
          \"@type\": \"Question\",
          \"name\": \"" . addslashes($question) . "\",
          \"acceptedAnswer\": {
            \"@type\": \"Answer\",
            \"text\": \"" . addslashes($answer) . "\"
          }
      }]
    }
    </script>
</head>
<body>
    <article>
        <header>
            <h1>$question</h1>
        </header>
        $imageSection
        <section>
            <p>$answer</p>
        </section>
    </article>
    <footer>
        <a href='/'>Вернуться в чат</a>
    </footer>
</body>
</html>";

// Записываем HTML-файл
file_put_contents($pageFile, $htmlContent);

echo json_encode(["success" => true, "page" => "/pages/$pageSlug.html"]);

// Генерируем новый sitemap.xml
$sitemapFile = "sitemap.xml";
$sitemapContent = "<?xml version='1.0' encoding='UTF-8'?>\n";
$sitemapContent .= "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>\n";

// Добавляем главную страницу
$sitemapContent .= "<url>\n<loc>https://inwrite.org/gpt/</loc>\n<priority>1.0</priority>\n</url>\n";

// Добавляем страницы FAQ
foreach (glob($pagesDir . "*.html") as $page) {
    $pageUrlSitemap = "https://inwrite.org/gpt/" . str_replace($pagesDir, "pages/", $page);
    $sitemapContent .= "<url>\n<loc>$pageUrlSitemap</loc>\n<priority>0.8</priority>\n</url>\n";
}

$sitemapContent .= "</urlset>";
file_put_contents($sitemapFile, $sitemapContent);
