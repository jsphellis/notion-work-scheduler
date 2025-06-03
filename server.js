import express from 'express'
import cors from 'cors'
import { Client } from '@notionhq/client'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Test Notion connection
app.post('/api/notion/test', async (req, res) => {
  try {
    const { apiToken, databaseId } = req.body

    if (!apiToken || !databaseId) {
      return res.status(400).json({ error: 'API token and database ID are required' })
    }

    const notion = new Client({ auth: apiToken })

    // Test by retrieving database info
    const database = await notion.databases.retrieve({
      database_id: databaseId
    })

    // Check if required properties exist
    const properties = database.properties
    const requiredProps = ['Project', 'Description', 'Date', 'Hours']
    const missingProps = requiredProps.filter(prop => !properties[prop])

    if (missingProps.length > 0) {
      return res.status(400).json({
        error: `Database is missing required properties: ${missingProps.join(', ')}`
      })
    }

    res.json({ 
      success: true, 
      message: 'Connection successful',
      database: {
        title: database.title[0]?.plain_text || 'Untitled',
        properties: Object.keys(properties)
      }
    })
  } catch (error) {
    console.error('Notion connection error:', error)
    
    if (error.code === 'object_not_found') {
      res.status(404).json({ error: 'Database not found. Please check the database ID.' })
    } else if (error.code === 'unauthorized') {
      res.status(401).json({ error: 'Invalid API token or database not shared with integration.' })
    } else {
      res.status(500).json({ error: 'Failed to connect to Notion. Please check your credentials.' })
    }
  }
})

// Add time entry to Notion
app.post('/api/notion/entries', async (req, res) => {
  try {
    const { entry, config } = req.body

    if (!config?.apiToken || !config?.databaseId) {
      return res.status(400).json({ error: 'Notion configuration not found' })
    }

    const notion = new Client({ auth: config.apiToken })

    // Prepare the properties for Notion
    const properties = {
      Project: {
        title: [
          {
            text: {
              content: entry.project
            }
          }
        ]
      },
      Description: {
        rich_text: [
          {
            text: {
              content: entry.description
            }
          }
        ]
      },
      Date: {
        date: {
          start: entry.date.split('T')[0] // Convert ISO string to date
        }
      },
      Hours: {
        number: entry.hours
      }
    }

    // Add optional time fields if they exist
    if (entry.startTime) {
      properties['Start Time'] = {
        rich_text: [
          {
            text: {
              content: entry.startTime
            }
          }
        ]
      }
    }

    if (entry.endTime) {
      properties['End Time'] = {
        rich_text: [
          {
            text: {
              content: entry.endTime
            }
          }
        ]
      }
    }

    const response = await notion.pages.create({
      parent: {
        database_id: config.databaseId
      },
      properties
    })

    res.json({ 
      success: true, 
      message: 'Time entry added to Notion',
      pageId: response.id
    })
  } catch (error) {
    console.error('Error adding entry to Notion:', error)
    res.status(500).json({ error: 'Failed to add entry to Notion' })
  }
})

// Get time entries from Notion (optional - for syncing)
app.post('/api/notion/entries/sync', async (req, res) => {
  try {
    const { config } = req.body

    if (!config?.apiToken || !config?.databaseId) {
      return res.status(400).json({ error: 'Notion configuration not found' })
    }

    const notion = new Client({ auth: config.apiToken })

    const response = await notion.databases.query({
      database_id: config.databaseId,
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ]
    })

    // Transform Notion pages to our format
    const entries = response.results.map(page => {
      const props = page.properties
      
      return {
        id: page.id,
        project: props.Project?.title?.[0]?.plain_text || '',
        description: props.Description?.rich_text?.[0]?.plain_text || '',
        date: props.Date?.date?.start || '',
        hours: props.Hours?.number || 0,
        startTime: props['Start Time']?.rich_text?.[0]?.plain_text || '',
        endTime: props['End Time']?.rich_text?.[0]?.plain_text || '',
        createdAt: page.created_time
      }
    })

    res.json({ success: true, entries })
  } catch (error) {
    console.error('Error syncing from Notion:', error)
    res.status(500).json({ error: 'Failed to sync entries from Notion' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API endpoints available at http://localhost:${PORT}/api`)
}) 