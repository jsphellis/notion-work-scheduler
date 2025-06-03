# Notion Work Scheduler

A beautiful and intuitive time tracking application that integrates with Notion to help you log and visualize your work hours. Perfect for freelancers, remote workers, and anyone who wants to keep track of their productivity.

## ✨ Features

- **📅 Calendar View**: Visual calendar showing logged hours for each day
- **📊 Week View**: Detailed weekly breakdown with daily summaries
- **📈 Statistics**: Comprehensive analytics with project breakdowns and trends
- **🔄 Notion Integration**: Seamlessly sync your time entries to a Notion database
- **💾 Local Storage**: Your data is saved locally even without Notion setup
- **📱 Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **🎨 Modern UI**: Clean, professional interface built with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Notion account (for integration)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd notion-work-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**
   
   In one terminal (frontend):
   ```bash
   npm run dev
   ```
   
   In another terminal (backend):
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Notion Setup

To sync your time entries with Notion:

### 1. Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Work Scheduler")
4. Copy the "Internal Integration Token"

### 2. Create a Database

Create a new database in Notion with these columns:

| Column Name | Type | Required |
|------------|------|----------|
| Project | Title | ✅ |
| Description | Text | ✅ |
| Date | Date | ✅ |
| Hours | Number | ✅ |
| Start Time | Text | ❌ |
| End Time | Text | ❌ |

### 3. Share Database with Integration

1. Open your database in Notion
2. Click "Share" in the top right
3. Add your integration by name
4. Copy the database ID from the URL

### 4. Configure in App

1. Go to the "Notion Setup" tab in the app
2. Enter your API token and database ID
3. Click "Test Connection"
4. Start logging time! 🎉

## 📊 Usage

### Logging Time

1. Click the "Log Time" button
2. Fill in:
   - **Project**: What you're working on
   - **Description**: Details about the work
   - **Hours**: Time spent (supports decimals like 2.5)
   - **Start/End Time**: Optional time range
3. Click "Save Entry"

### Viewing Data

- **Calendar**: See daily totals and click dates for details
- **Week View**: Detailed weekly breakdown with summaries
- **Statistics**: Monthly comparisons, project breakdowns, and trends

### Syncing with Notion

Once configured, all new time entries automatically sync to your Notion database. You can also view and edit entries directly in Notion.

## 🏗️ Project Structure

```
notion-work-scheduler/
├── src/
│   ├── components/          # React components
│   │   ├── TimeEntryForm.jsx
│   │   ├── WeekView.jsx
│   │   ├── Stats.jsx
│   │   └── NotionSetup.jsx
│   ├── App.jsx             # Main application
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
├── server.js               # Express backend
├── package.json
└── README.md
```

## 🛠️ Development

### Frontend (Vite + React)

- Built with React 18 and Vite for fast development
- Styled with Tailwind CSS for modern UI
- Uses date-fns for date manipulation
- Local storage for data persistence

### Backend (Express + Node.js)

- Express server for Notion API integration
- CORS enabled for local development
- Error handling for Notion API edge cases
- RESTful API design

### Key Dependencies

- **@notionhq/client**: Official Notion API client
- **react-calendar**: Beautiful calendar component
- **date-fns**: Modern date utility library
- **lucide-react**: Beautiful icon library
- **tailwindcss**: Utility-first CSS framework

## 🔒 Privacy & Security

- **Local Storage**: All data is stored locally in your browser
- **No Analytics**: We don't track your usage or data
- **Secure API**: Your Notion tokens are only used for direct API calls
- **Open Source**: Full source code is available for inspection

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting platform

### Backend (Railway/Heroku)

1. Deploy `server.js` to your backend platform
2. Set environment variables:
   - `PORT`: Server port (default: 3001)
   - `NODE_ENV`: production

### Environment Variables

Create a `.env` file for local development:
```
PORT=3001
NODE_ENV=development
```

## 📝 API Endpoints

- `POST /api/notion/test` - Test Notion connection
- `POST /api/notion/entries` - Add time entry to Notion
- `POST /api/notion/entries/sync` - Sync entries from Notion
- `GET /api/health` - Health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## ❓ Support

Having issues? Check these common solutions:

### "Database not found"
- Ensure the database ID is correct
- Make sure you've shared the database with your integration

### "Invalid API token"
- Verify your integration token is correct
- Check that the integration has access to the workspace

### "Missing required properties"
- Ensure your database has all required columns
- Column names must match exactly (case-sensitive)

## 🎯 Roadmap

- [ ] Time tracking with start/stop functionality
- [ ] Export data to CSV/PDF
- [ ] Multiple workspace support
- [ ] Mobile app (React Native)
- [ ] Advanced reporting features
- [ ] Team collaboration features

---

Built with ❤️ using React, Node.js, and the Notion API 