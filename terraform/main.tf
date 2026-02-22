resource "google_cloud_run_service" "api" {
  name     = var.app_name
  location = var.region

  template {
    spec {
      service_account_name = google_service_account.cloud_run_sa.email
      containers {
        image = var.container_image
        
        ports {
          container_port = 3000
        }

        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  autogenerate_revision_name = true
}

output "service_url" {
  value       = google_cloud_run_service.api.status[0].url
  description = "The URL of the deployed Cloud Run service"
}
