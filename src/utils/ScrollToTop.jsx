import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ containerRef }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    containerRef && containerRef.current.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
