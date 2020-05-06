const fs = require('fs');

const args = process.argv.slice(2);
const pub_key = args[0];
const pri_key = args[1];
const file = args[2];
if (!pub_key || !pri_key || !file) {
  console.log('\x1b[33m%s\x1b[0m', "Please input uploadcare key followed by the filename to upload...\ne.g npm run upload-ucare PUBLIC_KEY PRIVATE_KEY file_to_upload.csv");
  return;
}

const path = `./${file}`;
if (!fs.existsSync(path)) {
  console.log('\x1b[33m%s\x1b[0m', `Please make sure that the file ${file} exists`);
  return;
}

const uploadcare = require('uploadcare')(pub_key, pri_key)

console.log(pub_key, pri_key);

console.log('uploading file...');
console.time('upload time');
const file_stream = fs.createReadStream(path);

let index = 0
const frames = [
  '▁',
  '▂',
  '▃',
  '▄',
  '▅',
  '▆',
  '▇',
  '█',
];
const interval = setInterval(() => {
  const frame = frames[index];
  process.stdout.write(`${frame} Uploading...Please wait\r`);
  index = index + 1;
  if (index > frames.length - 1) index = 0;
}, 100);

uploadcare.file.upload(file_stream, (err, res) => {
  clearInterval(interval);
  //Res should contain returned file ID
  console.timeEnd('upload time');
  if (err) {
    console.log('\x1b[33m%s\x1b[0m', 'Unable to upload...');
    console.log(err);
    return;
  }
  const output_url = `http://ucarecdn.com/${res.file}/`;
  console.log(`> ${output_url}`);
});