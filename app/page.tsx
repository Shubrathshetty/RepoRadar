import { RepoAnalyzerForm } from "@/frontend/components/repo-analyzer-form";
import { Testimonials } from "@/frontend/components/testimonials";
import { RatingSystem } from "@/frontend/components/rating-system";
import { ReviewsList } from "@/frontend/components/reviews-list";
import { FeedbackForm } from "@/frontend/components/feedback-form";
import { ContactSection } from "@/frontend/components/contact-section";
import { Container } from "@/frontend/components/ui";

function HeroSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-emerald-50 to-lime-50 dark:from-[#050a07] dark:via-[#0b1a12] dark:to-[#06110b]">
      <Container size="lg">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-950 dark:text-emerald-100 mb-6">
            Understand Any GitHub Repository
            <span className="text-emerald-500 dark:text-[#39ff88]"> in Seconds</span>
          </h1>
          <p className="text-lg text-emerald-800/85 dark:text-emerald-200/85 mb-8">
            RepoRadar analyzes public GitHub repositories and generates comprehensive technical reports. 
            Get insights on architecture, tech stack, setup instructions, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#repo-analyzer"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 dark:bg-[#39ff88] px-6 py-3 text-base font-medium text-white dark:text-[#06110b] hover:bg-emerald-700 dark:hover:bg-[#65ff9f] transition-all duration-200"
            >
              Start Analyzing
            </a>
            <a
              href="#repo-analyzer-demo"
              className="inline-flex items-center justify-center rounded-lg border-2 border-emerald-300 dark:border-emerald-500/50 px-6 py-3 text-base font-medium text-emerald-800 dark:text-emerald-200 hover:border-emerald-400 dark:hover:border-[#39ff88] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all duration-200"
            >
              View Demo
            </a>
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
    <section id="features" className="py-16 bg-white dark:bg-[#07110c]">
      <Container size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-950 dark:text-emerald-100 mb-4">Powerful Features</h2>
          <p className="text-emerald-800/85 dark:text-emerald-200/85 max-w-2xl mx-auto">
            Everything you need to understand, evaluate, and work with any GitHub repository
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-xl border border-emerald-100 dark:border-emerald-500/25 hover:border-emerald-300 dark:hover:border-[#39ff88]/50 hover:shadow-md transition-all bg-white dark:bg-[#0b1a12]">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center text-emerald-700 dark:text-[#39ff88] mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">{feature.title}</h3>
              <p className="text-emerald-800/80 dark:text-emerald-200/80 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050a07] text-emerald-950 dark:text-emerald-100 transition-colors">
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
