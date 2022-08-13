import { existsSync, readFileSync } from 'fs'
import { parse } from 'yaml'
import { FileNotFoundError, InvalidJSONError, InvalidYAMLError } from './errors'
import { getFilePath } from './helpers'
import { parser } from './parser'

export function loadConfiguration<T>(configName: string) {
  const filePath = getFilePath(configName)
  if (!existsSync(filePath)) {
    throw new FileNotFoundError(configName)
  }
  const fileContent = readFileSync(filePath, 'utf8')
  let config: T | null = null
  if (configName.endsWith('.json')) {
    try {
      config = <T>JSON.parse(fileContent)
    } catch (error) {
      throw new InvalidJSONError(configName)
    }
  } else if (configName.endsWith('.yaml') || configName.endsWith('.yml')) {
    try {
      config = <T>parse(fileContent)
    } catch (error) {
      throw new InvalidYAMLError(configName)
    }
  }
  if (config) {
    return parser(config)
  }
  return null
}
