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
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"Error: {e.code} - {e.read().decode()}")
        return None

def main():
    print("Updating Eliab Aguilar profile with 'admin' privilege...")
    # First get his current roles
    import urllib.parse
    params = urllib.parse.quote("name=eq.E.E. Eliab Aguilar&select=id,roles", safe="=&")
    res = make_request("GET", f"profiles?{params}")
    
    if res and len(res) > 0:
        profile_id = res[0]['id']
        current_roles = res[0].get('roles') or []
        if 'admin' not in current_roles:
            current_roles.append('admin')
        
        # Update the profile
        update_payload = {"roles": current_roles}
        update_res = make_request("PATCH", f"profiles?id=eq.{profile_id}", update_payload)
        if update_res:
            print("Successfully granted 'admin' privilege to Eliab Aguilar.")
        else:
            print("Failed to update profile.")
    else:
        print("Could not find Eliab Aguilar profile.")

if __name__ == '__main__':
    main()
