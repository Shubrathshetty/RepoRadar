"use client";

import { useState } from "react";
import { Card, Button, Input, Textarea, StarRating, Badge, SectionHeader, Container } from "@/components/ui";
import type { Feedback } from "@/lib/types/feedback";

type FeedbackCategory = "bug" | "feature" | "general" | "praise";

const categories: { value: FeedbackCategory; label: string; description: string }[] = [
  { value: "praise", label: "Praise", description: "Share what you love about RepoRadar" },
  { value: "feature", label: "Feature Request", description: "Suggest a new feature or improvement" },
  { value: "bug", label: "Bug Report", description: "Report an issue or unexpected behavior" },
  { value: "general", label: "General Feedback", description: "Share your thoughts or questions" },
];

export function FeedbackForm() {
  const [category, setCategory] = useState<FeedbackCategory | "">("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!category) {
      newErrors.category = "Please select a category";
    }
    if (rating === 0) {
      newErrors.rating = "Please provide a rating";
    }
    if (!comment.trim()) {
      newErrors.comment = "Please enter your feedback";
    } else if (comment.length < 10) {
      newErrors.comment = "Feedback must be at least 10 characters";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // In a real app, you would send the data to your backend
    const feedback: Feedback = {
      id: Date.now().toString(),
      category: category as FeedbackCategory,
      rating,
      comment,
      email: email || undefined,
      createdAt: new Date().toISOString(),
    };
    
    console.log("Feedback submitted:", feedback);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setCategory("");
    setRating(0);
    setComment("");
    setEmail("");
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-white">
        <Container size="md">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Thank You for Your Feedback!
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              We appreciate you taking the time to share your thoughts. Your feedback helps us make RepoRadar better for everyone.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleReset} variant="outline">
                Submit Another
              </Button>
              <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Back to Top
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <Container size="md">
        <SectionHeader
          title="Share Your Feedback"
          subtitle="Help us improve RepoRadar by sharing your experience"
          centered
        />

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                What type of feedback do you have? *
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => {
                      setCategory(cat.value);
                      setErrors((prev) => ({ ...prev, category: "" }));
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      category === cat.value
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-medium text-slate-900 mb-1">{cat.label}</div>
                    <div className="text-sm text-slate-600">{cat.description}</div>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                How would you rate your experience? *
              </label>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={rating}
                  size="lg"
                  interactive
                  onRate={(r) => {
                    setRating(r);
                    setErrors((prev) => ({ ...prev, rating: "" }));
                  }}
                />
                {rating > 0 && (
                  <Badge variant={rating >= 4 ? "success" : rating >= 3 ? "default" : "warning"}>
                    {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                  </Badge>
                )}
              </div>
              {errors.rating && (
                <p className="mt-2 text-sm text-red-600">{errors.rating}</p>
              )}
            </div>

            {/* Comment */}
            <Textarea
              label="Your Feedback *"
              placeholder="Tell us about your experience with RepoRadar. What did you like? What could be improved?"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setErrors((prev) => ({ ...prev, comment: "" }));
              }}
              error={errors.comment}
              rows={5}
            />

            {/* Email (Optional) */}
            <Input
              label="Email (optional)"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={errors.email}
            />
            <p className="text-xs text-slate-500 -mt-4">
              We&apos;ll only use this to follow up on your feedback if needed.
            </p>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-500">* Required fields</p>
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </Container>
    </section>
  );
}
