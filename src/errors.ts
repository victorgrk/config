export class FileNotFoundError extends Error {
  constructor(file: string) {
    super(`${file} does not exist`)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class InvalidJSONError extends Error {
  constructor(file: string) {
    super(`${file} is not a valid JSON file`)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
export class InvalidYAMLError extends Error {
  constructor(file: string) {
    super(`${file} is not a valid YAML file`)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
