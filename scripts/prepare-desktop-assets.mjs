// One-off asset prep for the desktop journal.
//
// paper.jpg is a ~12 MB scan and is used as a full-viewport fixed background,
// so it gets rendered once at viewport scale. martha.png is a phone photo
// pasted onto a large white canvas; trim() finds the actual photo edges so the
// portrait can be framed without hand-tuned CSS crop offsets.
import sharp from "sharp";

const jobs = [
  {
    source: "public/assets/site/paper.jpg",
    output: "public/assets/site/paper-backdrop.webp",
    transform: image => image.resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 74 }),
  },
  {
    source: "public/assets/site/martha.png",
    output: "public/assets/site/martha-portrait.webp",
    transform: image =>
      image
        .trim({ threshold: 18 })
        .resize({ width: 1100, withoutEnlargement: true })
        .webp({ quality: 82 }),
  },
];

for (const { source, output, transform } of jobs) {
  const before = await sharp(source).metadata();
  const after = await transform(sharp(source)).toFile(output);
  console.log(
    `${source} ${before.width}x${before.height} -> ${output} ${after.width}x${after.height} (${(after.size / 1024).toFixed(0)} KB)`,
  );
}
