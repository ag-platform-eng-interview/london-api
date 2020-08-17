resource "aws_security_group" "allow-http" {
  name = "allow-http"
  description = "Allow http requests"
  ingress = {
      from_port = 80
      to_port = 80
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]

  }
}

resource "aws_security_group" "allow-ssh" {
  name = "allow-ssh"
  description = "Allow ssh requests"
  ingress = {
      from_port = 22
      to_port = 22
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]

  }
}

resource "aws_security_group" "allow-outbound" {
  name = "allow-outbound"
  description = "Allow outbound requests"
  egress = {
      from_port = 0
      to_port = 0
      protocol = "-1"
      cidr_blocks = ["0.0.0.0/0"]

  }
}