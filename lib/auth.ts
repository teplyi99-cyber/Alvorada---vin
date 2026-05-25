import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'

export const getSession = () => getServerSession(authOptions)
export const getCurrentUser = async () => (await getSession())?.user