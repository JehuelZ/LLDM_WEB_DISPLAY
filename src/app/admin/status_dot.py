import sys

def add_status_dot(path, name_var):
    print(f"Adding dot to {path}...")
    with open(path, 'rb') as f:
        content = f.read()

    # THE EXACT PIECE FROM THE SED/VIEW OUTPUT:
    # 4124: )}>{m.name}</h4>
    
    target = f'>{name_var}.name}}</h4>'.encode('utf-8')
    replacement = (
        f'>{name_var}.name}} '
        f'{{ {name_var}.status === "Activo" && <span className="inline-block w-2 h-2 rounded-full bg-[#10b981] ml-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Activo" /> }}'
        f'</h4>'
    ).encode('utf-8')

    content = content.replace(target, replacement)

    with open(path, 'wb') as f:
        f.write(content)
    print(f"Done with {path}.")

add_status_dot('/Users/hardglobal/Documents/LLDM_RODEO_APP/src/app/admin/page.tsx', '{m')
add_status_dot('/Users/hardglobal/Documents/LLDM_RODEO_APP/src/app/admin/TactileAdmin.tsx', '{member')
