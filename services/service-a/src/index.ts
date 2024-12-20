import express from 'express';
import { trace } from '@opentelemetry/api';
import promClient from 'prom-client';
import responseTime from 'response-time';

// Initialize Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const app = express();
const port = process.env.PORT || 3000;

// Add response time middleware
app.use(responseTime((req: any, res: any, time: any) => {
  httpRequestDuration
    .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
    .observe(time / 1000);
}));

// Add metrics endpoint with logging
app.get('/metrics', async (req: any, res: any) => {
  console.log('Metrics endpoint accessed');
  res.set('Content-Type', promClient.register.contentType);
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const metrics = await promClient.register.metrics();
    console.log('Metrics generated successfully');
    res.send(metrics);
  } catch (err) {
    console.error('Error generating metrics:', err);
    res.status(500).send('Error generating metrics');
  }
});

app.get('/api/health', (req: any, res: any) => {
  const span = trace.getTracer('service-a').startSpan('health-check');
  
  try {
    res.json({ status: 'healthy', service: 'service-a' });
  } finally {
    span.end();
  }
});

app.get('/api/users', (req: any, res: any) => {
  const span = trace.getTracer('service-a').startSpan('get-users');
  
  try {
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
      { id: 3, name: 'Bob Johnson' }
    ];
    
    // Simulate some processing time
    setTimeout(() => {
      res.json({ users });
    }, Math.random() * 100);
  } finally {
    span.end();
  }
});

app.listen(port, () => {
  console.log(`Service A listening at http://localhost:${port}`);
});
