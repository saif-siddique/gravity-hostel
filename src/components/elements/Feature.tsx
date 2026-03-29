"use client"
import React from 'react';
import { TrendingUp, Home, Globe, ArrowRight } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Revenue Management",
      description: "Streamlined billing and payment processing with automated invoicing, real-time tracking, and comprehensive financial reporting. Zero hidden charges, complete transparency.",
      color: "emerald",
      stats: "98% collection rate"
    },
    {
      icon: Home,
      title: "Maintenance Excellence",
      description: "Industry-leading response times with our dedicated maintenance team. From routine upkeep to emergency repairs, we ensure your living space is always in perfect condition.",
      color: "blue",
      stats: "< 24hr response time"
    },
    {
      icon: Globe,
      title: "24/7 Concierge Support",
      description: "Round-the-clock assistance from our trained support team. Whether it's a query, concern, or emergency, help is always just a message away.",
      color: "purple",
      stats: "Always available"
    }
  ];

  const colorClasses: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-500",
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-500",
      badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-500",
      badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-muted/30 relative">
      {/* Section borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
            Built for Excellence
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We don't just provide accommodation—we deliver an unparalleled living experience
            backed by enterprise-grade operations and personalized care.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto space-y-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Icon */}
                <div className={`flex-shrink-0 w-14 h-14 ${colorClasses[feature.color].bg} ${colorClasses[feature.color].border} border rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${colorClasses[feature.color].text}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{feature.title}</h3>
                    <span className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full ${colorClasses[feature.color].badge}`}>
                      {feature.stats}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>

                {/* Arrow indicator */}
                <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 border border-border group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section borders */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default FeaturesSection;