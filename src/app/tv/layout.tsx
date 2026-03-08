
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "LLDM Rodeo - TV Mode",
    description: "Modo de alto rendimiento para Smart TVs",
};

export default function TVLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen w-screen overflow-hidden bg-black text-white">
            {children}
        </div>
    );
}
