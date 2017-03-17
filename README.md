# invoiceman
Obtiene el formato generico de una factura a partir de un documento XML (PAX Facturación), con las normas fiscales aplicadas en México.

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
  pdf: "./output.pdf",
  logo: "./logoPrixz.png",
  esArchivo: true, // false to send content XML format
  xml: "./test.xml" // Or XML content and esArchivo to false
};

invoiceman.generate(options, function (err, data) {
  if (err) throw err;
  // Do stuffs with data and your new PDF file is on your output path
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
