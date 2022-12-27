
resource "aws_iam_openid_connect_provider" "cluster_oidc_provider" {
  client_id_list = [ "sts.amazonaws.com" ]
  thumbprint_list = [ var.cert_fingerprint ]
  url = var.issuer
}

data "aws_iam_policy_document" "cluster_policy" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect = "Allow"

    condition {
      test = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.cluster_oidc_provider.url, "https://", "")}:sub"
      values = ["system:serviceaccount:kube-system:aws-node"]
    }

    principals {
      identifiers = [ aws_iam_openid_connect_provider.cluster_oidc_provider.arn ]
      type = "Federated"
    }
  }
}

resource "aws_iam_role" "cluster_role" {
  assume_role_policy = data.aws_iam_policy_document.cluster_assume_role_policy.json
  name = "cluster_role"
}