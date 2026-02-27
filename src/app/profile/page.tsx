'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/use-user'

export default function MyProfilePage() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace(`/profile/${user.id}`)
      } else {
        router.replace('/signin')
      }
    }
  }, [user, loading, router])

  return null
}
