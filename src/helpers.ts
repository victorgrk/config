import { join } from 'path'
import { cwd } from 'process'

export function getFilePath(fileName: string) {
  return join(cwd(), 'configs', `${fileName}`)
}
