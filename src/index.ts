// facturahub-verifactu-qr — Genera el QR de verificación Veri*Factu de la AEAT.
// URL de cotejo según la Orden HAC/1177/2024 + render del QR (nivel M, ISO/IEC 18004).

import QRCode from 'qrcode';

/** Endpoints oficiales de cotejo de la AEAT. */
export const VALIDAR_QR_URL = {
  produccion: 'https://www2.agenciatributaria.gob.es/wlpl/TIKE-CONT/ValidarQR',
  pruebas: 'https://prewww2.aeat.es/wlpl/TIKE-CONT/ValidarQR',
} as const;

export interface VerifactuQRData {
  /** NIF del emisor. */
  nif: string;
  /** Serie + número de la factura, p. ej. "FC-2026/0042". */
  numSerie: string;
  /** Fecha de expedición en formato dd-mm-aaaa. */
  fecha: string;
  /** Importe total (se serializa con punto decimal, p. ej. 1210.00). */
  importe: string | number;
  /** true para usar el entorno de pruebas. */
  test?: boolean;
}

/** Nivel de corrección de errores exigido por la AEAT (ISO/IEC 18004 nivel M). */
export const QR_OPTIONS = { errorCorrectionLevel: 'M' } as const;

function importeStr(v: string | number): string {
  return typeof v === 'number' ? v.toFixed(2) : v;
}

/** Construye la URL de verificación que va dentro del QR. */
export function buildVerifactuURL(data: VerifactuQRData): string {
  const base = data.test ? VALIDAR_QR_URL.pruebas : VALIDAR_QR_URL.produccion;
  const params = new URLSearchParams({
    nif: data.nif,
    numserie: data.numSerie,
    fecha: data.fecha,
    importe: importeStr(data.importe),
  });
  return `${base}?${params.toString()}`;
}

export interface ParsedVerifactuURL {
  nif: string;
  numSerie: string;
  fecha: string;
  importe: string;
}

/** Parsea una URL de cotejo Veri*Factu. Devuelve null si no es válida. */
export function parseVerifactuURL(url: string): ParsedVerifactuURL | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (!u.pathname.endsWith('/ValidarQR')) return null;
  const nif = u.searchParams.get('nif');
  const numSerie = u.searchParams.get('numserie');
  const fecha = u.searchParams.get('fecha');
  const importe = u.searchParams.get('importe');
  if (!nif || !numSerie || !fecha || !importe) return null;
  return { nif, numSerie, fecha, importe };
}

/** Genera el QR Veri*Factu como data URL PNG (nivel M). */
export function verifactuQRDataURL(data: VerifactuQRData): Promise<string> {
  return QRCode.toDataURL(buildVerifactuURL(data), { ...QR_OPTIONS });
}

/** Genera el QR Veri*Factu como cadena SVG (nivel M). */
export function verifactuQRSVG(data: VerifactuQRData): Promise<string> {
  return QRCode.toString(buildVerifactuURL(data), { type: 'svg', ...QR_OPTIONS });
}
