# LegisFlow: CEMAC CI/CD Pipeline

This directory contains the CI/CD pipeline configuration for the LegisFlow: CEMAC application.

## GitHub Actions Workflow

The CI/CD pipeline is configured using GitHub Actions and Docker Buildx Cloud. The workflow is defined in the `.github/workflows/ci.yml` file.

### Workflow Steps

1. **Checkout**: Checks out the repository code.
2. **Log in to Docker Hub**: Authenticates with Docker Hub using the provided credentials.
3. **Set up Docker Buildx**: Configures Docker Buildx with cloud driver for faster builds.
4. **Build and Push Backend**: Builds and pushes the backend Docker image.
5. **Build and Push Frontend**: Builds and pushes the frontend Docker image.
6. **Build and Push Nginx**: Builds and pushes the Nginx Docker image for production.
7. **Run Tests**: Runs tests to ensure the application is working correctly.

### Required Secrets and Variables

The following secrets and variables need to be configured in your GitHub repository:

#### GitHub Secrets

- `DOCKER_PAT`: Docker Hub Personal Access Token for authentication.

#### GitHub Variables

- `DOCKER_USER`: Docker Hub username.

### How to Configure

1. Go to your GitHub repository settings.
2. Navigate to "Secrets and variables" > "Actions".
3. Add the required secrets and variables.

## Deployment

After the CI/CD pipeline successfully builds and pushes the Docker images, you can deploy the application using the following command:

```bash
# Set the Docker user environment variable
export DOCKER_USER=your-docker-username

# Deploy the application
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Troubleshooting

If you encounter any issues with the CI/CD pipeline, check the following:

1. Ensure that the Docker Hub credentials are correct.
2. Verify that the Docker Buildx Cloud endpoint is properly configured.
3. Check the GitHub Actions logs for any error messages.
4. Ensure that the Docker images are being built correctly.

For more information, refer to the [Docker Buildx documentation](https://docs.docker.com/buildx/working-with-buildx/).

