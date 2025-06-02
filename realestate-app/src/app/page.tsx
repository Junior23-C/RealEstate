import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NavbarWrapper } from "@/components/navbar-wrapper"
import { Footer } from "@/components/footer"
import { FeaturedProperties } from "@/components/featured-properties"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CTASection } from "@/components/cta-section"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      <NavbarWrapper />
      
      <HeroSection />
      
      <FeaturesSection />

      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prona të Zgjedhura</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Eksploroni përzgjedhjen tonë të kujdesshme të pronave premium
            </p>
          </div>
          
          <FeaturedProperties />
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/properties">
                Shiko të Gjitha Pronat
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <CTASection />

      <Footer />
    </div>
  )
}