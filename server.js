const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sample data for projects
const projectsData = {
  week33: [
    {
      id: 1,
      name: 'EcoTracker Pro',
      description: 'Sustainable living metrics dashboard',
      tags: ['React', 'Analytics'],
      votes: 2847,
      growth: 95,
      plantType: 'bloom',
      rank: 1
    },
    {
      id: 2,
      name: 'MindfulAI',
      description: 'Personal wellness AI assistant',
      tags: ['Python', 'ML'],
      votes: 1923,
      growth: 78,
      plantType: 'sprout',
      rank: 2
    },
    {
      id: 3,
      name: 'CodeGarden',
      description: 'Visual code documentation tool',
      tags: ['TypeScript', 'Viz'],
      votes: 1456,
      growth: 65,
      plantType: 'seedling',
      rank: 3
    },
    {
      id: 4,
      name: 'TaskFlow',
      description: 'Kanban board with AI suggestions',
      tags: ['Vue', 'AI'],
      votes: 342,
      growth: 35,
      plantType: 'seedling'
    },
    {
      id: 5,
      name: 'CloudSync',
      description: 'Multi-cloud file synchronization',
      tags: ['Go', 'Cloud'],
      votes: 523,
      growth: 42,
      plantType: 'sprout'
    },
    {
      id: 6,
      name: 'DataViz Pro',
      description: 'Real-time data visualization',
      tags: ['D3.js', 'Charts'],
      votes: 189,
      growth: 28,
      plantType: 'seedling'
    },
    {
      id: 7,
      name: 'SecureVault',
      description: 'Encrypted password manager',
      tags: ['Rust', 'Security'],
      votes: 892,
      growth: 67,
      plantType: 'bloom'
    },
    {
      id: 8,
      name: 'APIForge',
      description: 'GraphQL API generator',
      tags: ['Node', 'GraphQL'],
      votes: 734,
      growth: 55,
      plantType: 'sprout'
    },
    {
      id: 9,
      name: 'SmartNotes',
      description: 'AI-powered note organization',
      tags: ['Swift', 'iOS'],
      votes: 87,
      growth: 15,
      plantType: 'seedling'
    }
  ],
  week32: [
    {
      id: 10,
      name: 'WebFlow Builder',
      description: 'No-code website builder',
      tags: ['JavaScript', 'UI'],
      votes: 1234,
      growth: 72,
      plantType: 'bloom'
    },
    {
      id: 11,
      name: 'DataMiner',
      description: 'Web scraping automation tool',
      tags: ['Python', 'Automation'],
      votes: 876,
      growth: 58,
      plantType: 'sprout'
    }
  ],
  week31: [
    {
      id: 12,
      name: 'ChatBot Pro',
      description: 'Customer service AI chatbot',
      tags: ['NLP', 'AI'],
      votes: 1567,
      growth: 82,
      plantType: 'bloom'
    }
  ]
};

const gardeners = [
  { name: 'Alex Chen', blooms: 12, avatar: 'https://i.pravatar.cc/40?img=1' },
  { name: 'Sarah Kim', blooms: 9, avatar: 'https://i.pravatar.cc/40?img=2' },
  { name: 'Marcus Johnson', blooms: 7, avatar: 'https://i.pravatar.cc/40?img=3' }
];

// Routes
app.get('/', (req, res) => {
  const currentWeek = req.query.week || 'week33';
  const projects = projectsData[currentWeek] || projectsData.week33;
  
  res.render('index', {
    projects,
    currentWeek,
    weeks: Object.keys(projectsData).map(week => ({
      id: week,
      label: `Week ${week.slice(4)}`,
      count: projectsData[week].length
    })),
    gardeners
  });
});

// API Routes
app.get('/api/projects', (req, res) => {
  const week = req.query.week || 'week33';
  res.json({
    success: true,
    data: projectsData[week] || []
  });
});

app.get('/api/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  let foundProject = null;
  
  for (const week in projectsData) {
    const project = projectsData[week].find(p => p.id === projectId);
    if (project) {
      foundProject = project;
      break;
    }
  }
  
  if (foundProject) {
    res.json({ success: true, data: foundProject });
  } else {
    res.status(404).json({ success: false, message: 'Project not found' });
  }
});

app.post('/api/projects/:id/vote', (req, res) => {
  const projectId = parseInt(req.params.id);
  
  for (const week in projectsData) {
    const project = projectsData[week].find(p => p.id === projectId);
    if (project) {
      project.votes += 1;
      project.growth = Math.min(100, project.growth + Math.random() * 5);
      
      return res.json({
        success: true,
        data: {
          votes: project.votes,
          growth: project.growth
        }
      });
    }
  }
  
  res.status(404).json({ success: false, message: 'Project not found' });
});

app.post('/api/projects', (req, res) => {
  const { name, description, tags } = req.body;
  
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: 'Name and description are required'
    });
  }
  
  const newProject = {
    id: Date.now(),
    name,
    description,
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    votes: 0,
    growth: 5,
    plantType: 'seedling'
  };
  
  // Add to current week
  if (!projectsData.week34) {
    projectsData.week34 = [];
  }
  projectsData.week34.push(newProject);
  
  res.json({
    success: true,
    data: newProject
  });
});

app.get('/api/stats', (req, res) => {
  let totalProjects = 0;
  let totalVotes = 0;
  
  for (const week in projectsData) {
    totalProjects += projectsData[week].length;
    totalVotes += projectsData[week].reduce((sum, p) => sum + p.votes, 0);
  }
  
  res.json({
    success: true,
    data: {
      totalProjects,
      totalVotes,
      totalWeeks: Object.keys(projectsData).length,
      totalGardeners: gardeners.length
    }
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: err });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌱 Greenhouse of Innovation is growing on port ${PORT}`);
  console.log(`🌿 Visit http://localhost:${PORT} to explore the garden`);
});