
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

function populater(value: any) {
  if (typeof value === 'string') {
    let temp: string = value
    const regex = new RegExp(/{\s*{\s*(env\.[0-9A-Z_]+):?(.*)\s*}\s*}/gim)
    let m: RegExpExecArray | null = null
    while ((m = regex.exec(temp)) !== null) {
      let [base, env, defaultValue] = m
      env = env.replace('env.', '')
      defaultValue = defaultValue?.trim()
      const envToInject = process.env[env] || defaultValue || ''
      temp = temp.replace(base, envToInject).trim()
    }
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
  } else {
    return value
  }
}
