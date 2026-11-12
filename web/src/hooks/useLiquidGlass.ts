import { useEffect, useState } from "react";

type NavigatorWithBrands = Navigator & { userAgentData?: { brands?: { brand: string }[] } };

export function useLiquidGlass() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const brands = (navigator as NavigatorWithBrands).userAgentData?.brands;
    const chromium = !!brands?.some(b => /Chromium|Chrome|Edge/.test(b.brand));
    document.documentElement.classList.toggle("lq", chromium);

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return { reducedMotion };
}
