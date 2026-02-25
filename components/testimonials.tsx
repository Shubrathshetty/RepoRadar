"use client";

import { useState, useEffect } from "react";
import { Card, Avatar, StarRating, SectionHeader, Container } from "@/components/ui";
import type { Testimonial } from "@/lib/types/feedback";

// Mock testimonials data
const testimonialsData: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Developer",
    company: "TechCorp",
    avatar: "",
    quote: "RepoRadar has completely transformed how I understand new codebases. The structured analysis saves me hours of manual exploration. The tech stack detection is incredibly accurate!",
    rating: 5,
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "Engineering Manager",
    company: "StartupXYZ",
    avatar: "",
    quote: "As a manager, I use RepoRadar to quickly evaluate open-source libraries before adoption. The security considerations and architecture breakdown are invaluable for decision-making.",
    rating: 5,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Open Source Contributor",
    company: "Freelance",
    avatar: "",
    quote: "The detailed repository structure analysis helps me find where to contribute. I love how it identifies entry points and key files automatically. A must-have tool for any developer!",
    rating: 4,
  },
  {
    id: "4",
    name: "David Kim",
    role: "Tech Lead",
    company: "Enterprise Solutions",
    avatar: "",
    quote: "We use RepoRadar during code reviews and onboarding. It provides a comprehensive overview that helps new team members get up to speed quickly. The setup instructions are particularly helpful.",
    rating: 5,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Full Stack Developer",
    company: "Digital Agency",
    avatar: "",
    quote: "The performance and scalability insights have helped us optimize our applications. RepoRadar identifies bottlenecks I wouldn't have noticed otherwise. Highly recommended!",
    rating: 5,
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
  };

  return (
    <section className="py-16 bg-slate-50">
      <Container size="lg">
        <SectionHeader
          title="What Developers Say"
          subtitle="Join thousands of developers who use RepoRadar to understand code faster"
          centered
        />

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonialsData.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeIndex ? "bg-slate-900" : "bg-slate-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <StatCard value="10K+" label="Repositories Analyzed" />
          <StatCard value="5,000+" label="Active Users" />
          <StatCard value="4.9" label="Average Rating" />
          <StatCard value="50+" label="Countries" />
        </div>
      </Container>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Avatar alt={testimonial.name} size="lg" />
        <div>
          <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
          <p className="text-sm text-slate-600">{testimonial.role}</p>
          <p className="text-xs text-slate-500">{testimonial.company}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <StarRating rating={testimonial.rating} size="sm" />
      </div>
      
      <blockquote className="text-slate-700 flex-grow">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
    </Card>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-4">
      <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}
