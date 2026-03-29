import React from "react";
import {
  Building2,
  Shield,
  Zap,
  BarChart3,
  Smartphone,
  Clock,
  Users,
  Wifi,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

const BentoGrids = () => {
  return (
    <section id="features" className="relative py-24 lg:py-32 px-6 overflow-x-hidden bg-background">
      {/* Ambient background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20 max-w-3xl mx-auto">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Platform Capabilities</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Everything You Need.
            <span className="block text-muted-foreground mt-2">Leave On Us</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A comprehensive suite of tools designed for modern hostel operations.
            Built with enterprise-grade technology, optimized for daily use.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6">

          {/* Large featured card - Intelligent Room Management */}
          <div className="md:col-span-2 lg:col-span-4 lg:row-span-2 group relative bg-card border border-border rounded-3xl p-8 lg:p-10 overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
            {/* Gradient accent */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-linear-to-bl from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-7 h-7 text-indigo-500" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                Intelligent Room Management
              </h3>
              <p className="text-muted-foreground text-base lg:text-lg mb-8 leading-relaxed max-w-lg">
                AI-powered room allocation that optimizes occupancy, matches compatible roommates, and automates the entire assignment workflow.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "Smart Allocation Algorithm",
                  "Roommate Compatibility",
                  "Instant Assignment",
                  "Real-time Vacancy Tracking",
                ].map((feature, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-foreground text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="lg:col-span-2 group relative bg-card border border-border rounded-3xl p-6 lg:p-8 overflow-hidden hover:border-purple-500/30 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-xs font-medium text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">24/7</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Professional security partnership with round-the-clock surveillance and access control systems.
              </p>
            </div>
          </div>

          {/* Speed Card */}
          <div className="lg:col-span-2 group relative bg-card border border-border rounded-3xl p-6 lg:p-8 overflow-hidden hover:border-green-500/30 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">100Mbps</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">High-Speed Connectivity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Enterprise-grade fiber internet with dedicated bandwidth for seamless online experiences.
              </p>
            </div>
          </div>

          {/* Analytics Card */}
          <div className="md:col-span-2 lg:col-span-3 group relative bg-card border border-border rounded-3xl p-6 lg:p-8 overflow-hidden hover:border-blue-500/30 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Live dashboards with insights on occupancy, revenue trends, and operational metrics.
                </p>
              </div>

              {/* Mini chart visualization */}
              <div className="flex gap-1.5 items-end h-24 px-4">
                {[60, 80, 65, 90, 75, 95, 85, 92].map((h, i) => (
                  <div
                    key={i}
                    className="w-3 bg-linear-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all hover:from-blue-500 hover:to-blue-300"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile First Card */}
          <div className="md:col-span-2 lg:col-span-3 group relative bg-card border border-border rounded-3xl p-6 lg:p-8 overflow-hidden hover:border-pink-500/30 hover:shadow-xl transition-all duration-300">
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6 text-pink-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Mobile-First Design</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Responsive platform accessible from any device, anywhere, anytime.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Active Users</div>
                  <div className="text-2xl font-bold text-foreground">700+</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Rating</div>
                  <div className="text-2xl font-bold text-amber-500">4.9★</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row - smaller cards */}
          <div className="lg:col-span-2 group relative bg-card border border-border rounded-3xl p-6 overflow-hidden hover:border-amber-500/30 hover:shadow-xl transition-all duration-300">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Automated Billing</h3>
            <p className="text-muted-foreground text-sm">Smart invoicing with automatic payment reminders</p>
          </div>

          <div className="lg:col-span-2 group relative bg-card border border-border rounded-3xl p-6 overflow-hidden hover:border-cyan-500/30 hover:shadow-xl transition-all duration-300">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-cyan-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Staff Portal</h3>
            <p className="text-muted-foreground text-sm">Dedicated dashboard for wardens and administrators</p>
          </div>

          <div className="lg:col-span-2 group relative bg-card border border-border rounded-3xl p-6 overflow-hidden hover:border-orange-500/30 hover:shadow-xl transition-all duration-300">
            <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wifi className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">IoT Integration</h3>
            <p className="text-muted-foreground text-sm">Smart automation powered by AI technology</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrids;
