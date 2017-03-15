var PDFDocument = require('pdfkit'),
    fs          = require('fs'),
    _           = require('lodash')

module.exports = {
  generate: function (options, callback) {
    try {
      doc = new PDFDocument()
      doc.pipe(fs.createWriteStream(options.archivo))
      .on('finish', function () {
        callback(null, { success: true, message: 'PDF Created on ' + options.archivo })
      })

      doc.lineJoin('miter')
         .roundedRect(20, 20, 570, 500, 3)
         .stroke()

      doc.image(options.emisor.logo, 25, 25, {width: 150})
      doc.fontSize(12)
      doc.text(options.emisor.empresa, 180, 25)
      doc.fontSize(8)
      doc.text(options.emisor.direccion, 180, 40, {width: 200})
      doc.text("RFC: " + options.emisor.rfc)

      doc.lineJoin('miter')
         .roundedRect(450, 20, 140, 25, 3)
         .stroke()

      doc.fontSize(14)
         .fillColor('red')
         .text("Factura", 495, 28, {width: 220})

      doc.lineJoin('miter')
         .roundedRect(450, 45, 140, 25, 3)
         .stroke()

      doc.fontSize(8)
         .fillColor('black')
         .text("Folio fiscal:", 540, 47)
      doc.text(options.factura.folio_fiscal, 452, 58, {width: 128, align: "right"})

      doc.fontSize(8)
         .text("Lugar y fecha de emisión:", 450, 75, {width: 130, align: "right"})
      doc.fontSize(6)
         .text(options.factura.lugar_emision + " a " + options.factura.fecha_emision, 440, 85, {width: 140, align: "right"})

      doc.fontSize(8)
         .text("Serie y folio:", 450, 100, {width: 130, align: "right"})
      doc.fontSize(8)
         .fillColor('red')
         .text(options.factura.folio, 450, 110, {width: 130, align: "right"})

      doc.fontSize(10)
         .fillColor('black')
         .text(options.receptor.empresa, 25, 95, {width: 220})
      doc.fontSize(8)
         .text(options.receptor.direccion, 25, 107, {width: 200})
      doc.fontSize(8)
         .text("RFC: " + options.receptor.rfc, 25)

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
      _.forEach(options.factura.conceptos, function (value) {
        doc.fontSize(8)
           .fillColor('black')
           .text(value.clave, 25, concept_y, {width: 50, align: "left"})
           .text(value.unidad, 75, concept_y, {width: 50, align: "center"})
           .text(value.descripcion, 125, concept_y, {width: 250, align: "left"})
           .text(value.cantidad, 375, concept_y, {width: 70, align: "right"})
           .text(value.precio, 445, concept_y, {width: 60, align: "right"})
           .text(value.total, 505, concept_y, {width: 60, align: "right"})

        concept_y += 10
      })

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
         .text("Total con letra:", 124, 524)
         .fontSize(8)
         .text(options.factura.total_letra, 124, 534, {width: 295})
         .fontSize(10)
         .text("Forma de pago:", 124, 544)
         .fontSize(8)
         .text(options.factura.forma_pago, 124, 554, {width: 295})
         .fontSize(10)
         .text("Metodo de pago", 124, 564)
         .fontSize(8)
         .text(options.factura.metodo_pago, 124, 574, {width: 295})

      doc.fontSize(10)
         .text("SUBTOTAL", 424, 524)
         .text("$" + options.factura.subtotal, 480, 524, {width: 100, align: "right"})
         .text("IVA (16%)", 424, 536)
         .text("$" + options.factura.iva, 480, 536, {width: 100, align: "right"})

      doc.lineCap('butt')
         .moveTo(425, 600)
         .lineTo(582, 600)
         .stroke()

      doc.fontSize(10)
         .fillColor('black')
         .text("TOTAL", 425, 605)
         .text("$" + options.factura.total, 460, 605, {width: 122, align: "right"})

      doc.lineJoin('miter')
         .roundedRect(20, 620, 570, 86, 3)
         .stroke("black")

      doc.fontSize(8)
         .fillColor('black')
         .text("Sello digital del Emisor:", 24, 624)
         .fontSize(6)
         .text(options.emisor.sello_digital, 24, 634)
         .fontSize(8)
         .text("Sello digital del SAT:", 24)
         .fontSize(6)
         .text(options.factura.sello_digital_SAT, 24)
         .fontSize(8)
         .text("Cadena original del complemento de certificación digital del SAT:", 24)
         .fontSize(6)
         .text(options.factura.cadena_sat, 24)

      doc.fontSize(8)
         .fillColor('black')
         .text("Este documento es una representación impresa de un CFDI", 20, 710, {width: 570, align: "center"})

      doc.end()
    } catch (e) {
      var result = {
        success: false,
        message: e.message
      }
      callback(result)
    }
  }
}
