import { describe, expect, it } from 'vitest';
import { DEFAULT_COMPANY_NAME, PRODUCT_NAME, resolveProductBranding } from '@/lib/productBrand';
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_PRIMARY_FOREGROUND_COLOR,
} from '@/lib/brandTheme';

describe('OBAOL Supreme product identity', () => {
  it('uses the approved product and company names', () => {
    expect(PRODUCT_NAME).toBe('OBAOL Supreme ATS');
    expect(DEFAULT_COMPANY_NAME).toBe('OBAOL Supreme');
  });

  it('uses the official accessible brand pair', () => {
    expect(DEFAULT_PRIMARY_COLOR).toBe('#CF983C');
    expect(DEFAULT_PRIMARY_FOREGROUND_COLOR).toBe('#0E0D0A');
  });

  it('upgrades persisted legacy defaults without replacing custom branding', () => {
    expect(resolveProductBranding({ primary_color: '#D64541', primary_foreground_color: '#FFFFFF' }))
      .toMatchObject({ primary_color: '#CF983C', primary_foreground_color: '#0E0D0A' });
    expect(resolveProductBranding({ primary_color: '#123456', primary_foreground_color: '#FEDCBA' }))
      .toMatchObject({ primary_color: '#123456', primary_foreground_color: '#FEDCBA' });
  });
});
