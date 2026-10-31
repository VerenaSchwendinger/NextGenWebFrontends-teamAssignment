import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Reads the dataset from disk on every call, so edits show up without a rebuild.
// Paths are resolved from the project root, which is the working directory
// for `npm run dev`, `npm run build` (prerender) and `npm run preview`.
const DATA_PATH = join(process.cwd(), 'app/data/conference-data.json')

export default defineEventHandler(async () => {
  try {
    const raw = await readFile(DATA_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Konferenzdaten konnten nicht gelesen werden' })
  }
})