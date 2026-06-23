import { useMotionValue } from 'motion/react'
import { PrologueModeContext } from './PrologueMode'
import { BeatHook } from './beats/BeatHook'
import { BeatTokenize } from './beats/BeatTokenize'
import { BeatEmbed } from './beats/BeatEmbed'
import { BeatAttention } from './beats/BeatAttention'
import { BeatPredictOutput } from './beats/BeatPredictOutput'
import { BeatProvenanceVow } from './beats/BeatProvenanceVow'
import { BeatChoosePath } from './beats/BeatChoosePath'

/**
 * Reduced-motion / ?prologue=static variant: the same seven beats as the
 * animated prologue, rendered in normal flow at full visibility with no sticky
 * pin and no scroll subscription. Reuses the Beat* components verbatim (via the
 * 'static' PrologueMode), so every number — including beat-4's sky.json 71% —
 * is identical to the animated tree by construction (no content drift / G1).
 */
export function PrologueStatic() {
  // Inert: satisfies the Beat* scrollYProgress prop; BeatShell ignores it in static mode.
  const staticProgress = useMotionValue(0)
  return (
    <PrologueModeContext value="static">
      <div className="prologue-static">
        <BeatHook scrollYProgress={staticProgress} />
        <BeatTokenize scrollYProgress={staticProgress} />
        <BeatEmbed scrollYProgress={staticProgress} />
        <BeatAttention scrollYProgress={staticProgress} />
        <BeatPredictOutput scrollYProgress={staticProgress} />
        <BeatProvenanceVow scrollYProgress={staticProgress} />
        <BeatChoosePath scrollYProgress={staticProgress} />
      </div>
    </PrologueModeContext>
  )
}
