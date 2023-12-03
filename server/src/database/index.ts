import * as dynamoose from "dynamoose";

// Create DynamoDB connection
const ddb = new dynamoose.aws.ddb.DynamoDB({
    credentials: {
		accessKeyId: process.env.LIJSTJE_AWS_ACCESS_KEY_ID || "UNDEFINED",
		secretAccessKey: process.env.LIJSTJE_AWS_SECRET_ACCESS_KEY || "UNDEFINED"
	},
	region: process.env.LIJSTJE_AWS_REGION || "eu-west-1"
});

// Link it to Dynamoose
dynamoose.aws.ddb.set(ddb);
