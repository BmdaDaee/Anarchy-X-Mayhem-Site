import re
from pathlib import Path

ROOT = Path(__file__).parent

# Pages to sync (all top-level HTML pages except partials)
PAGES = sorted([
    p.name for p in ROOT.glob("*.html")
    if not p.name.startswith("_") and p.name not in {"404.html"}
])

SITE_URL = "https://www.anarchyxmayhem.com"
OG_IMAGE = f"{SITE_URL}/assets/og/og-default.png"  # create later if you want

# Per-page metadata (fallbacks applied if missing)
META = {
    "index.html": {
        "title": "Anarchy X Mayhem | Modern Systems for Home, Tech, Work, and Life",
        "description": "AXM builds practical systems for home, tech, work, and life: PC repair, smart home setups, automation, and real-world support.",
        "canonical": f"{SITE_URL}/",
        "og_title": "Anarchy X Mayhem",
        "og_description": "Modern systems for home, tech, work, and life. Practical solutions that replace outdated service models.",
        "og_url": f"{SITE_URL}/",
    },
    "services.html": {
        "title": "Services | Anarchy X Mayhem",
        "description": "PC repair, smart home setups, Wi‑Fi optimization, automation, and practical support built for real life in Cleveland.",
    },
    "products.html": {
        "title": "Products & Kits | Anarchy X Mayhem",
        "description": "Curated kits and gear for smart home, creator workflows, and practical everyday tech.",
    },
    "pricing.html": {
        "title": "Pricing | Anarchy X Mayhem",
        "description": "Clear, honest pricing for PC repair, smart home, and support services.",
    },
    "bundles.html": {
        "title": "Bundles | Anarchy X Mayhem",
        "description": "Value bundles for PC tune-ups, smart home setups, Wi‑Fi fixes, and maintenance. Built to save time and avoid surprises.",
    },
    "carriers.html": {
        "title": "Phone Carriers | Anarchy X Mayhem",
        "description": "Modern carrier options like Red Pocket and MobileX without the store hassle. Setup, transfers, and troubleshooting.",
    },
    "cleaning.html": {
        "title": "Cleaning & Home Support | Anarchy X Mayhem",
        "description": "Reliable cleaning and practical home support for busy households and small spaces. Simple scheduling, clear expectations.",
    },
    "travel.html": {
        "title": "Travel Services | Anarchy X Mayhem",
        "description": "Travel planning and logistics support built for real‑world movement: routes, booking help, and smooth trip coordination.",
    },
    "sitemap.html": {
        "title": "Sitemap | Anarchy X Mayhem",
        "description": "A quick list of pages on the Anarchy X Mayhem site.",
    },
    "the-glass-case.html": {
        "title": "The Glass Case | Anarchy X Mayhem",
        "description": "The Glass Case: curated picks and drops. Practical gear, clean presentation.",
    },
    "about.html": {
        "title": "About | Anarchy X Mayhem",
        "description": "About AXM: practical systems and real-world problem solving rooted in Cleveland.",
    },
    "blog.html": {
        "title": "Blog | Anarchy X Mayhem",
        "description": "Field notes, breakdowns, and practical lessons from the AXM workflow.",
    },
    "faq.html": {
        "title": "FAQ | Anarchy X Mayhem",
        "description": "Answers to common questions about AXM services, scheduling, and support.",
    },
    "contact.html": {
        "title": "Contact | Anarchy X Mayhem",
        "description": "Contact AXM to book a consultation, request service, or start a project.",
    },
}

# Fallback for extra pages in the repo
DEFAULT_DESC = "AXM builds practical systems for home, tech, work, and life."

def read_text(name: str) -> str:
    return (ROOT / name).read_text(encoding="utf-8").rstrip() + "\n"

HEAD_TMPL = read_text("_head.html")
NAV = read_text("_nav.html").strip()
FOOTER = read_text("_footer.html").strip()

head_re = re.compile(r"<head\b[^>]*>.*?</head>", re.DOTALL | re.IGNORECASE)
nav_re = re.compile(r"<header\b[^>]*class=[\"']axm-header[\"'][^>]*>.*?</header>", re.DOTALL | re.IGNORECASE)
footer_re = re.compile(r"<footer\b[^>]*class=[\"']axm-footer[\"'][^>]*>.*?</footer>", re.DOTALL | re.IGNORECASE)

def build_head(page: str) -> str:
    m = META.get(page, {})
    title = m.get("title", f"{page.replace('.html','').title()} | Anarchy X Mayhem")
    desc = m.get("description", DEFAULT_DESC)
    canonical = m.get("canonical", f"{SITE_URL}/{page}")

    og_title = m.get("og_title", title)
    og_desc = m.get("og_description", desc)
    og_url = m.get("og_url", canonical)

    head = HEAD_TMPL
    head = head.replace("{{TITLE}}", title)
    head = head.replace("{{DESCRIPTION}}", desc)
    head = head.replace("{{CANONICAL}}", canonical)
    head = head.replace("{{OG_TITLE}}", og_title)
    head = head.replace("{{OG_DESCRIPTION}}", og_desc)
    head = head.replace("{{OG_URL}}", og_url)
    head = head.replace("{{OG_IMAGE}}", OG_IMAGE)
    head = head.replace("{{TW_TITLE}}", og_title)
    head = head.replace("{{TW_DESCRIPTION}}", og_desc)
    head = head.replace("{{TW_IMAGE}}", OG_IMAGE)
    return "<head>\n" + head + "</head>"

for page in PAGES:
    path = ROOT / page
    html = path.read_text(encoding="utf-8")

    # Normalize <head> ... </head>
    html = head_re.sub(build_head(page), html, count=1)

    # Normalize shared nav (keep page-specific 'active' out; JS will handle it)
    if nav_re.search(html):
        html = nav_re.sub(NAV, html, count=1)
    else:
        html = re.sub(r"<body\b[^>]*>\s*", lambda m: m.group(0) + "\n" + NAV + "\n", html, count=1, flags=re.IGNORECASE)

    # Normalize footer
    if footer_re.search(html):
        html = footer_re.sub(FOOTER, html, count=1)
    else:
        html = re.sub(r"</body>", FOOTER + "\n</body>", html, count=1, flags=re.IGNORECASE)

    # Clean up duplicate legacy comments (harmless, but messy)
    html = re.sub(r"(?:<!--\s*SHARED NAV\s*-->\s*){2,}", "<!-- SHARED NAV -->\n", html, flags=re.IGNORECASE)
    html = re.sub(r"(?:<!--\s*SHARED FOOTER\s*-->\s*){2,}", "<!-- SHARED FOOTER -->\n", html, flags=re.IGNORECASE)

    path.write_text(html, encoding="utf-8")

print("✅ Synced head/nav/footer across:")
for p in PAGES:
    print(f"- {p}")
