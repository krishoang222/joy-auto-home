import fs from "fs";

const INPUT_IMAGE_PATH = "./input/bill_english_grocery.jpeg";
const OUTPUT_BASE64_PATH = "./output/base64_from_image.md";

const base64FromImage = fs.readFileSync(INPUT_IMAGE_PATH, "base64");

fs.writeFileSync(OUTPUT_BASE64_PATH, base64FromImage);
