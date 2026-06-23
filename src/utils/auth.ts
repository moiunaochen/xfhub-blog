import { createHash } from 'node:crypto'

export const PRIVATE_PASSWORD = import.meta.env.PRIVATE_PASSWORD || 'changeme'
export const PRIVATE_SECRET = import.meta.env.PRIVATE_SECRET || 'default-secret'

export function getAuthToken(secret: string): string {
  return createHash('sha256').update('private-auth:' + secret).digest('hex')
}

export function isAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=')
      return [key, val.join('=')]
    })
  )
  return cookies['private_auth'] === getAuthToken(PRIVATE_SECRET)
}

export function getPrivateSlug(path: string): string {
  let slug = path.split('/').pop()?.replace('.md', '') || ''
  if (slug === 'index') {
    const parts = path.split('/')
    if (parts.length > 2) {
      slug = parts[parts.length - 2]
    }
  }
  return slug
}
