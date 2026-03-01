"use client";

import { useState, useEffect } from "react";
import { Card, StarRating, Button, SectionHeader, Container } from "@/frontend/components/ui";
import type { RatingStats } from "@/backend/types/feedback";

export function RatingSystem() {
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchRatings() {
      try {
        const response = await fetch("/api/ratings");
        if (response.ok) {
          const data = await response.json();
          setStats({
            average: data.average,
            total: data.total,
            distribution: data.distribution,
          });
        }
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, []);

  const handleRate = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmitRating = async () => {
    if (userRating === 0) return;
    
    setSubmitting(true);
    
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: userRating }),
      });

      if (response.ok) {
        const data = await response.json();
        setHasRated(true);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getPercentage = (count: number) => {
    if (!stats) return "0.0";
    return ((count / stats.total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-slate-950">
        <Container size="lg">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto"></div>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!stats) return null;

  return (
    <section className="py-16 bg-white dark:bg-slate-950">
      <Container size="lg">
        <SectionHeader
          title="Rate Your Experience"
          subtitle="Help us improve RepoRadar by sharing your feedback"
          centered
        />

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Rating Summary */}
          <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                {stats.average.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                <StarRating rating={Math.round(stats.average)} size="lg" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">Based on {stats.total.toLocaleString()} reviews</p>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8 text-slate-700 dark:text-slate-300">{star} star</span>
                  <div className="flex-grow h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${getPercentage(stats.distribution[star as 1 | 2 | 3 | 4 | 5])}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-12 text-right">
                    {getPercentage(stats.distribution[star as 1 | 2 | 3 | 4 | 5])}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* User Rating */}
          <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
            {!hasRated ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
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
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {userRating > 0 ? (
                    userRating >= 4 ? (
                      <span className="text-green-600 dark:text-green-400">Great! Thanks for the positive feedback!</span>
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
                  disabled={userRating === 0 || submitting}
                  className="w-full"
                >
                  {submitting ? "Submitting..." : "Submit Rating"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Thank You!
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
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
