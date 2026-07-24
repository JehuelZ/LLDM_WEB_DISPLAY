import React from 'react';

/**
 * Componente ChurchIcon personalizado para LLDM Rodeo.
 * Reemplaza el icono por defecto de Lucide (que incluye una cruz) por una casa de oración con la Flama Sagrada.
 */
export function ChurchIcon({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Estructura del Templo / Casa de Oración LLDM */}
      <path d="M18 22V8l-6-4-6 4v14" />
      <path d="M14 22v-4a2 2 0 0 0-4 0v4" />
      <path d="M18 22h4V10l-4-2" />
      <path d="M6 22H2V10l4-2" />
      
      {/* Flama en lugar de Cruz */}
      <path d="M12 3c.8-1 2-1 2 0 0 1.2-1 2-2 3.5C11 5 10 4.2 10 3c0-1 1.2-1 2 0z" />
    </svg>
  );
}

export default ChurchIcon;
