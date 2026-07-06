"""GitHub API integration for syncing repos into Project records."""
import base64
import re

import requests
from django.conf import settings


def _headers():
    h = {'Accept': 'application/vnd.github.v3+json'}
    token = getattr(settings, 'GITHUB_TOKEN', '')
    if token:
        h['Authorization'] = f'token {token}'
    return h


def list_github_repos(username):
    """Return list of public repos for *username*."""
    url = f'https://api.github.com/users/{username}/repos'
    params = {'sort': 'updated', 'per_page': 30, 'type': 'owner'}
    resp = requests.get(url, headers=_headers(), params=params, timeout=15)
    resp.raise_for_status()
    repos = resp.json()
    return [
        {
            'name': r['name'],
            'full_name': r['full_name'],
            'description': r.get('description') or '',
            'html_url': r['html_url'],
            'language': r.get('language') or '',
            'stargazers_count': r.get('stargazers_count', 0),
            'updated_at': r.get('updated_at', ''),
        }
        for r in repos
    ]


def sync_repo_readme(repo_full_name, readme_path='README.md'):
    """Fetch and parse a README from a GitHub repo.

    Returns a dict with keys: title, description, tech_stack, readme_content, github_url.
    """
    url = f'https://api.github.com/repos/{repo_full_name}/contents/{readme_path}'
    resp = requests.get(url, headers=_headers(), timeout=15)
    resp.raise_for_status()
    data = resp.json()

    content_b64 = data.get('content', '')
    raw_md = base64.b64decode(content_b64).decode('utf-8', errors='replace')

    # Parse title from first markdown heading
    title_match = re.search(r'^#\s+(.+)$', raw_md, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else repo_full_name.split('/')[-1]

    # Parse description: first non-empty, non-heading paragraph
    lines = raw_md.split('\n')
    description = ''
    for line in lines:
        stripped = line.strip()
        if stripped and not stripped.startswith('#') and not stripped.startswith('!') and not stripped.startswith('['):
            description = stripped
            break

    # Parse tech stack: look for badges or a "Technologies" / "Tech Stack" section
    tech_stack = []
    tech_section = re.search(
        r'(?:## (?:Tech|Technologies|Stack|Built With).*?\n)([\s\S]*?)(?=\n## |\Z)',
        raw_md,
        re.IGNORECASE,
    )
    if tech_section:
        items = re.findall(r'[-*]\s+(.+)', tech_section.group(1))
        tech_stack = [item.strip().strip('`*_') for item in items]

    # Fallback: extract badge alt texts
    if not tech_stack:
        badges = re.findall(r'!\[([^\]]+)\]', raw_md)
        tech_stack = [b for b in badges if len(b) < 30][:10]

    github_url = f'https://github.com/{repo_full_name}'

    return {
        'title': title,
        'description': description,
        'tech_stack': tech_stack,
        'readme_content': raw_md,
        'github_url': github_url,
    }
