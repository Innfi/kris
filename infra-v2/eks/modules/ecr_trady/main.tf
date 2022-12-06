
resource "aws_ecr_repository" "trady_repos" {
  for_each = var.trady_repos

  name = each.key

  image_scanning_configuration {
    scan_on_push = false
  }
  
  encryption_configuration {
    encryption_type = "AES256"
  }
}