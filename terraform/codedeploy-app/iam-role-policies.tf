resource "aws_iam_role_policy" "s3-deployment-policy" {
    name = "${var.app-name}-deployment-s3"
    role = "${aws_iam_role.ec2.id}"
  
    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": [
                "arn:aws:s3:::${aws_s3_bucket.deploy-bucket.id}/*",
                "arn:aws:s3:::aws-codedeploy-eu-west-1/*",
                "arn:aws:s3:::aws-codedeploy-eu-west-2/*",
                "arn:aws:s3:::aws-codedeploy-eu-west-3/*"
            ]
        }
    ]
}
EOF
}
