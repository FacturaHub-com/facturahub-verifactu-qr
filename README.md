# @facturahub/verifactu-qr

> Genera el **QR de verificación Veri*Factu** de la AEAT: la URL de cotejo + la imagen (PNG/SVG, nivel M). Para facturas en España. MIT.

## Instalación

```bash
npm i @facturahub/verifactu-qr
```

## Uso

```ts
import { buildVerifactuURL, verifactuQRDataURL } from '@facturahub/verifactu-qr';

const data = { nif: 'B12345678', numSerie: 'FC-2026/0042', fecha: '18-05-2026', importe: 1210 };

buildVerifactuURL(data);
// https://www2.agenciatributaria.gob.es/wlpl/TIKE-CONT/ValidarQR?nif=B12345678&numserie=FC-2026%2F0042&fecha=18-05-2026&importe=1210.00

const png = await verifactuQRDataURL(data);   // data:image/png;base64,...  → <img src=png>
```

## API

| Función | Qué hace |
|---|---|
| `buildVerifactuURL(data)` | URL de cotejo (el contenido del QR) |
| `parseVerifactuURL(url)` | Desglosa una URL de cotejo (o `null`) |
| `verifactuQRDataURL(data)` | `Promise<string>` — QR como data URL PNG |
| `verifactuQRSVG(data)` | `Promise<string>` — QR como SVG |
| `VALIDAR_QR_URL` | Endpoints AEAT (producción / pruebas) |
| `QR_OPTIONS` | Nivel de corrección M (ISO/IEC 18004) |

`fecha` en formato `dd-mm-aaaa`; `importe` se serializa con punto decimal. La barra del nº de factura se codifica sola.

## Cómo funciona

Desde 2027, las facturas de un sistema Veri*Factu llevan un QR que apunta al servicio de cotejo de la AEAT con el NIF, el número de factura, la fecha y el importe. Base legal: Orden HAC/1177/2024 (cap. VIII), codificación ISO/IEC 18004 nivel M.

> Documentación técnica, no asesoramiento fiscal. Verifica la especificación vigente en la sede de la AEAT.

---

Hecho por [**FacturaHub**](https://facturahub.com?utm_source=npm&utm_medium=referral&utm_campaign=verifactu-qr) — facturación con IA para autónomos en España: el QR Veri*Factu, ya incluido y gratis. Guía: [github.com/FacturaHub-com/facturahub-verifactu](https://github.com/FacturaHub-com/facturahub-verifactu).
