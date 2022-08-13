
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
    const regex = new RegExp(/{{\s*(env\.[0-9A-Z_]+)\s*}}/gim)
    let m: RegExpMatchArray | null = null
    while ((m = regex.exec(temp)) !== null) {
      const [, env] = m
      const envToInject = process.env[env.replace('env.', '')] || ''
      temp = temp.replace(env, envToInject).replace(/{{\s*/g, '').replace(/\s*}}/g, '')
    }
    return temp
  } else {
    return value
  }
}
