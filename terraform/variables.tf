variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The GCP zone"
  type        = string
  default     = "us-central1-a"
}

variable "app_name" {
  description = "The name of the application"
  type        = string
  default     = "order-cleaner-api"
}

variable "container_image" {
  description = "The Docker image for the application"
  type        = string
}
