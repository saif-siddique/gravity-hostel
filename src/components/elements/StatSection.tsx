"use client"
import React from 'react'

const StatSection = () => {
  const stats = [
    { number: "99.9", suffix: "%", label: "System Uptime", description: "Enterprise-grade reliability" },
    { number: "500", suffix: "+", label: "Active Residents", description: "Growing community" },
    { number: "5000", suffix: "+", label: "Alumni Network", description: "Since establishment" },
    { number: "24", suffix: "/7", label: "Support Available", description: "Always here for you" },
  ];

  return (
    <section className="py-24 relative bg-muted/30">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">By The Numbers</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Trusted Performance Metrics</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="relative group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.number}
                  </span>
                  <span className="text-primary">{stat.suffix}</span>
                </div>
                <div className="text-base font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-primary/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Subtle bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default StatSection;
