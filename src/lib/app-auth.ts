import 'server-only'

import { cookies } from 'next/headers'
import { JWTAuthentication } from 'payload'
import { getPayloadClient } from '@/lib/payload'

const SESSION_COOKIE = 'app-session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7
const isSecureOrigin =
  process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://') ??
  process.env.NODE_ENV === 'production'

type AppUser = {
  id: number | string
  collection: 'users'
  email: string
  name?: string | null
}

const cookieOptions = {
  httpOnly: true,
  maxAge: SESSION_MAX_AGE,
  path: '/',
  sameSite: 'lax' as const,
  secure: isSecureOrigin,
}

export function createAppAuth(appUserCollection: 'users') {
  return {
    async currentUser(): Promise<AppUser | null> {
      const token = (await cookies()).get(SESSION_COOKIE)?.value
      if (!token) return null

      const payload = await getPayloadClient()
      // Run Payload's native local-JWT strategy directly so the Figma CMS
      // strategy cannot interpret this isolated app token as a platform token.
      const { user } = await JWTAuthentication({
        headers: new Headers({ Authorization: `JWT ${token}` }),
        payload,
        strategyName: 'app-jwt',
      })

      if (!user || user.collection !== appUserCollection) return null
      return user as AppUser
    },

    async login(email: string, password: string): Promise<AppUser> {
      const payload = await getPayloadClient()
      const result = await payload.login({
        collection: appUserCollection,
        data: { email, password },
        overrideAccess: false,
      })

      if (!result.token || !result.user || result.user.collection !== appUserCollection) {
        throw new Error('Unable to start a secure session.')
      }

      ;(await cookies()).set(SESSION_COOKIE, result.token, cookieOptions)
      return result.user as AppUser
    },

    async logout() {
      ;(await cookies()).set(SESSION_COOKIE, '', {
        ...cookieOptions,
        maxAge: 0,
      })
    },
  }
}

export const appAuth = createAppAuth('users')
