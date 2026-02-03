set +H

for f in *.html; do
  case "$f" in
    index.html)    TITLE="Anarchy X Mayhem | Practical Solutions for Complex Systems"; URL="https://www.anarchyxmayhem.com/";;
    services.html) TITLE="Services | Anarchy X Mayhem";                                URL="https://www.anarchyxmayhem.com/services.html";;
    products.html) TITLE="Products & Kits | Anarchy X Mayhem";                         URL="https://www.anarchyxmayhem.com/products.html";;
    about.html)    TITLE="About | Anarchy X Mayhem";                                   URL="https://www.anarchyxmayhem.com/about.html";;
    blog.html)     TITLE="Blog | Anarchy X Mayhem";                                    URL="https://www.anarchyxmayhem.com/blog.html";;
    faq.html)      TITLE="FAQ | Anarchy X Mayhem";                                     URL="https://www.anarchyxmayhem.com/faq.html";;
    contact.html)  TITLE="Contact | Anarchy X Mayhem";                                 URL="https://www.anarchyxmayhem.com/contact.html";;
    *) continue;;
  esac

  # Replace or insert <title>
  perl -0777 -i -pe "if (s#<title>.*?</title>#<title>$TITLE</title>#s) { } else { s#(<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\\s*)#\$1\\n  <title>$TITLE</title>\\n#s }" "$f"

  # Remove any existing canonical + og:url (prevents duplicates)
  perl -0777 -i -pe 's#\s*<link rel="canonical"[^>]*>\s*##gs; s#\s*<meta property="og:url"[^>]*>\s*##gs' "$f"

  # Insert canonical + og:url right after robots meta
  perl -0777 -i -pe "s#(<meta name=\"robots\" content=\"index,follow\" />\\s*)#\$1\\n  <link rel=\"canonical\" href=\"$URL\" />\\n  <meta property=\"og:url\" content=\"$URL\" />\\n#s" "$f"
done

echo "✅ Titles + canonicals + og:url normalized across all pages."
