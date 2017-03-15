# invoiceman
Obtiene el formato generico de una factura a partir de un objeto JSON, con las normas fiscales aplicadas en México.

### Instalación
```
npm install invoiceman
```
### Uso
```javascript
var invoiceman = require('invoiceman');

invoiceman.generate(options, function (err, data) {
  if (err) throw err;
  // Do stuffs with data.
});
```
### Ejemplo
```javascript
var invoiceman = require('invoiceman');

var options = {
  archivo: "./output.pdf",
  factura: {
    folio_fiscal: "10920292029029",
    folio: "A3424",
    lugar_emision: "México. Ciudad de México",
    fecha_emision: "30 de marzo de 2017",
    conceptos: [
      {
        clave: "50",
        unidad: "MXN",
        descripcion: "Bombas y Motores / BOMBA / BOMBA PARA AGUA 1/4 HP",
        cantidad: "2",
        precio: "1,300",
        total: "2,600"
      }
    ],
    total_letra: "Dos mil setecientos treinta pesos 00/100.-MXN",
    forma_pago: "Pago en una sola exhibición.",
    metodo_pago: "Efectivo",
    subtotal: "2,600",
    total: "2,730",
    iva: "286",
    sello_digital_SAT: "p73ydst3e8kjCmDCHOQnk6w27GyrI25Q254quh5yKb/4bh3+OeR4zSEMCaKlTt1Qm/SXxwlPH8ZbhHiyO+6bElESbE8vyq0BZbA4okdWkeYfRx7baTDeKyWjeMuTP4ZWVBjaFm/lsQ3JUW5XrvbNrGzZ1FzAZO9SrMpuTV1Tdrg=",
    cadena_sat: "|1.0|950ed933-7778-45f2-a6a2-606c25070228|2012-01-30T13:37:41|VcBEvS9walty2AVXhEws7MjTN3EStH6/f5zL7cW8qdtCdd/5iO3A4gI9FRUIKlIKadDA1QQlVGyreRTr2bqkv9PGNm3YUOasfsxaPitw18M2or4tyUJPL1zgXcolyiaK0cPeuZb/zG+NnqUF+O5wK5zEXVN0YLou5FT+eSJzZhg=|20001000000100004045"
  },
  emisor: {
    logo: "./logoPrixz.png",
    empresa: "Operadora Prixz S.A de C.V",
    direccion: "Calle 39 Num 21 Int 1, Col Valentin Gomez Farias, CP. 15010, Del. Venustiano Carranza, Ciudad de México",
    rfc: "PIHB720202SB4",
    sello_digital: "VcBEvS9walty2AVXhEws7MjTN3EStH6/f5zL7cW8qdtCdd/5iO3A4gI9FRUIKlIKadDA1QQlVGyreRTr2bqkv9PGNm3YUOasfsxaPitw18M2or4tyUJPL1zgXcolyiaK0cPeuZb/zG+NnqUF+O5wK5zEXVN0YLou5FT+eSJzZhg="
  },
  receptor: {
    empresa: "Ferrera S.A de C.V",
    direccion: "libertad No. 800 Colonia centro Chihuahua, Chihuahua, Chihuahua. Mexico C.P. 35000",
    rfc: "RRR701013VVV"
  }
};

nearbypoint.nearby(request, function (err, data) {
  if (err) throw err;
  // Do stuffs with data.
});
```
### Respuesta OK
```json
{ 
  "success": true, 
  "message": "PDF Created on /output.pdf" 
}
```
### Respuesta error
```json
{
  "success": false,
  "message": "Error interno"
}
```
### Test
```
npm test
```
