import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, Flash, TickCircle } from 'iconsax-react'

/** Adapted from Skiper UI skiper3: https://skiper-ui.com/v1/skiper3 */
export function ExpandingAction({ onComplete }) {
  const [expanded, setExpanded] = useState(false)
  return <motion.button layout type="button" className={`skiper-expand ${expanded ? 'expanded' : ''}`}
    style={{ borderRadius: 9999, width: expanded ? 330 : 60 }}
    initial={{ scale: 0, y: '100%' }} animate={{ scale: 1, y: 0, width: expanded ? 330 : 60 }}
    transition={{ type: 'spring', bounce: 0.16 }} onClick={() => expanded ? onComplete?.() : setExpanded(true)}
    aria-label={expanded ? 'Abrir workspace' : 'Expandir demonstração'}>
    <motion.span layout className="skiper-expand-lead"><Flash size="20" variant="Bold" /></motion.span>
    {expanded && <motion.span className="skiper-expand-copy" initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ delay: .2 }}><TickCircle size="17" variant="Bold" /> Workspace pronto</motion.span>}
    {expanded && <motion.span className="skiper-expand-go" initial={{ opacity: 0, scale: .5, filter: 'blur(4px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ delay: .25 }}><ArrowRight size="19" /></motion.span>}
  </motion.button>
}
