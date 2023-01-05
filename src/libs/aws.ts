import * as aws from 'aws-sdk';

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_VERCEL,
  secretAccessKey: process.env.AWS_SECRET_KEY_VERCEL,
  region: process.env.AWS_REGION_VERCEL,
  signatureVersion: 'v4',
});

export const AWS = aws;