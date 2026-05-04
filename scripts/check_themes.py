import json
import urllib.request
import urllib.error
import ssl

URL = "https://iiilenevhepdrrqbgvey.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def make_request(method, endpoint, payload=None):
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json"
    }
    req = urllib.request.Request(f"{URL}/rest/v1/{endpoint}", method=method, headers=headers)
    if payload:
        req.data = json.dumps(payload).encode("utf-8")
    
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"Error: {e.code}")
        return None

def main():
    print("Checking weekly_themes...")
    res = make_request("GET", "weekly_themes?select=*&order=created_at.desc")
    print(json.dumps(res, indent=2))

if __name__ == '__main__':
    main()
