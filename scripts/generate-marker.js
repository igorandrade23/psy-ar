const fs = require("node:fs");
const path = require("node:path");

const markerMatrix = [
  "1111100101011111",
  "1000101010010001",
  "1010100101010101",
  "1000101110010001",
  "1111101001011111",
  "0000000111000000",
  "0110101000110110",
  "0001011111001000",
  "1100010110100111",
  "0011101001011000",
  "0100011110000110",
  "1111100101101010",
  "1000101010010110",
  "1010100101110001",
  "1000101110001010",
  "1111100011010100"
];

const outputDir = path.join(process.cwd(), "public", "markers");
const svgPath = path.join(outputDir, "psy-qr-marker.svg");
const pattPath = path.join(outputDir, "psy-qr-marker.patt");

const markerSize = 1024;
const outerMargin = 128;
const borderSize = 768;
const innerPatternSize = 512;
const innerOffset = (markerSize - innerPatternSize) / 2;
const cellSize = innerPatternSize / markerMatrix.length;

function rotateMatrix(matrix) {
  return matrix[0]
    .split("")
    .map((_, columnIndex) =>
      matrix
        .map((row) => row[columnIndex])
        .reverse()
        .join("")
    );
}

function buildSvg() {
  const modules = [];

  markerMatrix.forEach((row, rowIndex) => {
    row.split("").forEach((cell, columnIndex) => {
      if (cell !== "1") {
        return;
      }

      modules.push(
        `<rect x="${innerOffset + columnIndex * cellSize}" y="${innerOffset + rowIndex * cellSize}" width="${cellSize}" height="${cellSize}" fill="#000000"/>`
      );
    });
  });

  return [
    `<svg width="${markerSize}" height="${markerSize}" viewBox="0 0 ${markerSize} ${markerSize}" fill="none" xmlns="http://www.w3.org/2000/svg">`,
    `  <rect width="${markerSize}" height="${markerSize}" fill="#FFFFFF"/>`,
    `  <rect x="${outerMargin}" y="${outerMargin}" width="${borderSize}" height="${borderSize}" fill="#000000"/>`,
    `  <rect x="${innerOffset}" y="${innerOffset}" width="${innerPatternSize}" height="${innerPatternSize}" fill="#FFFFFF"/>`,
    ...modules.map((module) => `  ${module}`),
    `</svg>`
  ].join("\n");
}

function buildPattBlock(matrix) {
  const rows = matrix.map((row) =>
    row
      .split("")
      .map((cell) => (cell === "1" ? "0" : "255").padStart(3, " "))
      .join(" ")
  );

  return [...rows, ...rows, ...rows].join("\n");
}

function buildPatt() {
  const orientations = [markerMatrix];

  while (orientations.length < 4) {
    orientations.push(rotateMatrix(orientations[orientations.length - 1]));
  }

  return orientations.map(buildPattBlock).join("\n\n");
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(svgPath, buildSvg());
fs.writeFileSync(pattPath, buildPatt());

console.log(`Generated ${path.relative(process.cwd(), svgPath)}`);
console.log(`Generated ${path.relative(process.cwd(), pattPath)}`);
