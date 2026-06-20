import { describe, it, expect } from 'vitest';
import { buildVerifactuURL, parseVerifactuURL, verifactuQRDataURL, verifactuQRSVG, VALIDAR_QR_URL } from './index';

const data = { nif: 'B12345678', numSerie: 'FC-2026/0042', fecha: '18-05-2026', importe: 1210 };

describe('buildVerifactuURL', () => {
  it('usa el endpoint de producción y codifica los parámetros', () => {
    const url = buildVerifactuURL(data);
    expect(url.startsWith(VALIDAR_QR_URL.produccion + '?')).toBe(true);
    expect(url).toContain('nif=B12345678');
    expect(url).toContain('importe=1210.00');
    // la barra del número de serie va codificada
    expect(url).toContain('numserie=FC-2026%2F0042');
  });
  it('soporta entorno de pruebas', () => {
    expect(buildVerifactuURL({ ...data, test: true }).startsWith(VALIDAR_QR_URL.pruebas)).toBe(true);
  });
});

describe('parseVerifactuURL', () => {
  it('ida y vuelta', () => {
    expect(parseVerifactuURL(buildVerifactuURL(data))).toEqual({
      nif: 'B12345678', numSerie: 'FC-2026/0042', fecha: '18-05-2026', importe: '1210.00',
    });
  });
  it('null si no es una URL de cotejo', () => {
    expect(parseVerifactuURL('https://example.com')).toBeNull();
    expect(parseVerifactuURL('nope')).toBeNull();
  });
});

describe('render', () => {
  it('genera data URL PNG', async () => {
    const png = await verifactuQRDataURL(data);
    expect(png.startsWith('data:image/png;base64,')).toBe(true);
  });
  it('genera SVG', async () => {
    const svg = await verifactuQRSVG(data);
    expect(svg).toContain('<svg');
  });
});
