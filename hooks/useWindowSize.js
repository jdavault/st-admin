import {useState, useEffect} from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const toCssSize = width => {
    switch (true) {
      case width < 768:
        return 'xs';
      case width < 991:
        return 'sm';
      case width < 1199:
        return 'md';
    }

    return 'lg';
  };

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        size: toCssSize(window.innerWidth),
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
