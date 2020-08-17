resource "aws_key_pair" "api-server-key" {
  key_name      = "api-server-key"
  public_key    = "${file("./london-api.pem")}"
}
