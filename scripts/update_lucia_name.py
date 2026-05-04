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
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    req = urllib.request.Request(f"{URL}/rest/v1/{endpoint}", method=method, headers=headers)
    if payload:
        req.data = json.dumps(payload).encode("utf-8")
    
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        print(f"Error: {e.code}: {error_msg}")
        raise

def main():
    profile_id = "c581eb3c-cb8c-4ac6-afff-0e32039654ca"
    new_name = "Lucia Zelaya"
    print(f"Updating profile {profile_id} to {new_name}...")
    
    # Supabase PATCH to update
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json"
    }
    payload = {"name": new_name}
    url = f"{URL}/rest/v1/profiles?id=eq.{profile_id}"
    
    req = urllib.request.Request(url, method="PATCH", headers=headers)
    req.data = json.dumps(payload).encode("utf-8")
    
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            print("Profile updated successfully!")
    except Exception as e:
        print(f"Failed to update profile: {e}")

if __name__ == '__main__':
    main()
