const fs = require('fs');
const faker = require('faker');
const _ = require('lodash');

const args = process.argv.slice(2);

console.log('started!...');
/* ================================================
for "type: faker" format guide
please refer to https://www.npmjs.com/package/faker
================================================ */
const CONFIG = {
  rows: args[0] || 5,
  output: args[1] || 'output.csv',
  delimiter: ',',

  // EDIT THIS TO CHANGE THE FORMAT OF CSV
  format: {
    mobile_number: {
      type: 'number',
      min: 9000000000,
      max: 9999999999,
      prefix: '63',
    },
    first_name: {
      type: 'faker',
      value: 'name.firstName',
    },
    last_name: {
      type: 'faker',
      value: 'name.lastName',
    },
    company: {
      type: 'faker',
      value: 'company.companyName',
    },
  },
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const FACTORY = {
  faker: ({ value }) => {
    return _.get(faker, value, FACTORY.default());
  },
  number: ({ prefix, min, max }) => {
    return () => `${prefix}${getRandomInt(min, max)}`;
  },
  default: () => (() => ''),
}

const buildCsv = () => {
  console.log('building csv...');
  const row_builder = [];
  const header = [];
  _.forOwn(CONFIG.format, (v, k) => {
    header.push(k);
    row_builder.push((FACTORY[v.type] || FACTORY.default)(v))
  });

  console.time('build csv')
  const data = [];
  data.push(header.join(CONFIG.delimiter));
  for (let i = 0; i < CONFIG.rows; i+= 1) {
    const row = [];
    _.forOwn(row_builder, (v) => {
      row.push(v().replace(CONFIG.delimiter, ''));
    });
    data.push(row.join(CONFIG.delimiter));
  }
  console.timeEnd('build csv');
  console.log('creating file...');
  console.time('file created!');
  fs.writeFile(`${CONFIG.output}`, data.join('\n'), (err) => {
    if (err) return console.log(err);
    console.log(`> ${CONFIG.output}`);
    console.timeEnd('file created!');
  });
}

buildCsv();