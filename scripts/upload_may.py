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
        "Prefer": "resolution=merge-duplicates"
    }
    url = f"{URL}/rest/v1/{endpoint}"
    if endpoint == "schedule":
        url += "?on_conflict=date"
    req = urllib.request.Request(url, method=method, headers=headers)
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
    print("Reading may_schedule_payload.json...")
    with open('may_schedule_payload.json', 'r') as f:
        schedule = json.load(f)

    print(f"Upserting {len(schedule)} days of schedule...")
    try:
        make_request("POST", "schedule", schedule)
        print("Success!")
    except Exception as e:
        print(f"Bulk failed, trying individual upserts...")
        for day in schedule:
            try:
                make_request("POST", "schedule", [day])
            except:
                print(f"Failed date: {day['date']}")

if __name__ == '__main__':
    main()
