// helps to track user's position in page

import { useEffect, useState } from "react";

const useScrollPosition = () => {
    const [scrollPosition, setScrollPosititon] = useState(0)
    const [isScrollingUp, setIsScrollingUp] = useState(false)

    useEffect(() => {
        const newPosition = () => {
            if(window.pageYOffset < scrollPosition)  {
                setIsScrollingUp(true)
            } else if(window.pageYOffset > scrollPosition) {
                setIsScrollingUp(false)
            }
            setScrollPosititon(window.pageYOffset)
        }

        window.addEventListener('scroll', newPosition)

        newPosition()

        return () => window.removeEventListener('scroll', newPosition)
    }, [scrollPosition])

    return [scrollPosition, isScrollingUp]
}

export {useScrollPosition} 