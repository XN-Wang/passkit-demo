const fs = require('fs');
const path = require('path');
const { PKPass } = require("passkit-generator");
const axios = require('axios');
const archiver = require("archiver");

// 读取证书和私钥
const wwdr = fs.readFileSync(path.join(__dirname, '/cert/wwdr.pem'), 'utf8');
const signerCert = fs.readFileSync(path.join(__dirname, '/cert/signerCert.pem'), 'utf8');
const signerKey = fs.readFileSync(path.join(__dirname, '/cert/signerKey.key'), 'utf8');
const background = fs.readFileSync(path.join(__dirname, './background@2x.png'))

function createPass(imageBuffer) {
  const pass = new PKPass({
    "background@2x.png": imageBuffer,
  }, {
    signerCert: signerCert,
    signerKey: signerKey,
    wwdr: wwdr
  }, {
    "formatVersion": 1,
    "passTypeIdentifier": "pass.potos.hk.verifiable.certificate",
    "teamIdentifier": "2674TW3P6H",
    serialNumber: `nmyuxofgna${Math.random()}`,
    "organizationName": "WeTechnology HongKong Limited",
    description: "Example Apple Wallet Pass",
    //"foregroundColor": "rgb(255, 255, 255)",
    "backgroundColor": "rgb(206, 140, 53)",
  })

  pass.type = "eventTicket";
  pass.setBarcodes({
    "message": "https://award.eight-art.com/#/explore",
    "messageEncoding": "iso-8859-1",
    altText: 'Scan this QR Code', 
		format: "PKBarcodeFormatQR",
	});

  pass.headerFields.push(
    {
      key: "header-field-test-1",
      value: "HKChain",
    },
    {
      key: "header-field-test-2",
      value: "gold price",
    },
  );

  pass.primaryFields.push(
    {
      key: "primaryField-1",
      value: "winner",
    },
    {
      key: "primaryField-2",
      value: "date",
    },
  );
  
  pass.backFields.push(
    {
      key: 'imageField',  // 图片字段的键
      label: 'Prize Image',  // 图片字段标签
      value: '',  // 这里为空，因为我们只是显示图片
      isRelative: false,  // 不是相对日期字段
      image: {
        src: 'custom_image.png',  // 图片资源名称
        width: 150,  // 宽度
        height: 150,  // 高度
      }
    }
  )
  //pass.addBuffer("background@2x.png", imageBuffer)
  pass.addBuffer("icon.png", './logo.png');
  return pass;
}

// async function downloadImage(url, outputPath) {
//   try {
//     const response = await axios({
//       url: 'https://award-asset.eight-art.com/image/83a641c8-c912-42bd-ba7c-1607699b0de9.png',
//       method: "GET",
//       responseType: "stream",
//     });

//     // Pipe image data to a local file
//     return new Promise((resolve, reject) => {
//       const file = fs.createWriteStream(outputPath);
//       response.data.pipe(file);
//       file.on("finish", () => {
//         resolve();
//       });
//       file.on("error", (err) => {
//         reject(err);
//       });
//     });
//   } catch (error) {
//     console.error("Error downloading the image:", error);
//     throw error;
//   }
// }

// async function createPass() {
//   try {
//     // URLs for images
//     const iconUrl = "https://example.com/icon.png"; // Replace with your image URL
//     const logoUrl = "https://example.com/logo.png"; // Replace with your image URL

//     // Paths to save downloaded images
//     const iconPath = "./pass/icon.png";
//     const logoPath = "./pass/logo.png";

//     // Create directory for pass assets
//     if (!fs.existsSync("./pass")) {
//       fs.mkdirSync("./pass");
//     }

//     // Download images
//     console.log("Downloading images...");
//     await downloadImage(iconUrl, iconPath);
//     await downloadImage(logoUrl, logoPath);
//     console.log("Images downloaded successfully!");

//     // Create pass.json
//     const passData = {
//       formatVersion: 1,
//       "passTypeIdentifier": "pass.potos.hk.verifiable.certificate",
//       "teamIdentifier": "2674TW3P6H",
//       serialNumber: `nmyuxofgna${Math.random()}`,
//       "organizationName": "WeTechnology HongKong Limited",
//       description: "Example Pass",
//       logoText: "Welcome!",
//       foregroundColor: "rgb(255, 255, 255)",
//       backgroundColor: "rgb(0, 122, 255)",
//       barcode: {
//         message: "1234567890",
//         format: "PKBarcodeFormatQR",
//         messageEncoding: "iso-8859-1",
//       },
//     };

//     // Write pass.json to the pass folder
//     fs.writeFileSync("./pass/pass.json", JSON.stringify(passData, null, 2));
//     console.log("pass.json created successfully!");

//     // Create .pkpass bundle
//     const output = fs.createWriteStream("MyPass.pkpass");
//     const archive = archiver("zip", { zlib: { level: 9 } });

//     archive.pipe(output);

//     // Append files to the archive
//     archive.file("./pass/pass.json", { name: "pass.json" });
//     archive.file("./pass/icon.png", { name: "icon.png" });
//     archive.file("./pass/logo.png", { name: "logo.png" });

//     // Finalize the archive
//     await archive.finalize();
//     console.log("MyPass.pkpass created successfully!");
//   } catch (error) {
//     console.error("Error creating the pass:", error);
//   }
// }



// 创建 Pass
try {
  axios.get('https://award-asset.eight-art.com/image/83a641c8-c912-42bd-ba7c-1607699b0de9.png', { responseType: 'arraybuffer' })
    .then(response => {
      const imageBuffer = Buffer.from(response.data);
      const pass = createPass(imageBuffer);
      createPass();
      console.log(123, pass)
      // const buffer = pass.getAsBuffer();
      // fs.writeFileSync(path.join(__dirname, 'award.pkpass'), buffer);
      console.log('Pass generated successfully!');
    })
} catch (err) {
  console.log("generated failed!")
}
