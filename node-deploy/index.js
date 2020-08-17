#!/usr/bin/env node

const AWS = require("aws-sdk");
const child_process = require("child_process");
const { format } = require("date-fns");
const fs = require("fs");
const path = require("path");
const util = require("util");

const deploymentDir = process.argv[2];
const deploymentDirName = path.basename(deploymentDir);

const rel = relPath => path.resolve(deploymentDir, relPath);

const tfFilePath = rel("./terraform/terraform.tfstate");

if(!fs.existsSync(tfFilePath)) {
    throw new Error("Terrform state file not present");
}

const fileContents = fs.readFileSync(tfFilePath, "utf-8");
// console.log(fileContents);
const { modules } = JSON.parse(fs.readFileSync(tfFilePath, "utf-8"));
const { outputs } = modules[0];
// const { outputs } = JSON.parse(fs.readFileSync(tfFilePath, "utf-8"));

require("dotenv").config({path: rel("./.deploy.env")});

const exec = util.promisify(child_process.exec);

const getFullDate = () => format(new Date(), "yyyyMMddHHmmss");

const APPLICATION_NAME = process.env.APPLICATION_NAME;

const MAX_BUFFER_SIZE = 1024 * 1024;

const awsRegion = outputs["aws-region"].value

const codeDeployClient = new AWS.CodeDeploy({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    apiVersion: "2020-08-17",
    region: awsRegion,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
})

const s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    endpoint: new AWS.Endpoint(`https://s3.${awsRegion}.amazonaws.com/`),
    s3ForcePathStyle: true,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
})

const rootDir = rel("./");

(async () => {
    console.log("Deploying...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    const lockFilePath = rel("./deploy.lock");
    console.log("Checking for lockfile...");
    if (fs.existsSync(lockFilePath)) {
        console.error("Lockfile found, another deployment already running. Exiting...");
        process.exit();
    }

    console.log("Creating lockfile...");
    fs.writeFileSync(lockFilePath, "This ensures only one instance of node-deploy can run. ");

    console.log("Checking environment...");
    if(!fs.existsSync(rel("./.production.env"))) {
        console.error("No .production.env found! Exiting...");
        process.exit();
    }

    // console.log("Copying appspec");
    // fs.copyFileSync(rel("../appspec.yml"), rel("../appspec.yml"));

    console.log("Generating deployment file...");
    const filename = `${deploymentDirName}-deployment-${getFullDate()}.zip`;
    const zipPath = `/tmp/${filename}`;
    await exec(
        `zip -r ${zipPath} . -x terraform/\\* -x node_modules/\\* -x \\*/node_modules/\\* -x \\*/.cache/\\* -x .git/\\* -x \\*.DS_Store`,
        { cwd: rootDir, maxBuffer: MAX_BUFFER_SIZE }
    );

    console.log("Uploading deployment file...");
    await s3Client.putObject({
        Body: fs.createReadStream(zipPath),
        Bucket: outputs[`${APPLICATION_NAME}-deployment-bucket-name`].value,
        Key: filename
    }).promise();

    console.log("Upload complete. Package is: ", filename);
    console.log("Removing deployment Package...");
    fs.unlinkSync(zipPath);
    console.log("Deploying applicaiton...");

    await codeDeployClient.createDeployment({
        applicationName: outputs[`${APPLICATION_NAME}-codedeploy-app-name`].value,
        deploymentGroupName: process.env.CODEDEPLOY_DEPLOYMENT_GROUP_NAME,
        revision: {
            revisionType: "S3",
            s3Location: {
                bucket: outputs[`${APPLICATION_NAME}-deployment-bucket-name`].value,
                bundleType: "zip",
                key: filename
            }
        }
    }).promise();

    console.log("Started CodeDeploy...");
    console.log("Cleaning...");

    fs.unlinkSync(rel("./deploy.lock"));
})();