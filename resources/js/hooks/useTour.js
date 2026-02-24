import { useState, useEffect, useCallback } from 'react';

const PREFIX = 'inv_tour_';
const NAV_DONE_EVENT = 'inv_nav_tour_done';

function hasSeen(name) {
    try {
        return !!localStorage.getItem(PREFIX + name);
    } catch {
        return true; // If localStorage is unavailable, suppress all tours
    }
}

function markSeen(name) {
    try {
        localStorage.setItem(PREFIX + name, '1');
    } catch {}
}

/**
 * Hook for the global navigation tour (AppLayout).
 *
 * - Opens automatically 700ms after first mount (one-time per browser).
 * - Exposes `finish` (user completed all steps) which dispatches an event
 *   so waiting page tours can immediately begin.
 * - Exposes `dismiss` (user closed via ×) which marks as seen WITHOUT
 *   dispatching the event — page tours will start on the next page visit.
 */
export function useNavTour() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (hasSeen('nav')) return;
        const timer = setTimeout(() => setOpen(true), 700);
        return () => clearTimeout(timer);
    }, []);

    const finish = useCallback(() => {
        markSeen('nav');
        setOpen(false);
        window.dispatchEvent(new CustomEvent(NAV_DONE_EVENT));
    }, []);

    const dismiss = useCallback(() => {
        markSeen('nav');
        setOpen(false);
        // No event dispatch — page tours start fresh on next page visit
    }, []);

    return { open, finish, dismiss };
}

/**
 * Hook for individual page tours.
 *
 * - Will not open while `loading` is true (skeleton visible).
 * - If the nav tour is already done, opens after a 400ms delay on mount.
 * - If the nav tour hasn't been done yet, listens for its completion event
 *   and opens 300ms after the user finishes the nav tour (same session).
 */
export function usePageTour(name, loading = false) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (loading || hasSeen(name)) return;

        if (hasSeen('nav')) {
            // Nav tour already done — start this page tour after a short delay
            const timer = setTimeout(() => setOpen(true), 400);
            return () => clearTimeout(timer);
        }

        // Wait for the nav tour to emit its "finished" event
        const onNavDone = () => {
            if (!hasSeen(name)) {
                setTimeout(() => setOpen(true), 300);
            }
        };
        window.addEventListener(NAV_DONE_EVENT, onNavDone);
        return () => window.removeEventListener(NAV_DONE_EVENT, onNavDone);
    }, [loading, name]);

    const finish = useCallback(() => {
        markSeen(name);
        setOpen(false);
    }, [name]);

    return { open, finish };
}
