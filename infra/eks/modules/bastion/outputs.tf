output "bastion_dns" {
  value = aws_instance.eks-bastion.public_dns
}
