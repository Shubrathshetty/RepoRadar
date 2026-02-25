import { RepoAnalyzerForm } from "@/components/repo-analyzer-form";
import { Testimonials } from "@/components/testimonials";
import { RatingSystem } from "@/components/rating-system";
import { ReviewsList } from "@/components/reviews-list";
import { FeedbackForm } from "@/components/feedback-form";
import { ContactSection } from "@/components/contact-section";
import { Container, Button } from "@/components/ui";

function HeroSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <Container size="lg">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Understand Any GitHub Repository
            <span className="text-slate-400"> in Seconds</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            RepoRadar analyzes public GitHub repositories and generates comprehensive technical reports. 
            Get insights on architecture, tech stack, setup instructions, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg">Start Analyzing</Button>
            <Button variant="outline" size="lg">View Demo</Button>
          </div>
        </div>
        <RepoAnalyzerForm />
      </Container>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Comprehensive Reports",
      description: "Get 17 detailed sections covering architecture, tech stack, security, deployment, and more.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Analysis",
      description: "AI-powered analysis delivers results in seconds, not hours of manual code review.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: "Tech Stack Detection",
      description: "Automatically identifies languages, frameworks, databases, and infrastructure.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Security Insights",
      description: "Identify authentication systems, input validation, and secrets handling patterns.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: "Setup Instructions",
      description: "Get clear prerequisites, dependency installation, and environment setup steps.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Team Onboarding",
      description: "Perfect for helping new team members understand existing codebases quickly.",
    },
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <Container size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful Features</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Everything you need to understand, evaluate, and work with any GitHub repository
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <HeroSection />
      <FeaturesSection />
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="reviews">
        <ReviewsList />
      </section>
      <RatingSystem />
      <section id="feedback">
        <FeedbackForm />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
    </div>
  );
}
