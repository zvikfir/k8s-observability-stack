load('ext://helm_remote', 'helm_remote')

# Create observability namespace
k8s_yaml(encode_yaml({
    'apiVersion': 'v1',
    'kind': 'Namespace',
    'metadata': {
        'name': 'observability'
    }
}))

# Enable Docker builds
docker_build('service-a', './services/service-a', 
  build_args={'NPM_COMMAND': 'npm'})
docker_build('service-b', './services/service-b', 
  build_args={'NPM_COMMAND': 'npm'})

# Replace prometheus-operator with standard prometheus and grafana
helm_remote('prometheus',
           repo_name='prometheus-community',
           repo_url='https://prometheus-community.github.io/helm-charts',
           release_name='prometheus',
           namespace='observability',
           values='charts/monitoring/prometheus-values.yaml')  # Updated path

helm_remote('grafana',
           repo_name='grafana',
           repo_url='https://grafana.github.io/helm-charts',
           release_name='grafana',
           namespace='observability',
           values='charts/monitoring/grafana-values.yaml')

helm_remote('kong',
           repo_name='kong',
           repo_url='https://charts.konghq.com',
           namespace='observability',
           values='charts/kong/values.yaml')

# Install services chart with namespace
k8s_yaml(helm('charts/services', namespace='observability'))

# Resource dependencies (remove namespace parameter)
k8s_resource('service-a', port_forwards='3000:3000')
k8s_resource('service-b', port_forwards='3001:3000')
k8s_resource('kong-kong', 
    port_forwards=[
        '8000:8000',  # Proxy
        '8001:8001',  # Admin API
        '8002:8002',  # Admin GUI
    ],
    resource_deps=['service-a', 'service-b'])

# Update resource configurations with readiness probes
k8s_resource('prometheus-server', 
    port_forwards='9090:9090',
    labels=['monitoring'])

k8s_resource('prometheus-kube-state-metrics', 
    labels=['monitoring'],
    resource_deps=['prometheus-server'])

k8s_resource('prometheus-prometheus-node-exporter', 
    labels=['monitoring'],
    resource_deps=['prometheus-server'])

k8s_resource('grafana', 
    port_forwards='3002:3000',
    labels=['monitoring'],
    resource_deps=['prometheus-server'])
