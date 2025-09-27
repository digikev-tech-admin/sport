import { RefreshCcw } from 'lucide-react'
import React from 'react'

const ButtonLoader = ({ text }: { text: string }) => {
  return (
      <div className="flex items-center gap-2">
        <RefreshCcw className="animate-spin" size={18} />
        <span>{text}</span>
      </div>
  )
}

export default ButtonLoader