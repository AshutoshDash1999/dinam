import urllib.request
import json
url = "https://api.github.com/repos/AshutoshDash1999/dinam/issues?state=all&per_page=100"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        issues = json.loads(response.read().decode())
        with open('issues.txt', 'w', encoding='utf-8') as f:
            for i in issues:
                prefix = "PR" if "pull_request" in i else "ISSUE"
                f.write(f"[{i['state'].upper()}] {prefix} #{i['number']}: {i['title']}\n")
except Exception as e:
    with open('issues.txt', 'w') as f:
        f.write(str(e))
