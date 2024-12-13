const fs = require("fs");
const path = require("path");
const { PKPass } = require("passkit-generator");
const axios = require("axios");

// Read the certificate and private key
const wwdr = fs.readFileSync(path.join(__dirname, "/cert/wwdr.pem"), "utf8");
const signerCert = fs.readFileSync(
  path.join(__dirname, "/cert/signerCert.pem"),
  "utf8"
);
const signerKey = fs.readFileSync(
  path.join(__dirname, "/cert/signerKey.key"),
  "utf8"
);

// Function to download an image from a URL
async function downloadImage(url, outputPath) {
  try {
    const response = await axios({
      url: url,
      method: "GET",
      responseType: "stream",
    });

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(outputPath);
      response.data.pipe(file);
      file.on("finish", () => resolve());
      file.on("error", (err) => reject(err));
    });
  } catch (error) {
    console.error("Error downloading the image:", error.message);
    throw error;
  }
}

// Function to create a PKPass
function createPass(iconBuffer, logoBuffer) {
  const pass = new PKPass(
    {
      "icon.png": iconBuffer,
      "logo.png": logoBuffer,
      "thumbnail.png": logoBuffer,
      //"artwork.png": logoBuffer,
      "strip.png": iconBuffer,
      'venueMap.png': iconBuffer
    },
    {
      signerCert: signerCert,
      signerKey: signerKey,
      wwdr: wwdr,
    },
    {
      formatVersion: 1,
      passTypeIdentifier: "pass.potos.hk.verifiable.certificate",
      teamIdentifier: "2674TW3P6H",
      serialNumber: `nmyuxofgna${Math.random()}`,
      organizationName: "WeTechnology HongKong Limited",
      description: "Example Apple Wallet Pass",
      backgroundColor: "rgb(206, 140, 53)",
    }
  );

  pass.type = "eventTicket";
  pass.setBarcodes({
    message: "https://award.eight-art.com/#/explore",
    messageEncoding: "iso-8859-1",
    altText: "Scan this QR Code",
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
    }
  );

  pass.primaryFields.push(
    {
      key: "primaryField-1",
      value: "winner",
    },
    {
      key: "primaryField-2",
      value: "date",
    }
  );

  // Add other fields as necessary, but no "image" field (not supported by the schema)
  return pass;
}

// Main function to create a .pkpass file
async function createPkpass() {
  try {
    // URLs for images
    const iconUrl =
      "https://award-asset.eight-art.com/image/83a641c8-c912-42bd-ba7c-1607699b0de9.png";
    const logoUrl =
      "https://fastly.picsum.photos/id/777/1024/1024.jpg?hmac=5lUhb3pvwYyuu724T_2QfgaCBoIb_01WSxEchY2rDuw";

    // Paths to save downloaded images
    const iconPath = "./pass/icon.png";
    const logoPath = "./pass/logo.png";

    // Create directory for pass assets
    if (!fs.existsSync("./pass")) {
      fs.mkdirSync("./pass");
    }

    // Download images
    console.log("Downloading images...");
    await downloadImage(iconUrl, iconPath);
    await downloadImage(logoUrl, logoPath);
    console.log("Images downloaded successfully!");

    // Load the downloaded image buffers
    const iconBuffer = fs.readFileSync(iconPath);
    const logoBuffer = fs.readFileSync(logoPath);

    // Create the pass object
    const pass = createPass(iconBuffer, logoBuffer);

    // Generate the .pkpass file
    const buffer = pass.getAsBuffer();
    fs.writeFileSync(path.join(__dirname, "award.pkpass"), buffer);
    console.log("PKPass file created successfully!");
  } catch (error) {
    console.error("Error creating the PKPass file:", error.message);
  }
}

// Execute the function
createPkpass();