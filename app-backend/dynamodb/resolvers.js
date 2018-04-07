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
      docClient.query(
        {
          TableName: 'Users',
          KeyConditionExpression: 'handle = :v1',
          ExpressionAttributeValues: {
            ':v1': args.handle,
          },
        },
        callback
      )
    ).then(result => {
      let listOfPatients;

      if (result.Items.length >= 1) {
        listOfPatients = {
          name: result.Items[0].name,
          handle: result.Items[0].handle,
          location: result.Items[0].location,
          description: result.Items[0].description,
          followers_count: result.Items[0].followers_count,
          friends_count: result.Items[0].friends_count,
          favourites_count: result.Items[0].favourites_count,
          following: result.Items[0].following,
        };
      }

      return listOfTweets;
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
