import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()
const table = 'tasks'

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body

      if (!title) {
        return response.writeHead(400).end(
          JSON.stringify({ message: 'title is required' })
        )
      }

      if (!description) { 
        return response.writeHead(400).end(
          JSON.stringify({ message: 'description is required' })
        )
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        update_at: new Date()
      }

      database.insert(table, task)

      return response.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { search } = request.query

      const tasks = database.select(table, {
        title: search,
        description: search
      })

      return response.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const { title, description } = request.body

      if (!title || !description) {
        return response.writeHead(400).end(
          JSON.stringify({ message: 'title and description are required'})
        )
      }

      const [task] = database.select(table, {id})

      if (!task) {
        return response.writeHead(404).end(JSON.stringify('task not find'))
      }

      database.update(table, id, {
        title,
        description,
        update_at: new Date()
      })

      return response.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params

      const [task] = database.select(table, {id})

      if (!task) {
        return response.writeHead(404).end(JSON.stringify("task not find"))
      }

      database.delete(table, id)

      return response.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params

      const [task] = database.select(table, { id })

      if (!task) {
        return response.writeHead(404).end(JSON.stringify("task not find"))
      }

      const isTaskCompleted = !!task.complement_at
      const completed_at = isTaskCompleted ? null : new Date()
      database.update(table, id, { completed_at })

      return response.writeHead(204).end()
    }
  }
]