import { existsSync, readFileSync } from 'fs'
import { parse } from 'yaml'
import { FileNotFoundError, InvalidJSONError, InvalidYAMLError } from './errors'
import { getFilePath, loadEnvironments } from './helpers'
import { parser } from './parser'

let hasLoadedEnvironment = false

export function loadConfiguration<T>(configName: string, envFiles?: string[]): T {
  if (!hasLoadedEnvironment) {
    hasLoadedEnvironment = true
    loadEnvironments(envFiles)
  }
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
  try {
    return <T>parser(config)
  } catch (err) {
    throw new Error(err)
  }
}
