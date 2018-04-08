// add to handler.js
import dynamodb from 'serverless-dynamodb-client';

const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

let docClient;

if (process.env.NODE_ENV === 'production') {
  docClient = new AWS.DynamoDB.DocumentClient();
} else {
  docClient = dynamodb.doc;
}

// add to handler.js
const promisify = foo =>
  new Promise((resolve, reject) => {
    foo((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

const data = {
  getPatientInfo(identifier) {
    return promisify(callback => {
      const params = {
        TableName: 'Patients',
        KeyConditionExpression: 'identifer = :v1',
        ExpressionAttributeValues: {
          ':v1': identifier,
        },
      };

      docClient.query(params, callback);
    }).then(result => {
      console.log(result);
      const patient = {
        given: result.given,
        family: result.family,
        prefix: result.prefix,
        suffix: result.suffix,
        identifier: result.identifier,
      };
    });
    return patient;
  },
  getPatients(args) {
    return promisify(callback =>
      docClient.scan(
        {
          TableName: 'Patients',
          Limit: args.limit,
        },
        callback
      )
    ).then(result => {
      console.log(result);
      for (let i = 0; i < result.Items.length; i += 1) {
        const patients = [];
        patients.push({
          resourceType: 'Patient',
          given: result.Items[i].given,
          family: result.Items[i].family,
          prefix: result.Items[i].prefix,
          suffix: result.Items[i].suffix,
          identifier: result.Items[i].identifier,
        });
      }
      return patients;
    });
  },
};
// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    getPatientInfo: (root, args) => data.getPatientInfo(args),
    getPatients: (root, args) => data.getPatients(args),
  },
};
