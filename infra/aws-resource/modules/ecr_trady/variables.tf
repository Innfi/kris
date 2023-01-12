variable "trady_repos" {
  type = set(string)
  default = [
    "stock-tracker",
    "port-api",
    "chart-api"
  ]
}