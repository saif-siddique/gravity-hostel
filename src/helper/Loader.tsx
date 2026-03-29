import { Loader2 } from 'lucide-react';
import React from 'react'

interface LoaderInterface {
    isLoading: boolean;
    text?: string;
    className?: string
}

const Loader = ({isLoading, text = 'Submit', className}: LoaderInterface) => {
  return (
    <>
    {isLoading ? <Loader2 className={`${className}`} />: text}
    </>
  )
}

export default Loader
