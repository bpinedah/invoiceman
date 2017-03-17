var expect      = require('chai').expect,
    assert      = require('chai').assert,
    invoiceman  = require('../index');

describe('#invoiceman', function () {

  it('Gets the PDF', function () {
    var options = {
      pdf: "./output.pdf",
      logo: "./logoPrixz.png",
      xml: "./test.xml"
    }
    invoiceman.generate(options, function(err, data) {
      if (err) throw err;
      assert.isNull(err, 'there was no error');
      expect(data).to.not.be.null;
    });
  });
})
