resource "aws_eip" "dev-server-ip" {
  instance = "${module.dev-server.instance-id}"
}


module "dev-server" {
    source = "./api-server"

    ami-id = "ami-0a13d44dccf1f5cf6"
    iam-instance-profile = "${module.dev-server-codedeploy.iam-instance-profile}"
    key-pair = "${aws_key_pair.api-server-key.key_name}"
    name = "Dev Server"
    vpc-security-group-ids = [
        "${aws_security_group.allow-http.id}",
        "${aws_security_group.allow-ssh.id}",
        "${aws_security_group.allow-outbound.id}"
    ]
}

module "dev-server-codedeploy" {
  source = "./codedeploy-app"
  
  app-name = "dev-server"
  ec2-instance-name = "${module.dev-server.name}"
}
