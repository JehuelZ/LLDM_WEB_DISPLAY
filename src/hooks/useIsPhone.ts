import { useState, useEffect } from 'react';

/**
 * Hook to detect if the device is a phone (small screen)
 * Focuses on width < 768px (standard mobile/tablet breakpoint)
 */
export function useIsPhone() {
    const [isPhone, setIsPhone] = useState(false);

    useEffect(() => {
        const check = () => {
            setIsPhone(window.innerWidth < 768);
        };

        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return isPhone;
}
