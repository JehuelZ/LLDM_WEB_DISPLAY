import json

# Mapping Names to IDs from live_profiles.json
mapping = {
    "Abraham Díaz": "035044e4-e2f4-4fa3-a2f6-3507cf2a1a30",
    "Pablo Santizo": "be4d631c-34f7-4405-bc4c-c800c8381cb4",
    "Jairo Zelaya": "75e197b1-19a9-41e2-9d32-d8dd2d7fd44d",
    "Eliab R. Aguilar": "ac5c4c67-4999-4244-b895-09cf1d62bd54",
    "Josué Díaz": "293e5cbf-fe74-4b79-8b16-a90b16dad8f0",
    "Leonel Marrufo": "9c8af082-f9ba-4bef-840e-b53d22b21b49",
    "Esteban Serrano": "00db7500-7397-4580-b81d-e0055f1249a7",
    "Manuel Díaz": "2d0ceeb0-9421-4797-9aba-33a2d751916d",
    "Ignacio Ramírez": "a5fb1fa4-9910-4a9a-aa8a-4fd88ccd7b9b",
    "Abidan Alvarado": "f10453d9-6ecd-4fa5-ab91-f182a7a1a65d",
    "Gerson Zelaya": "41d36c06-5a5c-4770-b6cf-03cdeecd3f9e",
    "Daniel Gutierrez": "d0851fdf-bcdc-4e1a-bbfa-38678cbf98f6",
    "Manuel Gutierrez": "a09ba6cd-a8ea-4b6e-868c-db540b7d577a",
    "Melquisedec Serrano": "55d5ccdf-073b-491e-b34c-fd091eb06bb1",
    "Elias Ruiz": "657efb04-836d-42d7-8b11-8d749221df98",
    "Freddy Ruiz": "3968c3be-b475-46db-91e2-3d180007a552",
    "Gabrielle Zelaya": "e6c98339-f601-4460-b593-b8c349a8b145",
    "Isai Hernández": "42e55c48-4cef-4a8b-9705-ab6b5d15c515",
    "Oliver Montano": "3fa5fa52-f02e-4827-a18f-19fda514794c",
    "Jesse Hernández": "54a438dd-afbd-4f06-90a7-6936c9aaedb3",
    "Ramon Serrano": "0668528d-37a9-4864-964f-ab2a6166cda4",
    "Timothy Zelaya": "983fd2bd-4997-433b-b6ee-c71fe16f36ba",
    "Freddy Ruiz Jr.": "00cd3461-bb0c-47ac-8dc8-d84b97d858a1",
    "Naason Alvarado": "98325dd2-dace-40da-92b8-264292a73dcf",
    "Amisadai Alvarado": "ab6e287f-2986-4644-8114-f31d18c906dd",
    "Raama Chasova": "3220ac06-4b9b-417f-adc7-a726fac26657",
    "Judith Chasova": "93764c38-3160-4b85-b0af-328969d708cd",
    "Edelvira Belloso": "1bef514e-8dd1-4ad1-b37b-16386cf2729c",
    "Mayra Montano": "aea97ce6-654f-4bd4-b4ac-257de893118c",
    "Maria Gutierrez": "255351e3-4196-44ee-a292-e11880caff25",
    "Sibia Marrufo": "a7118d7d-f7eb-4c75-b7be-eb94e3ac06fa",
    "Socorro Ruiz": "b6fa5af6-9888-41c8-9927-09196f6d70cc",
    "Rhode Adan": "e1f36e1d-6869-49c8-84cf-91ccf8fe4dbd",
    "Rosa Ramirez": "738f3741-9832-4fab-bef9-12da1e3cc165",
    "Rebeca Ramirez": "105ffc65-7124-46da-913d-809d8e4c14dd",
    "Abigail Hernandez": "c04cd5fc-5c31-47ce-b3dc-c73e2ed6a306",
    "Kerin Hernandez": "22e7cd9e-53ea-4fa6-99d5-6e822eabd00b",
    "Jasibe Aguilar": "f539f33f-7977-4766-afe9-837d9eb29dbb",
    "Hanai Aguilar": "5b95d9a5-24dc-443c-854f-eba9c3c4ba23",
    "Mareli Montano": "997ce433-c5d2-416a-9810-5cce133dcac0",
    "Evelin Montano": "a5e2a38d-f9c1-4dd1-9598-50b402fdee72",
    "Lucia Zelaya": "c581eb3c-cb8c-4ac6-afff-0e32039654ca",
}

may_schedule = []

def add_day(date, five_am=None, nine_am_1=None, nine_am_2=None, evening_type="regular", evening_ids=None, topic="", custom_label=""):
    day = {
        "date": date,
        "five_am_leader_id": mapping.get(five_am) if five_am else None,
        "nine_am_consecration_leader_id": mapping.get(nine_am_1) if nine_am_1 else None,
        "nine_am_doctrine_leader_id": mapping.get(nine_am_2) if nine_am_2 else None,
        "evening_service_type": evening_type,
        "evening_leader_ids": [mapping.get(name) for name in evening_ids if mapping.get(name)] if evening_ids else [],
        "topic": topic,
        "evening_custom_label": custom_label
    }
    may_schedule.append(day)

# Friday 1
add_day("2026-05-01", five_am="Abraham Díaz", nine_am_1="Amisadai Alvarado", evening_ids=["Pablo Santizo"])
# Saturday 2
add_day("2026-05-02", five_am="Jairo Zelaya", nine_am_1="Raama Chasova", nine_am_2="Judith Chasova", evening_ids=["Jairo Zelaya"])
# Sunday 3
add_day("2026-05-03", five_am="Eliab R. Aguilar", nine_am_1="Josué Díaz", nine_am_2="Leonel Marrufo", topic="Dominical")
# Monday 4
add_day("2026-05-04", five_am="Leonel Marrufo", nine_am_1="Edelvira Belloso", nine_am_2="Mayra Montano", evening_ids=["Abraham Díaz"])
# Tuesday 5
add_day("2026-05-05", five_am="Esteban Serrano", nine_am_1="Maria Gutierrez", nine_am_2="Sibia Marrufo", evening_ids=["Eliab R. Aguilar"])
# Wednesday 6
add_day("2026-05-06", five_am="Manuel Díaz", nine_am_1="Lucia Zelaya", nine_am_2="Socorro Ruiz", evening_ids=["Ignacio Ramírez"])
# Thursday 7
add_day("2026-05-07", five_am="Josué Díaz", nine_am_1="Rhode Adan", evening_ids=["Abidan Alvarado"], nine_am_2="Eliab R. Aguilar", topic="Servicio/Doctrina")
# Friday 8
add_day("2026-05-08", five_am="Abraham Díaz", nine_am_1="Judith Chasova", evening_ids=["Jairo Zelaya"])
# Saturday 9
add_day("2026-05-09", five_am="Gerson Zelaya", nine_am_1="Rosa Ramirez", nine_am_2="Rebeca Ramirez", evening_ids=["Daniel Gutierrez"])
# Sunday 10
add_day("2026-05-10", five_am="Eliab R. Aguilar", evening_ids=["Abidan Alvarado"], evening_type="consecration", topic="Consagración 8 PM")
# Monday 11
add_day("2026-05-11", five_am="Leonel Marrufo", nine_am_1="Edelvira Belloso", nine_am_2="Mayra Montano", evening_ids=["Josué Díaz"])
# Tuesday 12
add_day("2026-05-12", five_am="Esteban Serrano", nine_am_1="Sibia Marrufo", nine_am_2="Maria Gutierrez", evening_ids=["Eliab R. Aguilar"])
# Wednesday 13
add_day("2026-05-13", five_am="Manuel Díaz", nine_am_1="Socorro Ruiz", nine_am_2="Lucia Zelaya", evening_ids=["Manuel Gutierrez"])
# Thursday 14
add_day("2026-05-14", five_am="Josué Díaz", nine_am_1="Rhode Adan", evening_ids=["Melquisedec Serrano"], nine_am_2="Elias Ruiz", topic="Servicio Ingles/Doctrina")
# Friday 15
add_day("2026-05-15", five_am="Abraham Díaz", nine_am_1="Amisadai Alvarado", evening_ids=["Abidan Alvarado", "Freddy Ruiz"])
# Saturday 16
add_day("2026-05-16", five_am="Elias Ruiz", nine_am_1="Abigail Hernandez", nine_am_2="Isai Hernández", evening_ids=["Gabrielle Zelaya"], topic="Servicio Niños/Doctrina")
# Sunday 17
add_day("2026-05-17", five_am="Eliab R. Aguilar", nine_am_1="Jesse Hernández", nine_am_2="Ramon Serrano", topic="Dominical")
# Monday 18
add_day("2026-05-18", five_am="Leonel Marrufo", nine_am_1="Edelvira Belloso", nine_am_2="Mayra Montano", evening_ids=["Abraham Díaz"])
# Tuesday 19
add_day("2026-05-19", five_am="Esteban Serrano", nine_am_1="Maria Gutierrez", nine_am_2="Sibia Marrufo", evening_ids=["Eliab R. Aguilar"])
# Wednesday 20
add_day("2026-05-20", five_am="Manuel Díaz", nine_am_1="Lucia Zelaya", nine_am_2="Socorro Ruiz", evening_ids=["Ignacio Ramírez"])
# Thursday 21
add_day("2026-05-21", five_am="Josué Díaz", nine_am_1="Rhode Adan", evening_ids=["Gerson Zelaya"], nine_am_2="Leonel Marrufo", topic="Servicio/Doctrina")
# Friday 22
add_day("2026-05-22", five_am="Abraham Díaz", nine_am_1="Judith Chasova", evening_ids=["Jairo Zelaya"])
# Saturday 23
add_day("2026-05-23", five_am="Timothy Zelaya", nine_am_1="Jasibe Aguilar", nine_am_2="Hanai Aguilar", evening_ids=["Esteban Serrano"])
# Sunday 24
add_day("2026-05-24", five_am="Eliab R. Aguilar", nine_am_1="Freddy Ruiz Jr.", nine_am_2="Freddy Ruiz", topic="Dominical")
# Monday 25
add_day("2026-05-25", five_am="Leonel Marrufo", nine_am_1="Edelvira Belloso", nine_am_2="Mayra Montano", evening_ids=["Josué Díaz"])
# Tuesday 26
add_day("2026-05-26", five_am="Esteban Serrano", nine_am_1="Sibia Marrufo", nine_am_2="Maria Gutierrez", evening_ids=["Eliab R. Aguilar"])
# Wednesday 27
add_day("2026-05-27", five_am="Manuel Díaz", nine_am_1="Socorro Ruiz", nine_am_2="Lucia Zelaya", evening_ids=["Manuel Gutierrez"])
# Thursday 28
add_day("2026-05-28", five_am="Josué Díaz", nine_am_1="Rhode Adan", evening_ids=["Elias Ruiz"], nine_am_2="Melquisedec Serrano", topic="Servicio Ingles/Doctrina")
# Friday 29
add_day("2026-05-29", five_am="Abraham Díaz", nine_am_1="Amisadai Alvarado", evening_ids=["Pablo Santizo"])
# Saturday 30
add_day("2026-05-30", five_am="Abidan Alvarado", nine_am_1="Mareli Montano", nine_am_2="Naason Alvarado", evening_ids=["Oliver Montano"], topic="Servicio Niños/Doctrina/Consagración")
# Sunday 31
add_day("2026-05-31", five_am="Eliab R. Aguilar", nine_am_1="Ramon Serrano", nine_am_2="Jairo Zelaya", topic="Dominical")

with open('may_schedule_payload.json', 'w') as f:
    json.dump(may_schedule, f, indent=2)

print("Payload generated: may_schedule_payload.json")
