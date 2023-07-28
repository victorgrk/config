
export function parser(object: any): any {
  const entries = Object.entries(object)
  const populated = entries.map(([key, value]) => {
    if (Array.isArray(value)) {
      return {
        [key]: value.map((v) => {
          if (typeof v === 'object') {
            return parser(v)
          } else {
            return populater(v)

          }
        })
      }
    } else if (typeof value === 'object') {
      return { [key]: parser(value) }
    } else {
      return { [key]: populater(value) }
    }
  })
  return reducer(populated)
}

function reducer(value: Array<any>) {
  return value.reduce((acc, cur) => {
    const [key, value] = Object.entries(cur)[0]
    return { ...(acc || {}), [key]: value }
  }, {} as any)
}

function typeConverter(temp: string) {
  if (temp.match(/^\d+n$/gi)) {
    return BigInt(temp.replace('n', ''))
  } else if (temp !== '' && !isNaN(Number(temp)) && Number.isSafeInteger(Number(temp))) {
    return Number(temp)
  } else if (temp === 'true' || temp === 'false') {
    return temp === 'true'
  } else if (temp === 'null') {
    return null
  } else if (temp === 'undefined') {
    return undefined
  }
  else {
    return temp
  }
}

function envPopulater(value: string): string {
  let temp: string = value
  const regex = new RegExp(/{\s*{\s*(env\.[0-9a-zA-Z_]+):?(.*)\s*}\s*}/gim)
  let m: RegExpExecArray | null = null
  while ((m = regex.exec(temp)) !== null) {
    let [base, env, defaultValue] = m
    env = env.replace('env.', '')
    defaultValue = defaultValue?.trim()
    const envToInject = process.env[env] || defaultValue || ''
    temp = temp.replace(base, envToInject).trim()
  }
  return temp
}

function cwdPopulater(value: string): string {
  let temp: string = value
  const regex = new RegExp(/{\s*{\s*(cwd\(\))\s*}\s*}/gim)
  let m: RegExpExecArray | null = null
  while ((m = regex.exec(temp)) !== null) {
    let [base, env] = m
    env = env.replace('cwd()', process.cwd())
    temp = temp.replace(base, env).trim()
  }
  return temp
}

function prodPopulater(value: string): string {
  let temp: string = value
  const regex = new RegExp(/{\s*{\s*prod\((\'?\"?[0-9a-zA-Z_@&\(\)\*\+\|\\\/\[\]\{\}\,\.\:]+\'?\"?)?\s*\,?\s*(\'?\"?[0-9a-zA-Z_@&\(\)\*\+\|\\\/\[\]\{\}\,\.\:]+\'?\"?)?\)\s*}\s*}/gim)
  const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
  let m: RegExpExecArray | null = null
  while ((m = regex.exec(temp)) !== null) {
    let [base, truthy, falsy] = m
    truthy = truthy?.trim()?.replace(/^\'?\"?([0-9a-zA-Z_@&\(\)\*\+\|\\\/\[\]\{\}\,\.\:]+)\'?\"?$/, '$1') || 'true'
    falsy = falsy?.trim()?.replace(/^\'?\"?([0-9a-zA-Z_@&\(\)\*\+\|\\\/\[\]\{\}\,\.\:]+)\'?\"?$/, '$1') || 'false'
    temp = temp.replace(base, isProd ? truthy : falsy).trim()
  }
  return temp
}

function populater(value: any) {
  if (typeof value === 'string') {
    const env = envPopulater(value)
    const cwd = cwdPopulater(env)
    const prod = prodPopulater(cwd)
    return typeConverter(prod)
  }
  else {
    return value
  }
}
