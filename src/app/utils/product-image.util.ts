import { Product } from '../models/product.model';

const PRODUCT_PALETTES = [
  { background: '#e8f5e9', primary: '#2e7d32' },
  { background: '#fff8e1', primary: '#f9a825' },
  { background: '#f3e5f5', primary: '#8e24aa' },
  { background: '#fff3e0', primary: '#ef6c00' },
  { background: '#e0f2f1', primary: '#00897b' },
  { background: '#efebe9', primary: '#6d4c41' },
] as const;

export function createProductImageDataUrl(
  product: Pick<Product, 'id' | 'name'>,
): string {
  const paletteIndex = Math.abs(product.id - 1) % PRODUCT_PALETTES.length;
  const palette = PRODUCT_PALETTES[paletteIndex];
  const label = createLabel(product.name);
  const packageLabel = createPackageLabel(product.name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" role="img" aria-label="${label}"><rect width="360" height="220" rx="20" fill="${palette.background}"/><circle cx="180" cy="92" r="66" fill="${palette.primary}" opacity=".16"/><rect x="125" y="42" width="110" height="108" rx="18" fill="${palette.primary}"/><rect x="139" y="57" width="82" height="56" rx="9" fill="white" opacity=".9"/><path d="M150 128h60" stroke="white" stroke-width="10" stroke-linecap="round"/><text x="180" y="91" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="${palette.primary}">${packageLabel}</text><text x="180" y="190" text-anchor="middle" font-family="Arial,sans-serif" font-size="21" font-weight="700" fill="#263238">${label}</text></svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createLabel(name: string): string {
  return escapeXml(
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join(' ')
      .slice(0, 12)
      .toUpperCase(),
  );
}

function createPackageLabel(name: string): string {
  return escapeXml(
    name
      .trim()
      .split(/\s+/)[0]
      ?.slice(0, 8)
      .toUpperCase() ?? 'PRODUK',
  );
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
