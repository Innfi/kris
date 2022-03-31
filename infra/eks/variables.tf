variable "provider_cred_path" {
  description = "Shared credential path"
  type = string
  default = "~/.aws/credentials"
}

variable "profile" {
  description = "AWS profile"
  type = string
  default = "InnfisDev"
}