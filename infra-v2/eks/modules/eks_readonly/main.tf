resource "aws_iam_policy" "eks_readonly_policy" {
  name = "eks_readonly"

  policy = jsonencode({
    "Version": "2012-10-17"
    "Statement": [
      {
        "Action": [
          "eks:ListNodegroups",
          "eks:ListCluster",
          "eks:AccessKubernetesApi",
          "eks:DescribeUser",
          "eks:DescribeNodegroup",
          "eks:ListTagsForResource"
        ],
        "Effect": "Allow",
        "Resource": "*"
      }
    ]
  })
}
