// scrolling page to 0.0 coordinates when user redirects to a new page

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname]);

    return null
}