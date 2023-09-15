// helps to indicate when user is clicking outside specific container

import {useRef, useEffect} from 'react'

const useOutsideClick = (callback) => {
    const ref = useRef();
    
    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                
                callback();
            }

            // First variant with ref.current (I don't think it's useful cuz I usually write e.stopPropagation() on ref block)

            // if (ref.current && !ref.current.contains(event.target)) {
            //     callback();
            // }
        };
    
        document.addEventListener('click', handleClick, true);
    
        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, [ref]);
    
    return ref;
};

export {useOutsideClick}