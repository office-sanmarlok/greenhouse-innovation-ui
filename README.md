# 🌱 Greenhouse of Innovation UI

A botanical-themed project launchpad interface built with Node.js and Express, featuring a unique "Greenhouse" metaphor where projects are represented as growing plants.

## ✨ Features

- **Potted Plant Metaphor**: Each project is visualized as a plant in various growth stages
- **Vitality Vines**: Visual growth indicators based on community votes
- **Garden Beds Navigation**: Weekly project collections organized as garden sections
- **Prize Ribbons**: Top performers get gold, silver, and bronze awards
- **Interactive Voting**: Help projects grow with your votes
- **Plant a New Seed**: Submit new projects to the greenhouse
- **Real-time Growth**: Watch plants grow with animated effects

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd greenhouse-ui
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit:
```
http://localhost:3000
```

## 📦 Project Structure

```
greenhouse-ui/
├── server.js           # Express server setup
├── package.json        # Project dependencies
├── vercel.json        # Vercel deployment config
├── views/             # EJS templates
│   ├── index.ejs      # Main page
│   ├── 404.ejs        # 404 error page
│   ├── error.ejs      # Error page
│   └── partials/      # Reusable components
├── public/            # Static assets
│   ├── css/          # Stylesheets
│   └── js/           # Client-side JavaScript
└── .env.example      # Environment variables template
```

## 🌿 API Endpoints

- `GET /` - Main greenhouse view
- `GET /api/projects` - Get projects for a specific week
- `GET /api/projects/:id` - Get single project details
- `POST /api/projects` - Create a new project
- `POST /api/projects/:id/vote` - Vote for a project
- `GET /api/stats` - Get greenhouse statistics

## 🎨 Design Concept

The UI implements a "Greenhouse of Innovation" metaphor where:
- Projects are "plants" at different growth stages (seedling, sprout, bloom)
- Community votes act as "water" helping plants grow
- Weekly releases are "garden beds" 
- Top performers receive "prize ribbons"
- Users can "plant new seeds" (submit projects)

## 🚢 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

### Environment Variables

Set these in your Vercel dashboard:
- `NODE_ENV`: Set to `production`
- `PORT`: Not needed for Vercel (automatically set)

## 🛠️ Development

### Run in development mode:
```bash
npm run dev
```

### Run in production mode:
```bash
npm start
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.# Test automatic deployment
