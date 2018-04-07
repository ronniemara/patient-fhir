const faker = require('faker');
const jsonfile = require('jsonfile');

const numPatients = 50;

const patientData = [];

faker.seed(1000);

for (let i = 0; i < numPatients; i++) {
  // Since given is an array, lets put in some random middle names.
  let given = [];
  for (let n = 0; n < faker.random.number({ min: 1, max: 3 }); n++) {
    given = given.concat(faker.name.firstName());
  }

  const family = faker.name.lastName();

  // Just put a single prefix as faker only had Mr and Mrs.
  const prefix = [faker.name.prefix()];

  // Randomize suffix lengths as well for some variety
  let suffix = [];
  for (let n = 0; n < faker.random.number({ min: 0, max: 3 }); n++) {
    suffix = suffix.concat(faker.name.suffix());
  }

  //used to fetch from db
  const identifier = faker.random.uuid();

  const patientInfo = {
    resourceType: 'Patient',
    given,
    family,
    prefix,
    suffix,
    identifier,
  };

  patientData.push(patientInfo);
}

const patientFile = 'Patients.json';

jsonfile.writeFileSync(patientFile, patientData, null, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('data created successfully');
  }
});
