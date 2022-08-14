import { readFileSync } from 'fs'
import { resolve } from 'path'
import { cwd } from 'process'

export function getFilePath(fileName: string) {
  return resolve(cwd(), 'configs', `${fileName}`)
}
const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg
function parseEnvironment(src: string) {
  const obj = new Map<string, string>()
  let lines = src.toString()
  lines = lines.replace(/\r\n?/mg, '\n')
  let match
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1]
    let value = (match[2] || '').trim()
    const maybeQuote = value[0]
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2')
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n').replace(/\\r/g, '\r')
    }
    obj.set(key, value)
  }
  return obj
}

export function loadEnvironments(files = ['.env']) {
  for (let file of files) {
    loadEnvironment(file)
  }
}

function loadEnvironment(file = '.env'): void {
  let dotenvPath = resolve(process.cwd(), file)
  try {
    const map = parseEnvironment(readFileSync(dotenvPath, { encoding: 'utf-8' }))
    const env = {
      ...process.env,
      ...Object.fromEntries(map),
    }
    Object.defineProperty(process, 'env', {
      value: env,
    })
    return
  } catch (e) {
    return
  }
}
