import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

/**
 * Returns true while Inertia is processing a page visit (navigation,
 * filter change, pagination, etc.) and false when the response is ready.
 */
export default function usePageLoading() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const removeStart  = router.on('start',  () => setLoading(true));
        const removeFinish = router.on('finish', () => setLoading(false));

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return loading;
}
