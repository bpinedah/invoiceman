var invoiceman  = require('./index')

var options = {
  pdf: "./output.pdf",
  logo: "./logoPrixz.png",
  esArchivo: true,
  xml: "./test.xml"
}
invoiceman.generate(options, (err, data) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(data)
})
