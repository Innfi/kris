variable "vpc_id" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "internal_cidrs" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "key_pair" {
  type = string
}

variable "ami" {
  type = string
}

variable "instance_type" {
  type = string
  default = "t2.micro"
}

variable "ssh_port" {
  type = number
  default = 22
}