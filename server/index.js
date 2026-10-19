import express from 'express';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 10000;
app.use(cors({ origin: true }));
app.use(express.json({ limit: '64kb' }));
const discoveries = [
 { category: 'PSYCHOLOGY', title: 'The quiet power of deliberate practice', body: 'Skill grows when you work just beyond your comfort zone, get feedback, and repeat with intention.' },
 { category: 'SCIENCE', title: 'Your brain is a prediction machine', body: 'Your mind predicts what comes next, then updates its model when reality disagrees.' },
 { category: 'HISTORY', title: 'Old ideas rarely disappear', body: 'An idea can arrive too early, then become useful when the world catches up.' },
 { category: 'SYSTEMS', title: 'Small rules create big outcomes', body: 'A simple constraint can make a complex system easier to understand and improve.' },
 { category: 'SPACE', title: 'Looking up is looking back', body: 'Light takes time to travel, so distant objects show us the universe as it once was.' }
];
app.get('/', (_req,res)=>res.json({name:'AFTERHOURS API',status:'online',endpoints:['/api/health','/api/discoveries']}));
app.get('/api/health', (_req,res)=>res.json({status:'ok',service:'afterhours-api',timestamp:new Date().toISOString()}));
app.get('/api/discoveries', (_req,res)=>res.json({items:discoveries,count:discoveries.length}));
app.use((_req,res)=>res.status(404).json({error:'Not found'}));
app.listen(port,'0.0.0.0',()=>console.log('AFTERHOURS API listening on '+port));
