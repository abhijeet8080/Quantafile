import React from 'react'
import { Skeleton } from '../ui/skeleton'

const SkeletonLoader  = () => {
  return (
    <div className="w-full min-h-screen py-12 px-4 space-y-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div> 
  )
}

export default SkeletonLoader 