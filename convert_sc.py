import json
import sys

def convert():
    try:
        with open('schedule_all.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("schedule_raw.json not found")
        return

    output = []
    for date, entry in data.items():
        slots = entry.get('slots', {})
        
        row = {
            "date": date
        }
        
        # 5am
        five_am = slots.get('5am', {})
        if five_am.get('leaderId'):
            row["five_am_leader_id"] = five_am.get('leaderId')
        row["five_am_custom_label"] = five_am.get('customLabel')
        
        # 9am
        nine_am = slots.get('9am', {})
        if nine_am.get('consecrationLeaderId'):
            row["nine_am_consec_leader_id"] = nine_am.get('consecrationLeaderId')
        if nine_am.get('doctrineLeaderId'):
            row["nine_am_doct_leader_id"] = nine_am.get('doctrineLeaderId')
        row["nine_am_custom_label"] = nine_am.get('customLabel')
        row["nine_am_sunday_type"] = nine_am.get('sundayType')
        
        # evening
        evening = slots.get('evening', {})
        row["evening_type"] = evening.get('type')
        row["evening_time"] = evening.get('time')
        row["evening_end_time"] = evening.get('endTime')
        row["evening_language"] = evening.get('language')
        row["evening_topic"] = evening.get('topic')
        row["evening_custom_label"] = evening.get('customLabel')
        
        leader_ids = evening.get('leaderIds', [])
        if len(leader_ids) > 0:
            row["evening_leader_id_1"] = leader_ids[0]
        if len(leader_ids) > 1:
            row["evening_leader_id_2"] = leader_ids[1]

        output.append(row)

    with open('schedule_payload.json', 'w') as f:
        json.dump(output, f, indent=2)

convert()
