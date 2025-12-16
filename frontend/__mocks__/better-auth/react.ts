// Jest stub for `better-auth/react`
// Keeps unit tests independent of Better Auth's ESM build output.

type AuthClient = {
  signIn: (...args: any[]) => Promise<any>
  signUp: (...args: any[]) => Promise<any>
  signOut: (...args: any[]) => Promise<any>
  useSession: () => {
    data: null
    isPending: false
    error: null
  }
}

export function createAuthClient(_config?: any): AuthClient {
  return {
    signIn: async () => ({ ok: true }),
    signUp: async () => ({ ok: true }),
    signOut: async () => ({ ok: true }),
    useSession: () => ({ data: null, isPending: false, error: null }),
  }
}
