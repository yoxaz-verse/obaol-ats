import { useEffect } from "react";
import { PRODUCT_NAME } from "@/lib/productBrand";

export { PRODUCT_NAME };

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${PRODUCT_NAME}` : PRODUCT_NAME;
    return () => {
      document.title = PRODUCT_NAME;
    };
  }, [title]);
}
