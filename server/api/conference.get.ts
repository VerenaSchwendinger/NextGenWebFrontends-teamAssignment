import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Reads the dataset from disk on every call, so edits show up without a rebuild.
// `npm run dev` and `npm run build` run in the project root, `npm run preview`
// starts the server inside `.output`. Both locations are tried.
const DATA_PATHS = [
  join(process.cwd(), 'app/data/conference-data.json'),
  join(process.cwd(), '..', 'app/data/conference-data.json'),
]

export default defineEventHandler(async () => {
  for (const path of DATA_PATHS) {
    try {
      return JSON.parse(await readFile(path, 'utf-8'))
    } catch {
      // try the next location
    }
  }
  throw createError({ statusCode: 500, statusMessage: 'Konferenzdaten konnten nicht gelesen werden' })
})