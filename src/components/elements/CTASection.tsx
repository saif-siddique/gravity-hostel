import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-background">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-r from-primary/10 via-blue-500/5 to-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Card wrapper for professional look */}
          <div className="relative rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8 md:p-12 lg:p-16 overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-primary/20 to-transparent rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-primary/20 to-transparent rounded-br-3xl" />

            <div className="relative z-10 text-center">
              <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">Get Started Today</p>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
                Ready to Transform Your
                <span className="block mt-2 bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Hostel Operations?
                </span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                Join 500+ forward-thinking hostels already using Gravity to streamline operations,
                enhance resident experience, and drive growth.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Be first to get into</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No Advance payment required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Leave anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No Security fee required</span>
                </div>
              </div>

              {/* CTA Buttons */}
              {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8 text-base font-medium rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  <Link href="/login">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-medium rounded-full border-border hover:bg-muted/50 transition-all">
                  <Link href="/home/contact">
                    Talk to Sales
                  </Link>
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;