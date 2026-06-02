import json
import urllib.request
import urllib.error
import ssl
import sys
import uuid

URL = "https://iiilenevhepdrrqbgvey.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64"

# Disable SSL verification for local macOS python issue
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Name to UUID Mapping
MEMBER_MAP = {
    "LEONEL MARRUFO": "9c8af082-f9ba-4bef-840e-b53d22b21b49",
    "ABRAHAM DÍAZ": "035044e4-e2f4-4fa3-a2f6-3507cf2a1a30",
    "ESTEBAN SERRANO": "00db7500-7397-4580-b81d-e0055f1249a7",
    "ELIAB R. AGUILAR": "ac5c4c67-4999-4244-b895-09cf1d62bd54",
    "MANUEL DÍAZ": "2d0ceeb0-9421-4797-9aba-33a2d751916d",
    "IGNACIO RAMÍREZ": "a5fb1fa4-9910-4a9a-aa8a-4fd88ccd7b9b",
    "JOSUÉ DÍAZ": "293e5cbf-fe74-4b79-8b16-a90b16dad8f0",
    "ABIDAN ALVARADO": "f10453d9-6ecd-4fa5-ab91-f182a7a1a65d",
    "PABLO SANTIZO": "be4d631c-34f7-4405-bc4c-c800c8381cb4",
    "JAIRO ZELAYA": "75e197b1-19a9-41e2-9d32-d8dd2d7fd44d",
    "MELQUISEDEC SERRANO": "55d5ccdf-073b-491e-b34c-fd091eb06bb1", # Maps to Mequisedec Serrano
    "ELÍAS RUIZ": "657efb04-836d-42d7-8b11-8d749221df98",
    "ISAÍ HERNÁNDEZ": "42e55c48-4cef-4a8b-9705-ab6b5d15c515",
    "OLIVER MONTANO": "3fa5fa52-f02e-4827-a18f-19fda514794c",
    "RAMON SERRANO": "0668528d-37a9-4864-964f-ab2a6166cda4",
    "GERSON ZELAYA": "41d36c06-5a5c-4770-b6cf-03cdeecd3f9e",
    "TIMOTHY ZELAYA": "983fd2bd-4997-433b-b6ee-c71fe16f36ba",
    "DANIEL GUTIERREZ": "d0851fdf-bcdc-4e1a-bbfa-38678cbf98f6",
    "FREDDY RUIZ JR.": "00cd3461-bb0c-47ac-8dc8-d84b97d858a1",
    "FREDDY RUIZ SR.": "3968c3be-b475-46db-91e2-3d180007a552",
    "MANUEL GUTIERREZ": "a09ba6cd-a8ea-4b6e-868c-db540b7d577a",
    # Page 2 (9 AM slots)
    "EDELVIRA BELLOSO": "1bef514e-8dd1-4ad1-b37b-16386cf2729c",
    "MAYRA MONTANO": "aea97ce6-654f-4bd4-b4ac-257de893118c",
    "MARIA GUTIERREZ": "255351e3-4196-44ee-a292-e11880caff25",
    "SIBIA MARRUFO": "a7118d7d-f7eb-4c75-b7be-eb94e3ac06fa",
    "LUCIA ZELAYA": "c581eb3c-cb8c-4ac6-afff-0e32039654ca",
    "SOCORRO RUIZ": "b6fa5af6-9888-41c8-9927-09196f6d70cc",
    "RHODE ADAN": "e1f36e1d-6869-49c8-84cf-91ccf8fe4dbd",
    "JUDITH CHASOVA": "93764c38-3160-4b85-b0af-328969d708cd",
    "JASIBE AGUILAR": "f539f33f-7977-4766-afe9-837d9eb29dbb",
    "HANAI AGUILAR": "5b95d9a5-24dc-443c-854f-eba9c3c4ba23",
    "AMISADAI ALVARADO": "ab6e287f-2986-4644-8114-f31d18c906dd",
    "ROSA RAMIREZ": "738f3741-9832-4fab-bef9-12da1e3cc165",
    "REBECA RAMIREZ": "105ffc65-7124-46da-913d-809d8e4c14dd",
    "ABIGAIL HERNANDEZ": "c04cd5fc-5c31-47ce-b3dc-c73e2ed6a306",
    "RAAMA CHASOVA": "3220ac06-4b9b-417f-adc7-a726fac26657",
    "GABRIELLE ZELAYA": "e6c98339-f601-4460-b593-b8c349a8b145", # Maps to Grabriele Zelaya
    "KERIN HERNANDEZ": "22e7cd9e-53ea-4fa6-99d5-6e822eabd00b", # Maps to Keren Hernández
    "FREDDY RUIZ": "3968c3be-b475-46db-91e2-3d180007a552", # Maps to Fredy Ruíz (Sr.)
    "FREDDY RUÍZ": "3968c3be-b475-46db-91e2-3d180007a552" # Maps to Fredy Ruíz (Sr.)
}

# Explicitly skipped due to ambiguity or spelling discrepancy
SKIPPED_MEMBERS = []

def resolve_member(name):
    if not name:
        return None
    name_clean = name.strip().upper()
    if name_clean in SKIPPED_MEMBERS:
        return None
    return MEMBER_MAP.get(name_clean, None)

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
        print(f"Error making request to {endpoint}: {e.code}: {error_msg}")
        raise

def fetch_existing_schedule():
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json"
    }
    req = urllib.request.Request(f"{URL}/rest/v1/schedule?date=gte.2026-06-01&date=lte.2026-06-30", headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return {row['date']: row['id'] for row in data}
    except Exception as e:
        print(f"Warning: Could not fetch existing schedule IDs: {e}")
        return {}

def build_june_schedule(existing_ids):
    # Hardcoded schedule data structured directly from the PDF analysis
    schedule = []
    
    # Template of default settings
    def base_day(date_str):
        return {
            "id": existing_ids.get(date_str, str(uuid.uuid4())),
            "date": date_str,
            "five_am_leader_id": None,
            "five_am_time": "05:00 AM",
            "five_am_end_time": "05:30 AM",
            "five_am_language": "es",
            "five_am_custom_label": None,
            
            "nine_am_consecration_leader_id": None,
            "nine_am_doctrine_leader_id": None,
            "nine_am_time": "09:00 AM",
            "nine_am_end_time": "10:15 AM",
            "nine_am_language": "es",
            "nine_am_custom_label": None,
            
            "noon_leader_id": None,
            "noon_time": "12:00 PM",
            "noon_end_time": None,
            "noon_custom_label": None,
            
            "evening_leader_ids": [],
            "evening_doctrine_leader_id": None,
            "evening_consecration_leader_id": None,
            "evening_service_type": "regular",
            "evening_service_time": "07:00 PM",
            "evening_service_end_time": "08:30 PM",
            "evening_service_language": "es",
            "evening_custom_label": "",
            "topic": ""
        }

    # 1 to 30 June 2026
    for day in range(1, 31):
        date_str = f"2026-06-{day:02d}"
        row = base_day(date_str)
        
        # Day of week (June 1, 2026 is Monday)
        # 0 = Monday, 6 = Sunday
        dow = (day - 1) % 7
        
        # --- Page 2 Consecration/Doctrine 9am slots ---
        # Monday (0), Tuesday (1), Wednesday (2), Thursday (3), Friday (4), Saturday (5), Sunday (6)
        if dow == 0: # Monday
            row["nine_am_consecration_leader_id"] = resolve_member("EDELVIRA BELLOSO")
            row["nine_am_doctrine_leader_id"] = resolve_member("MAYRA MONTANO")
        elif dow == 1: # Tuesday
            if day == 23:
                # Special: June 23 lists Sibia Marrufo then Maria Gutierrez
                row["nine_am_consecration_leader_id"] = resolve_member("SIBIA MARRUFO")
                row["nine_am_doctrine_leader_id"] = resolve_member("MARIA GUTIERREZ")
            else:
                row["nine_am_consecration_leader_id"] = resolve_member("MARIA GUTIERREZ")
                row["nine_am_doctrine_leader_id"] = resolve_member("SIBIA MARRUFO")
        elif dow == 2: # Wednesday
            if day == 10:
                # Special: June 10 lists Socorro Ruiz then Lucia Zelaya
                row["nine_am_consecration_leader_id"] = resolve_member("SOCORRO RUIZ")
                row["nine_am_doctrine_leader_id"] = resolve_member("LUCIA ZELAYA")
            else:
                row["nine_am_consecration_leader_id"] = resolve_member("LUCIA ZELAYA")
                row["nine_am_doctrine_leader_id"] = resolve_member("SOCORRO RUIZ")
        elif dow == 3: # Thursday
            row["nine_am_consecration_leader_id"] = resolve_member("RHODE ADAN")
            row["nine_am_doctrine_leader_id"] = None
        elif dow == 4: # Friday
            if day == 5 or day == 19:
                row["nine_am_consecration_leader_id"] = resolve_member("JUDITH CHASOVA")
            elif day == 12 or day == 26:
                row["nine_am_consecration_leader_id"] = resolve_member("AMISADAI ALVARADO")
        elif dow == 5: # Saturday
            if day == 6:
                row["nine_am_consecration_leader_id"] = resolve_member("JASIBE AGUILAR")
                row["nine_am_doctrine_leader_id"] = resolve_member("HANAI AGUILAR")
            elif day == 13:
                row["nine_am_consecration_leader_id"] = resolve_member("ROSA RAMIREZ")
                row["nine_am_doctrine_leader_id"] = resolve_member("REBECA RAMIREZ")
            elif day == 20:
                row["nine_am_consecration_leader_id"] = resolve_member("ABIGAIL HERNANDEZ")
                row["nine_am_doctrine_leader_id"] = resolve_member("KERIN HERNANDEZ") # Skipped (None)
            elif day == 27:
                row["nine_am_consecration_leader_id"] = resolve_member("RAAMA CHASOVA")
                row["nine_am_doctrine_leader_id"] = resolve_member("JUDITH CHASOVA")
        
        # --- Page 1 general slots ---
        # 5AM Leaders
        if day in [1, 8, 15, 22, 29]:
            row["five_am_leader_id"] = resolve_member("LEONEL MARRUFO")
        elif day in [2, 9, 16, 23, 30]:
            row["five_am_leader_id"] = resolve_member("ESTEBAN SERRANO")
        elif day in [3, 10, 17, 24]:
            row["five_am_leader_id"] = resolve_member("MANUEL DÍAZ")
        elif day in [4, 11, 18, 25]:
            row["five_am_leader_id"] = resolve_member("JOSUÉ DÍAZ")
        elif day in [5, 12, 19, 26]:
            row["five_am_leader_id"] = resolve_member("ABRAHAM DÍAZ")
        elif day in [6]:
            row["five_am_leader_id"] = resolve_member("JAIRO ZELAYA")
        elif day in [13]:
            row["five_am_leader_id"] = resolve_member("ELÍAS RUIZ")
        elif day in [20, 27]:
            row["five_am_leader_id"] = resolve_member("TIMOTHY ZELAYA")
        elif day in [7, 14, 21, 28]:
            row["five_am_leader_id"] = resolve_member("ELIAB R. AGUILAR")

        # Evening services
        if dow == 6: # Sunday
            row["evening_service_time"] = "06:00 PM"
            row["topic"] = "Dominical"
            if day == 7:
                row["evening_leader_ids"] = [resolve_member("JOSUÉ DÍAZ")]
                row["evening_doctrine_leader_id"] = resolve_member("LEONEL MARRUFO")
            elif day == 14:
                row["evening_leader_ids"] = [resolve_member("ABRAHAM DÍAZ")]
                row["evening_doctrine_leader_id"] = resolve_member("RAMON SERRANO")
            elif day == 21:
                row["evening_leader_ids"] = [resolve_member("FREDDY RUIZ JR.")]
                row["evening_doctrine_leader_id"] = resolve_member("FREDDY RUIZ SR.")
            elif day == 28:
                row["evening_leader_ids"] = [resolve_member("JAIRO ZELAYA")]
                row["evening_doctrine_leader_id"] = resolve_member("RAMON SERRANO")
                
        elif dow == 3: # Thursday
            # Thursday evening service (SERVICIO)
            if day == 4:
                row["evening_leader_ids"] = [resolve_member("ABIDAN ALVARADO")]
                row["evening_doctrine_leader_id"] = resolve_member("FREDDY RUIZ")
            elif day == 11:
                row["evening_leader_ids"] = [resolve_member("MELQUISEDEC SERRANO")]
                row["evening_doctrine_leader_id"] = resolve_member("ELÍAS RUIZ")
                row["topic"] = "Servicio Inglés"
            elif day == 18:
                row["evening_leader_ids"] = [resolve_member("GERSON ZELAYA")]
                row["evening_doctrine_leader_id"] = resolve_member("LEONEL MARRUFO")
            elif day == 25:
                row["evening_leader_ids"] = [resolve_member("ELÍAS RUIZ")]
                row["evening_doctrine_leader_id"] = resolve_member("MELQUISEDEC SERRANO")
                row["topic"] = "Servicio Inglés"
                
        elif dow == 5: # Saturday
            if day == 13:
                # Children service Saturday June 13
                row["evening_service_type"] = "children"
                # Gabrielle Zelaya is titular but skipped due to spelling Grabriele Zelaya
                row["evening_leader_ids"] = [resolve_member("GABRIELLE ZELAYA")] # will be [] because it's skipped
                row["evening_consecration_leader_id"] = resolve_member("OLIVER MONTANO")
                row["evening_doctrine_leader_id"] = resolve_member("ISAÍ HERNÁNDEZ")
                row["topic"] = "Servicio Niños/Doctrina/Consagración"
            elif day == 6:
                row["evening_leader_ids"] = [resolve_member("JAIRO ZELAYA")]
            elif day == 20:
                row["evening_leader_ids"] = [resolve_member("DANIEL GUTIERREZ")]
            elif day == 27:
                row["evening_leader_ids"] = [resolve_member("MELQUISEDEC SERRANO")]
                
        else: # Mon, Tue, Wed, Fri
            if day == 1:
                row["evening_leader_ids"] = [resolve_member("ABRAHAM DÍAZ")]
            elif day == 2:
                row["evening_leader_ids"] = [resolve_member("ELIAB R. AGUILAR")]
            elif day == 3:
                row["evening_leader_ids"] = [resolve_member("IGNACIO RAMÍREZ")]
            elif day == 5:
                row["evening_leader_ids"] = [resolve_member("PABLO SANTIZO")]
            elif day == 8:
                row["evening_leader_ids"] = [resolve_member("JOSUÉ DÍAZ")]
            elif day == 9:
                row["evening_leader_ids"] = [resolve_member("ELIAB R. AGUILAR")]
            elif day == 10:
                row["evening_leader_ids"] = [resolve_member("MANUEL GUTIERREZ")]
            elif day == 12:
                row["evening_leader_ids"] = [resolve_member("JAIRO ZELAYA")]
            elif day == 15:
                row["evening_leader_ids"] = [resolve_member("ABRAHAM DÍAZ")]
            elif day == 16:
                row["evening_leader_ids"] = [resolve_member("ELIAB R. AGUILAR")]
            elif day == 17:
                row["evening_leader_ids"] = [resolve_member("IGNACIO RAMÍREZ")]
            elif day == 19:
                # Friday June 19 lists two names: ABIDAN ALVARADO, PABLO SANTIZO
                row["evening_leader_ids"] = [resolve_member("ABIDAN ALVARADO"), resolve_member("PABLO SANTIZO")]
            elif day == 22:
                row["evening_leader_ids"] = [resolve_member("JOSUÉ DÍAZ")]
            elif day == 23:
                row["evening_leader_ids"] = [resolve_member("ELIAB R. AGUILAR")]
            elif day == 24:
                row["evening_leader_ids"] = [resolve_member("MANUEL GUTIERREZ")]
            elif day == 26:
                row["evening_leader_ids"] = [resolve_member("JAIRO ZELAYA")]
            elif day == 29:
                row["evening_leader_ids"] = [resolve_member("ABRAHAM DÍAZ")]
            elif day == 30:
                row["evening_leader_ids"] = [resolve_member("ELIAB R. AGUILAR")]

        # Clean empty lists/None IDs from evening_leader_ids
        row["evening_leader_ids"] = [x for x in row["evening_leader_ids"] if x is not None]
        schedule.append(row)
        
    return schedule

def main():
    dry_run = "--dry-run" in sys.argv
    print(f"Mode: {'DRY RUN (Simulation)' if dry_run else 'PRODUCTION UPLOAD'}")
    
    print("Fetching existing schedule to preserve IDs...")
    existing_ids = fetch_existing_schedule()
    print(f"Found {len(existing_ids)} existing rows for June 2026.")
    
    schedule = build_june_schedule(existing_ids)
    
    # Count unresolved slots
    unresolved_slots = 0
    for day in schedule:
        # Check all leader ID fields
        unresolved_in_day = []
        if day["date"] == "2026-06-04" and not day["nine_am_doctrine_leader_id"]:
            unresolved_in_day.append("9am Doctrine (FREDDY RUIZ)")
        if day["date"] == "2026-06-13" and not day["evening_leader_ids"]:
            unresolved_in_day.append("7pm Evening Titular (GABRIELLE ZELAYA)")
        if day["date"] == "2026-06-20" and not day["nine_am_doctrine_leader_id"]:
            unresolved_in_day.append("9am Doctrine (KERIN HERNANDEZ)")
            
        if unresolved_in_day:
            print(f"⚠️ Unresolved slots for {day['date']}: {', '.join(unresolved_in_day)}")
            unresolved_slots += len(unresolved_in_day)
            
    print(f"Total slots left empty for manual review: {unresolved_slots}")
    
    if dry_run:
        print("\n--- DRY RUN OUTPUT SCHEDULE ---")
        for day in schedule:
            print(f"Date: {day['date']} ({day['id'][:8]})")
            print(f"  5 AM: Conductor ID: {day['five_am_leader_id']}")
            print(f"  9 AM: Consecration Conductor: {day['nine_am_consecration_leader_id']}")
            print(f"  9 AM: Doctrine Conductor: {day['nine_am_doctrine_leader_id']}")
            print(f"  7 PM: Leaders: {day['evening_leader_ids']}")
            print(f"  7 PM: Consecration Leader: {day['evening_consecration_leader_id']}")
            print(f"  7 PM: Doctrine Leader: {day['evening_doctrine_leader_id']}")
            print(f"  Type: {day['evening_service_type']}, Time: {day['evening_service_time']}, Topic: '{day['topic']}'")
        print("\nDry Run completed successfully. No changes were made to Supabase.")
    else:
        print(f"\nUpserting {len(schedule)} schedule rows to Supabase...")
        try:
            make_request("POST", "schedule", schedule)
            print("June 2026 schedule successfully upserted to Supabase!")
        except Exception as e:
            print(f"Failed to bulk upsert schedule, trying individually...")
            success_count = 0
            for item in schedule:
                try:
                    make_request("POST", "schedule", [item])
                    success_count += 1
                except Exception as e2:
                    print(f"Failed to upsert date {item['date']}: {e2}")
            print(f"Individual upsert complete. {success_count}/{len(schedule)} rows succeeded.")

if __name__ == '__main__':
    main()
