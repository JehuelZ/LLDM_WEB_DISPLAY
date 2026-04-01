/**
 * Type patch for framer-motion v11 + React 19 compatibility.
 *
 * In framer-motion v11, the internal HTMLAttributesWithoutMotionProps type
 * was narrowed in a way that breaks className and other standard HTML props
 * under React 19's stricter type checking. This module augmentation restores
 * the expected behavior without touching any component code.
 */

import React from 'react';
import 'framer-motion';

declare module 'framer-motion' {
    // Re-export HTMLMotionProps with full HTML attributes to restore className,
    // style, id, and all other standard DOM props that are used throughout the app.
    export interface MotionProps extends React.HTMLAttributes<HTMLElement> {}
}
