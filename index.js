const fs = require('fs');
const path = require('path');
const { PKPass } = require("passkit-generator");

// 读取证书和私钥
const wwdr = fs.readFileSync(path.join(__dirname, '/cert/wwdr.pem'), 'utf8');
const signerCert = fs.readFileSync(path.join(__dirname, '/cert/signerCert.pem'), 'utf8');
const signerKey = fs.readFileSync(path.join(__dirname, '/cert/signerKey.key'), 'utf8');

// 创建 Pass
// const pass = new PKPass({
//   "icon.png": Buffer.from(['logo.png']),
//   "logo.png": Buffer.from(['logo.png']),
// },
//   {
//     wwdr: wwdrCertificate,
//     signerCert: signerCertificate,
//     signerKey: signerKey,
//   },
//   {
//     // keys to be added or overridden
//     "passTypeIdentifier": "pass.photos.hk.verifiable.certificate",
//     "teamIdentifier": "2674TW3P6H",
//     "serialNumber": "12345",
//     "organizationName": "WeTechnology HongKong Limited",
//     "backgroundColor": "rgb(255,255,255)",
//     "logoText": "50% OFF",
//     "formatVersion": "1",
//     "description": "test passkit",
//     "barcode": {
//       "message": "123456789",
//       "format": "PKBarcodeFormatQR",
//       "altText": "Scan to redeem",
//       "messageEncoding": "iso-8859-1"
//     }
//   });
// pass.type = "coupon"
// const buffer = pass.getAsBuffer();
try {
	/** Each, but last, can be either a string or a Buffer. See API Documentation for more */
	//const { wwdr, signerCert, signerKey, signerKeyPassphrase } = getCertificatesContentsSomehow();

  PKPass.from({
		/**
		 * Note: .pass extension is enforced when reading a
		 * model from FS, even if not specified here below
		 */
		model: "./template/Coupon.pass",
		certificates: {
			wwdr,
			signerCert,
			signerKey,
		},
	}).then(pass => {
    console.log(123, pass)
    const buffer = pass.getAsBuffer();
    //doSomethingWithTheBuffer(buffer);
    fs.writeFileSync(path.join(__dirname, 'myPass.pkpass'), buffer);
    console.log('Pass generated successfully!');
  });

	
} catch (err) {
	//doSomethingWithTheError(err);
}
