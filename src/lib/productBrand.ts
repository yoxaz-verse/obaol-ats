export const PRODUCT_NAME = 'OBAOL Supreme ATS';
export const DEFAULT_COMPANY_NAME = 'OBAOL Supreme';
export const PRODUCT_TAGLINE = 'Talent Acquisition for OBAOL Companies';
export const OBAOL_WEBSITE_URL = 'https://www.obaol.com/';

export interface ProductBranding {
  logo_desktop_url: string | null;
  logo_mobile_url: string | null;
  company_name: string;
  primary_color: string;
  primary_foreground_color: string;
}

export const DEFAULT_PRODUCT_BRANDING: ProductBranding = {
  logo_desktop_url: null,
  logo_mobile_url: null,
  company_name: DEFAULT_COMPANY_NAME,
  primary_color: '#CF983C',
  primary_foreground_color: '#0E0D0A',
};

const LEGACY_DEFAULT_PRIMARY_COLORS = new Set(['#D64541', '#D99A3A']);

export function resolveProductBranding(raw?: Partial<ProductBranding>): ProductBranding {
  const rawPrimary = raw?.primary_color?.trim().toUpperCase();
  const usesLegacyDefault = !!rawPrimary && LEGACY_DEFAULT_PRIMARY_COLORS.has(rawPrimary);

  return {
    logo_desktop_url: raw?.logo_desktop_url || null,
    logo_mobile_url: raw?.logo_mobile_url || null,
    company_name: raw?.company_name?.trim() || DEFAULT_COMPANY_NAME,
    primary_color: !rawPrimary || usesLegacyDefault ? '#CF983C' : rawPrimary,
    primary_foreground_color: usesLegacyDefault
      ? '#0E0D0A'
      : raw?.primary_foreground_color || '#0E0D0A',
  };
}
