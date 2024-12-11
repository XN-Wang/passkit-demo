const fs = require('fs');
const path = require('path');
const { PKPass } = require("passkit-generator");

// 读取证书和私钥
const wwdrCertificate = fs.readFileSync(path.join(__dirname, '/cert/Apple Root CA - G2.pem'), 'utf8');
const signerCertificate = fs.readFileSync(path.join(__dirname, '/cert/certificate.pem'), 'utf8');
const signerKey = fs.readFileSync(path.join(__dirname, '/cert/vc.key.pem'), 'utf8');

// 创建 Pass
const pass = new PKPass({
  "icon.png": Buffer.from(['logo.png']),
},
  {
    wwdr: wwdrCertificate,
    signerCert: signerCertificate,
    signerKey: signerKey,
  },
  {
    // keys to be added or overridden
    "passTypeIdentifier": "pass.com.example.mypass",
    "teamIdentifier": "2674TW3P6H",
    "serialNumber": "12345",
    "organizationName": "WeTechnology HongKong Limited",
    "backgroundColor": "rgb(255,255,255)",
    "logoText": "50% OFF"

  });
pass.type = "coupon"
const buffer = pass.getAsBuffer();


// 将 buffer 保存为 .pkpass 文件
fs.writeFileSync(path.join(__dirname, 'myPass.pkpass'), buffer);
console.log('Pass generated successfully!');
