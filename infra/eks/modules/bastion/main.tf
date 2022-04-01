
resource "aws_security_group" "eks-bastion" {
  name = "eks-bastion"
  vpc_id = var.vpc_id

  tags = merge (
    {
      "Name" = "eks-bastion"
    }
  )
}

resource "aws_security_group_rule" "eks-bastion-ingress" {
  security_group_id = aws_security_group.eks-bastion.id

  type = "ingress"
  from_port = var.ssh_port
  to_port = var.ssh_port
  protocol = "tcp"
  cidr_blocks = var.internal_cidrs
}

resource "aws_security_group_rule" "eks-bastion-egress" {
  security_group_id = aws_security_group.eks-bastion.id

  type = "egress"
  from_port = 0
  to_port = 0
  protocol = -1
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "ingress-control" {
  security_group_id = var.security_group_id

  type = "ingress"
  from_port = 0
  to_port = 0
  protocol = -1
  source_security_group_id = aws_security_group.eks-bastion.id
}

resource "aws_instance" "eks-bastion" {
  ami = var.ami
  instance_type = var.instance_type
  key_name = var.key_pair
  subnet_id = var.subnet_id
  vpc_security_group_ids = [ aws_security_group.eks-bastion.id ]

  tags = merge(
    {
      "Name" = "eks-bastion"
    }
  )
}

