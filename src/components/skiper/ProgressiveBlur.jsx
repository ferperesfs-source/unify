import React from 'react'

/**
 * Skiper UI skiper41 — Progressive Blur.
 * Source: https://skiper-ui.com/v1/skiper41
 * Free license requires attribution to Skiper UI.
 */
export function ProgressiveBlur({ className = '', backgroundColor = '#15151a', position = 'top', height = '150px', blurAmount = '4px' }) {
  const isTop = position === 'top'
  return <div className={`skiper-progressive-blur ${className}`} style={{
    [isTop ? 'top' : 'bottom']: 0,
    height,
    background: isTop ? `linear-gradient(to top, transparent, ${backgroundColor})` : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
    maskImage: isTop ? `linear-gradient(to bottom, ${backgroundColor} 50%, transparent)` : `linear-gradient(to top, ${backgroundColor} 50%, transparent)`,
    WebkitBackdropFilter: `blur(${blurAmount})`,
    backdropFilter: `blur(${blurAmount})`,
    WebkitUserSelect: 'none',
    userSelect: 'none',
  }} />
}
