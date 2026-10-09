from pathlib import Path
from collections import Counter
from html.parser import HTMLParser
import re

root = Path(__file__).resolve().parent.parent
class CheckHTML(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.anchors = []
    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        if 'id' in attributes:
            self.ids.append(attributes['id'])
        if tag == 'a' and attributes.get('href', '').startswith('#'):
            self.anchors.append(attributes['href'][1:])

html = (root / 'index.html').read_text(encoding='utf-8')
css = '\n'.join(path.read_text(encoding='utf-8') for path in (root / 'styles.css', root / 'cinematic.css', root / 'depth.css'))
parser = CheckHTML()
parser.feed(html)
missing = [p for p in set(re.findall(r'assets/[A-Za-z0-9_.-]+', html + css)) if not (root / p).exists()]
duplicate = [key for key, count in Counter(parser.ids).items() if count > 1]
broken = [anchor for anchor in parser.anchors if anchor not in parser.ids]
assert not missing, missing
assert not duplicate, duplicate
assert not broken, broken
assert css.count('{') == css.count('}')
print('All local assets, section links, unique IDs, and CSS braces checked.')
