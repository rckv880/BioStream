# BioStream
Pharma Workflow

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Docker

Build and run the application in a Docker container:

```bash
# Build the image
docker build -t biostream .

# Run the container
docker run -d -p 80:80 biostream
```

## Deploying to GCP

This project includes a GitHub Actions workflow for deploying to a GCP Ubuntu instance. To use it, configure the following secrets in your GitHub repository:

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | Your GCP project ID |
| `GCP_SA_KEY` | Service account key JSON with permissions for Compute Engine and Container Registry |
| `GCE_INSTANCE` | Name of your GCE instance |
| `GCE_INSTANCE_ZONE` | Zone where your GCE instance is located (e.g., `us-central1-a`) |

### GCP Setup Requirements

1. **GCE Instance**: Create an Ubuntu instance with Docker installed
2. **Service Account**: Create a service account with the following roles:
   - Compute Instance Admin (v1)
   - Storage Admin (for Container Registry)
3. **Firewall**: Allow HTTP traffic (port 80) to your instance

The workflow will automatically:
1. Build the Docker image
2. Push it to Google Container Registry
3. Deploy to your GCE instance

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
