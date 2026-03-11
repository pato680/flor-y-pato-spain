import { useEffect, useRef, useState } from 'react'

/**
 * Replicates the real F1 starting lights sequence:
 * all off → 1-2-3-4-5 on sequentially → random pause → all off instantly → repeat
 *
 * @param intervalMs  delay between each light turning on (800ms normal, 400ms fast)
 * @param onCycleEnd  optional callback fired once when lights go out after the first full cycle
 */
export function useF1Lights(intervalMs: number, onCycleEnd?: () => void): number {
  const [lit, setLit] = useState(0)
  const cycleCount = useRef(0)
  const onCycleEndRef = useRef(onCycleEnd)
  onCycleEndRef.current = onCycleEnd

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    let cancelled = false

    function schedule(fn: () => void, ms: number) {
      timer = setTimeout(() => { if (!cancelled) fn() }, ms)
    }

    function startSequence() {
      // Step 0: all off, wait 1200ms before starting
      setLit(0)
      schedule(() => lightUp(1), 1200)
    }

    function lightUp(n: number) {
      setLit(n)
      if (n < 5) {
        schedule(() => lightUp(n + 1), intervalMs)
      } else {
        // All 5 lit → random pause (500-2000ms) then lights out
        const randomPause = 500 + Math.random() * 1500
        schedule(() => {
          setLit(0) // instant off
          cycleCount.current++
          if (cycleCount.current === 1 && onCycleEndRef.current) {
            onCycleEndRef.current()
          }
          // Restart after 1200ms pause
          schedule(startSequence, 1200)
        }, randomPause)
      }
    }

    // Kick off: initial pause then start
    schedule(() => lightUp(1), 1200)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [intervalMs])

  return lit
}
