resource "aws_s3_bucket" "deploy-bucket" {
  bucket = "ag-platform-interview-api-server-${var.app-name}-deployment"
}

