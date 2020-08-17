output "dev-server-private-ip" {
  value = "${module.dev-server.private-ip}"
}

output "dev-server-public-ip" {
  value = "${aws_eip.dev-server-ip.public_ip}"
}

output "london-api-codedeploy-app-name" {
  value = "${module.dev-server-codedeploy.app-name}"
}

output "london-api-deployment-bucket-name" {
  value = "${module.dev-server-codedeploy.deployment-bucket-name}"
}

output "aws-region" {
  value = "${var.aws-region}"
}