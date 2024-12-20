import express from 'express';
import { trace } from '@opentelemetry/api';

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/health', (req, res) => {
  const span = trace.getTracer('service-b').startSpan('health-check');
  
  try {
    res.json({ status: 'healthy', service: 'service-b' });
  } finally {
    span.end();
  }
});

app.get('/api/weather', (req, res) => {
  const span = trace.getTracer('service-b').startSpan('get-weather');
  
  try {
    const weather = {
      temperature: Math.round(15 + Math.random() * 15),
      condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
      humidity: Math.round(60 + Math.random() * 20),
      location: 'Sample City'
    };
    
    // Simulate some processing time
    setTimeout(() => {
      res.json({ weather });
    }, Math.random() * 100);
  } finally {
    span.end();
  }
});

app.listen(port, () => {
  console.log(`Service B listening at http://localhost:${port}`);
});
