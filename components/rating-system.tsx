"use client";

import { useState } from "react";
import { Card, StarRating, Button, SectionHeader, Container } from "@/components/ui";
import type { RatingStats } from "@/lib/types/feedback";

// Mock rating data
const initialStats: RatingStats = {
  average: 4.8,
  total: 1247,
  distribution: {
    5: 987,
    4: 189,
    3: 45,
    2: 15,
    1: 11,
  },
};

export function RatingSystem() {
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [stats, setStats] = useState(initialStats);

  const handleRate = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmitRating = () => {
    if (userRating === 0) return;
    
    // Simulate submitting rating
    setHasRated(true);
    
    // Update stats (in real app, this would come from API)
    setStats((prev) => ({
      ...prev,
      total: prev.total + 1,
      average: ((prev.average * prev.total) + userRating) / (prev.total + 1),
      distribution: {
        ...prev.distribution,
        [userRating as 1 | 2 | 3 | 4 | 5]: prev.distribution[userRating as 1 | 2 | 3 | 4 | 5] + 1,
      },
    }));
  };

  const getPercentage = (count: number) => {
    return ((count / stats.total) * 100).toFixed(1);
  };

  return (
    <section className="py-16 bg-white">
      <Container size="lg">
        <SectionHeader
          title="Rate Your Experience"
          subtitle="Help us improve RepoRadar by sharing your feedback"
          centered
        />

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Rating Summary */}
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-slate-900 mb-2">
                {stats.average.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                <StarRating rating={Math.round(stats.average)} size="lg" />
              </div>
              <p className="text-slate-600">Based on {stats.total.toLocaleString()} reviews</p>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{star} star</span>
                  <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${getPercentage(stats.distribution[star as 1 | 2 | 3 | 4 | 5])}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 w-12 text-right">
                    {getPercentage(stats.distribution[star as 1 | 2 | 3 | 4 | 5])}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* User Rating */}
          <Card className="p-6">
            {!hasRated ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  How would you rate RepoRadar?
                </h3>
                <div className="flex justify-center mb-6">
                  <StarRating
                    rating={userRating}
                    size="lg"
                    interactive
                    onRate={handleRate}
                  />
                </div>
                <p className="text-slate-600 mb-6">
                  {userRating > 0 ? (
                    userRating >= 4 ? (
                      <span className="text-green-600">Great! Thanks for the positive feedback!</span>
                    ) : userRating >= 3 ? (
                      <span>Thanks for your feedback. We&apos;re always improving.</span>
                    ) : (
                      <span>We&apos;re sorry to hear that. Your feedback helps us improve.</span>
                    )
                  ) : (
                    "Click the stars to rate"
                  )}
                </p>
                <Button
                  onClick={handleSubmitRating}
                  disabled={userRating === 0}
                  className="w-full"
                >
                  Submit Rating
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-slate-600">
                  Your rating of {userRating} stars has been recorded.
                </p>
              </div>
            )}
          </Card>
        </div>
      </Container>
    </section>
  );
}
