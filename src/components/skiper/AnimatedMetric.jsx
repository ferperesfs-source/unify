import React, { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

/**
 * Adapted directly from Skiper UI skiper37 AnimatedNumber_002.
 * Source: https://skiper-ui.com/v1/skiper37
 * Free license requires attribution to Skiper UI.
 */
export function AnimatedMetric({ value = 0, className = '' }) {
  const [displayValue, setDisplayValue] = useState(0)
  const springValue = useSpring(0, { bounce: 0, duration: 900 })

  useEffect(() => springValue.on('change', latest => setDisplayValue(Math.round(latest))), [springValue])
  useEffect(() => { springValue.set(Number(value) || 0) }, [springValue, value])

  return <motion.span className={className} initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }}>{displayValue}</motion.span>
}
