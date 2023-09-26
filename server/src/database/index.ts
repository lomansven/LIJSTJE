import * as dynamoose from "dynamoose";

// Create DynamoDB connection
const ddb = new dynamoose.aws.ddb.DynamoDB({
    credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "UNDEFINED",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "UNDEFINED"
	},
	region: process.env.AWS_REGION || "eu-west-1"
});

// Link it to Dynamoose
dynamoose.aws.ddb.set(ddb);
