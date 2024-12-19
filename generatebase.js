const fs = require('fs');
const path = require('path');
const { PKPass } = require("passkit-generator");

// 读取证书和私钥
const wwdr = fs.readFileSync(path.join(__dirname, '/cert/wwdr.pem'), 'utf8');
const signerCert = fs.readFileSync(path.join(__dirname, '/cert/signerCert.pem'), 'utf8');
const signerKey = fs.readFileSync(path.join(__dirname, '/cert/signerKey.key'), 'utf8');

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
    const buffer = pass.getAsBuffer();
    fs.writeFileSync(path.join(__dirname, 'myPass.pkpass'), buffer);
    console.log('Pass generated successfully!');
  });

	
} catch (err) {
	//doSomethingWithTheError(err);
}
