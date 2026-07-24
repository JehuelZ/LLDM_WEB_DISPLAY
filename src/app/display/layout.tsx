
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "LLDM Rodeo - Proyección",
    description: "Modo de pantalla completa para proyección",
    robots: {
        index: false,
        follow: false,
    },
};

export default function DisplayLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
            {children}
        </div>
    );
}
