"use client"

import { motion } from "framer-motion"
import { Home as HomeIcon, Users, Shield } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: HomeIcon,
      title: "Premium Properties",
      description: "Carefully selected homes that meet the highest standards of quality and comfort"
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Professional agents dedicated to making your real estate journey smooth and successful"
    },
    {
      icon: Shield,
      title: "Trusted Service",
      description: "Years of experience and hundreds of satisfied clients speak to our commitment"
    }
  ]

  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide exceptional service and expertise to help you find the perfect property
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}