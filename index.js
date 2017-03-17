var PDFDocument = require('pdfkit'),
    parser      = require('xml2json'),
    fs          = require('fs'),
    _           = require('lodash')

module.exports = {
  generate: function (options, callback) {
    try {
      // Data transformation
      fs.readFile(options.xml, function (errFile, data) {
        if (errFile) {
          console.log(errFile);
          callback(errFile);
          return;
        }
        var optionsXML = {
          trim: true,
          sanitize: true
        }
        var json            = JSON.parse(parser.toJson(data, optionsXML));
        var datos           = json["cfdi:Comprobante"];
        var emisor          = datos["cfdi:Emisor"];
        var direccionFiscal = emisor["cfdi:DomicilioFiscal"];
        var receptor        = datos["cfdi:Receptor"];
        var direccion       = receptor["cfdi:Domicilio"];
        var conceptos       = datos["cfdi:Conceptos"];
        var impuestos       = datos["cfdi:Impuestos"];
        var retenciones     = impuestos["cfdi:Retenciones"];
        var retencion       = retenciones["cfdi:Retencion"];
        var complemento     = datos["cfdi:Complemento"];
        var timbreFiscal    = complemento["tfd:TimbreFiscalDigital"];

        var direccionFiscalCompleta = direccionFiscal.calle + ' ' + direccionFiscal.noExterior + ' ' +
            direccionFiscal.noInterior + ' ' + direccionFiscal.colonia + ' ' + direccionFiscal.municipio + ' ' +
            direccionFiscal.estado + ' ' + direccionFiscal.pais + ' ' + direccionFiscal.codigoPostal;

        var direccionCompleta = direccion.calle + ' ' + direccion.noExterior + ' ' +
            direccion.noInterior + ' ' + direccion.colonia + ' ' + direccion.municipio + ' ' +
            direccion.estado + ' ' + direccion.pais + ' ' + direccion.codigoPostal;

        doc = new PDFDocument()
        doc.pipe(fs.createWriteStream(options.pdf))
        .on('finish', function () {
          callback(null, { success: true, message: 'PDF Created on ' + options.pdf })
        })

        doc.lineJoin('miter')
           .roundedRect(20, 20, 570, 500, 3)
           .stroke()

        doc.image(options.logo, 25, 25, {width: 150})
        doc.fontSize(12)
        doc.text(emisor.nombre, 180, 25)
        doc.fontSize(8)
        doc.text(direccionFiscalCompleta, 180, 40, {width: 200})
        doc.text("RFC: " + emisor.rfc)

        doc.lineJoin('miter')
           .roundedRect(450, 20, 140, 25, 3)
           .stroke()

        doc.fontSize(14)
           .fillColor('red')
           .text("Factura", 495, 28, {width: 220})

        doc.lineJoin('miter')
           .roundedRect(450, 45, 140, 25, 3)
           .stroke()

        doc.fontSize(6)
           .fillColor('black')
           .text("Folio fiscal:", 540, 47)
        doc.text(timbreFiscal.UUID, 452, 58, {width: 128, align: "right"})

        doc.fontSize(8)
           .text("Lugar y fecha de emisión:", 450, 75, {width: 130, align: "right"})
        doc.fontSize(6)
           .text(datos.LugarExpedicion + " a " + datos.fecha, 440, 85, {width: 140, align: "right"})

        doc.fontSize(8)
           .text("Serie y folio:", 450, 100, {width: 130, align: "right"})
        doc.fontSize(8)
           .fillColor('red')
           .text(datos.serie + ' ' + datos.folio, 450, 110, {width: 130, align: "right"})

        doc.fontSize(10)
           .fillColor('black')
           .text(receptor.nombre, 25, 95, {width: 220})
        doc.fontSize(8)
           .text(direccionCompleta, 25, 107, {width: 200})
        doc.fontSize(8)
           .text("RFC: " + receptor.rfc, 25)

        doc.lineJoin('miter')
          .rect(21, 170, 568, 15)
          .fillAndStroke("#E3740E", "#E3740E")
        doc.fontSize(10)
           .fillColor('white')
           .text("CLAVE", 25, 172, {width: 50, align: "center"})
           .text("UNIDAD", 75, 172, {width: 50, align: "center"})
           .text("DESCRIPCION", 125, 172, {width: 250, align: "center"})
           .text("CANTIDAD", 375, 172, {width: 70, align: "center"})
           .text("PRECIO", 445, 172, {width: 60, align: "center"})
           .text("TOTAL", 505, 172, {width: 60, align: "center"})

        var concept_y = 190
        if (Array.isArray(conceptos)) {
          _.forEach(conceptos, function (value) {
            doc.fontSize(8)
               .fillColor('black')
               .text(value.noIdentificacion, 25, concept_y, {width: 50, align: "left"})
               .text(value.unidad, 75, concept_y, {width: 50, align: "center"})
               .text(value.descripcion, 125, concept_y, {width: 250, align: "left"})
               .text(value.cantidad, 375, concept_y, {width: 70, align: "right"})
               .text(value.valorUnitario, 445, concept_y, {width: 60, align: "right"})
               .text(value.importe, 505, concept_y, {width: 60, align: "right"})

            concept_y += 10
          })
        } else {
          var concepto = conceptos["cfdi:Concepto"];
          doc.fontSize(8)
             .fillColor('black')
             .text(concepto.noIdentificacion, 25, concept_y, {width: 50, align: "left"})
             .text(concepto.unidad, 75, concept_y, {width: 50, align: "center"})
             .text(concepto.descripcion, 125, concept_y, {width: 250, align: "left"})
             .text(concepto.cantidad, 375, concept_y, {width: 70, align: "right"})
             .text(concepto.valorUnitario, 445, concept_y, {width: 60, align: "right"})
             .text(concepto.importe, 505, concept_y, {width: 60, align: "right"})
        }

        doc.lineJoin('miter')
           .roundedRect(20, 520, 100, 100, 3)
           .stroke("black")
        doc.lineJoin('miter')
           .roundedRect(120, 520, 300, 100, 3)
           .stroke("black")
        doc.lineJoin('miter')
           .roundedRect(420, 520, 170, 100, 3)
           .stroke("black")

        doc.fontSize(10)
           .fillColor('black')
           .text("Forma de pago:", 124, 524)
           .fontSize(8)
           .text(datos.formaDePago, 124, 534, {width: 295})
           .fontSize(10)
           .text("Metodo de pago:", 124, 544)
           .fontSize(8)
           .text(datos.metodoDePago, 124, 554, {width: 295})

        doc.fontSize(10)
           .text("SUBTOTAL", 424, 524)
           .text("$" + datos.subTotal, 480, 524, {width: 100, align: "right"})
           .text("IVA (" + retencion.impuesto + ")", 424, 536)
           .text("$" + retencion.importe, 480, 536, {width: 100, align: "right"})

        doc.lineCap('butt')
           .moveTo(425, 600)
           .lineTo(582, 600)
           .stroke()

        doc.fontSize(10)
           .fillColor('black')
           .text("TOTAL", 425, 605)
           .text("$" + datos.total, 460, 605, {width: 122, align: "right"})

        doc.lineJoin('miter')
           .roundedRect(20, 620, 570, 86, 3)
           .stroke("black")

        doc.fontSize(8)
           .fillColor('black')
           .text("Sello digital del Emisor:", 24, 624)
           .fontSize(6)
           .text(datos.sello, 24, 634)
           .fontSize(8)
           .text("Sello digital del SAT:", 24)
           .fontSize(6)
           .text(timbreFiscal.selloSAT, 24)
           .fontSize(8)
           .text("Cadena original del complemento de certificación digital del SAT:", 24)
           .fontSize(6)
           .text(timbreFiscal.selloCFD, 24)

        doc.fontSize(8)
           .fillColor('black')
           .text("Este documento es una representación impresa de un CFDI", 20, 710, {width: 570, align: "center"})

        doc.end()
      })
    } catch (e) {
      var result = {
        success: false,
        message: e.message
      }
      callback(result)
    }
  }
}
