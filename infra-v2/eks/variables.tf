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

variable "vpc_cidr" {
  type = string
  default = "10.0.0.0/16"
}

variable "public_subnets" {
  type = list(string) 
  default = ["10.0.4.0/24", "10.0.5.0/24"]
}

variable "private_subnets" {
  type = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "key_pair" {
  type = string
  default = "InnfisKey"
}

variable "admin_cidr_blocks" {
  type = list(string)
  default = ["0.0.0.0/0"]
}