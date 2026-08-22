import { motion } from 'framer-motion'

const STAGGER = 0.035

/** Adapted from Skiper UI skiper58: https://skiper-ui.com/v1/skiper58 */
export function TextRoll({ children, className = '', center = false }) {
  return <motion.span initial="initial" whileHover="hovered" className={`skiper-text-roll ${className}`} aria-label={children}>
    <span aria-hidden="true">{children.split('').map((letter, index) => {
      const delay = center ? STAGGER * Math.abs(index - (children.length - 1) / 2) : STAGGER * index
      return <motion.span variants={{ initial: { y: 0 }, hovered: { y: '-100%' } }} transition={{ ease: 'easeInOut', delay }} className="skiper-letter" key={index}>{letter === ' ' ? '\u00a0' : letter}</motion.span>
    })}</span>
    <span className="skiper-text-roll-copy" aria-hidden="true">{children.split('').map((letter, index) => {
      const delay = center ? STAGGER * Math.abs(index - (children.length - 1) / 2) : STAGGER * index
      return <motion.span variants={{ initial: { y: '100%' }, hovered: { y: 0 } }} transition={{ ease: 'easeInOut', delay }} className="skiper-letter" key={index}>{letter === ' ' ? '\u00a0' : letter}</motion.span>
    })}</span>
  </motion.span>
}
