import json
import urllib.request
import urllib.error
import ssl
import os

URL = "https://iiilenevhepdrrqbgvey.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64"

# Disable SSL verification for local macOS python issue
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
    req = urllib.request.Request(f"{URL}/rest/v1/{endpoint}", method=method, headers=headers)
    if payload:
        req.data = json.dumps(payload).encode("utf-8")
    
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        print(f"Error making request: {e.code}: {error_msg}")
        raise

def main():
    print("Reading payload.json...")
    with open('payload.json', 'r') as f:
        profiles = json.load(f)

    for p in profiles:
        if "roles" not in p:
            p["roles"] = []

    print("Upserting profiles...")
    try:
        make_request("POST", "profiles", profiles)
        print("Profiles upserted successfully.")
    except Exception as e:
        print("Failed to bulk upsert profiles, trying individually...")
        for p in profiles:
            try:
                make_request("POST", "profiles", [p])
            except Exception as e2:
                print(f"Could not insert profile {p.get('name')}: {e2}")

    print("Reading schedule...")
    try:
        with open('Untitled.txt', 'r') as f:
            sched_data = json.load(f)

        schedule_list = []
        for date_str, s in sched_data.items():
            slots = s.get('slots', {})
            row = {
                "id": s.get("id"),
                "date": s.get("date"),
            }
            if "5am" in slots:
                row["five_am_leader_id"] = slots["5am"].get("leaderId")
                row["five_am_custom_label"] = slots["5am"].get("customLabel")
            if "9am" in slots:
                row["nine_am_consecration_leader_id"] = slots["9am"].get("consecrationLeaderId")
                row["nine_am_doctrine_leader_id"] = slots["9am"].get("doctrineLeaderId")
                row["nine_am_custom_label"] = slots["9am"].get("customLabel")
            if "evening" in slots:
                row["evening_service_type"] = slots["evening"].get("type", "regular")
                row["evening_leader_ids"] = slots["evening"].get("leaderIds", [])
                row["topic"] = slots["evening"].get("topic", "")
                row["evening_custom_label"] = slots["evening"].get("customLabel")
                row["evening_service_time"] = slots["evening"].get("time", "07:00 PM")

            for k, v in list(row.items()):
                if k in ["five_am_leader_id", "nine_am_consecration_leader_id", "nine_am_doctrine_leader_id", "noon_leader_id"]:
                    if v == "":
                        row[k] = None

            schedule_list.append(row)

        print(f"Upserting {len(schedule_list)} schedule days...")
        try:
            make_request("POST", "schedule", schedule_list)
            print("Schedule upserted successfully.")
        except Exception as e:
            print("Failed to bulk upsert schedule, trying individually...")
            for item in schedule_list:
                try:
                     make_request("POST", "schedule", [item])
                except Exception as e2:
                     pass
                     
    except Exception as e:
        print(f"Could not read/process Untitled.txt for schedule: {e}")

if __name__ == '__main__':
    main()
