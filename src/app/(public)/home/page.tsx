import BentoGrids from '@/components/elements/BentoGrids'
import CTASection from '@/components/elements/CTASection'
import FeaturesSection from '@/components/elements/Feature'
import { SpotlightPreview } from '@/components/elements/Spotlight'
import StatSection from '@/components/elements/StatSection'

const page = () => {
  return (
    <div>
      <SpotlightPreview />
      <StatSection />
      <BentoGrids />
      <CTASection />
      <FeaturesSection />
    </div>
  )
}

export default page
