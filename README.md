# Kubernetes Observability Stack

A complete observability stack for Kubernetes demonstrating monitoring, logging, and tracing using industry-standard tools.

## Features

- **Metrics Collection**: Prometheus with custom service metrics
- **Log Aggregation**: Loki with structured logging (Winston)
- **Visualization**: Grafana dashboards
- **API Gateway**: Kong for service routing
- **Auto-rotation**: Log rotation and size management
- **Resource Monitoring**: Node and container-level metrics

## Prerequisites

### Required Tools
```bash
# Docker Desktop with Kubernetes
# - Minimum 4GB memory allocated
# - Kubernetes enabled in settings
# - Version 4.x or higher

# Tilt
curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash

# Helm 3
brew install helm  # macOS
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add kong https://charts.konghq.com
helm repo update

# kubectl
brew install kubectl  # macOS
```

## Stack Components

### Monitoring
- **Prometheus**: Metrics collection and storage
  - Service metrics via prom-client
  - Node metrics via node-exporter
  - Kubernetes state metrics
- **Grafana**: Visualization (http://localhost:3002)
  - Services Dashboard
  - Operations Dashboard
  - Kong Dashboard
  - Logs Dashboard

### Logging
- **Loki**: Log aggregation and querying
- **Promtail**: Log collection with rotation
  - Max file size: 10Mi
  - Retention: 24h
- **Winston**: Structured logging in services

### API Gateway
- **Kong**: Service routing and API management
  - Admin API: http://localhost:8001
  - Proxy: http://localhost:8000

### Example Services
- **Service A**: Example Node.js service with:
  - Custom metrics
  - Structured logging
  - Trace instrumentation
- **Service B**: Similar setup for comparison

## Quick Start

1. **Prepare Environment**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/k8s-observability-stack.git
   cd k8s-observability-stack

   # Start Docker Desktop
   # Enable Kubernetes in settings
   ```

2. **Deploy Stack**
   ```bash
   # Start all services
   tilt up
   ```

3. **Verify Installation**
   ```bash
   # Check pods
   kubectl get pods -n observability

   # Check services
   kubectl get svc -n observability
   ```

## Access Points

| Service | URL | Credentials |
|---------|-----|------------|
| Grafana | http://localhost:3002 | admin/admin |
| Prometheus | http://localhost:9090 | N/A |
| Loki | http://localhost:3100 | N/A |
| Service A | http://localhost:3000 | N/A |
| Service B | http://localhost:3001 | N/A |
| Kong Admin | http://localhost:8001 | N/A |

## Project Structure

```
├── charts/
│   ├── monitoring/           # Helm values for monitoring stack
│   │   ├── grafana-values.yaml
│   │   ├── loki-values.yaml
│   │   └── prometheus-values.yaml
│   ├── services/            # Microservices Helm charts
│   └── kong/               # API Gateway configuration
├── services/
│   ├── service-a/          # Example service with Winston logging
│   └── service-b/          # Example service
└── Tiltfile               # Tilt configuration
```

## Development

### Adding New Services

1. Create service directory in `services/`
2. Add Helm chart in `charts/services/`
3. Update `Tiltfile`
4. Add metrics to Grafana dashboard

### Modifying Configuration

1. Update values in `charts/monitoring/`
2. Update service configuration in `charts/services/`
3. Run `tilt up` to apply changes

## Troubleshooting

### Common Issues

1. **Memory Pressure**
   ```bash
   # Check resource usage
   kubectl top pods -n observability
   ```

2. **Log Collection Issues**
   ```bash
   # Check Promtail logs
   kubectl logs -l app=promtail -n observability
   ```

3. **Service Discovery**
   ```bash
   # Verify service endpoints
   kubectl get endpoints -n observability
   ```

### Known Limitations

- Persistence not enabled by default
- Single-node deployment optimized for development
- Limited to local Kubernetes cluster

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit Pull Request

## License

MIT License - See LICENSE file for details
