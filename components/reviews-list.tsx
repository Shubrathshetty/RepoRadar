"use client";

import { useState, useEffect } from "react";
import { Card, Avatar, StarRating, Badge, Button, SectionHeader, Container } from "@/components/ui";
import type { Review } from "@/lib/types/feedback";

type SortOption = "newest" | "highest" | "lowest" | "helpful";
type FilterOption = "all" | "5" | "4" | "3" | "2" | "1";

export function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/reviews?sortBy=${sortBy}&filterBy=${filterBy}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [sortBy, filterBy]);

  const handleHelpful = async (reviewId: string) => {
    const isHelpful = helpfulReviews.has(reviewId);
    
    try {
      const response = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reviewId, helpful: !isHelpful }),
      });

      if (response.ok) {
        setHelpfulReviews((prev) => {
          const newSet = new Set(prev);
          if (isHelpful) {
            newSet.delete(reviewId);
          } else {
            newSet.add(reviewId);
          }
          return newSet;
        });

        // Update local review count
        setReviews((prev) => 
          prev.map((review) => 
            review.id === reviewId 
              ? { ...review, helpful: review.helpful + (isHelpful ? -1 : 1) }
              : review
          )
        );
      }
    } catch (error) {
      console.error("Failed to update helpful:", error);
    }
  };

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
      feature: "info",
      bug: "error",
      general: "default",
      praise: "success",
    };
    return variants[category] || "default";
  };

  if (loading) {
    return (
      <section id="reviews" className="py-16 bg-white dark:bg-slate-950">
        <Container size="lg">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="reviews" className="py-16 bg-white dark:bg-slate-950">
      <Container size="lg">
        <SectionHeader
          title="User Reviews"
          subtitle="See what developers are saying about RepoRadar"
          centered
        />

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          {/* Filter by Rating */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter:</span>
            {["all", "5", "4", "3", "2", "1"].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterBy(rating as FilterOption)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterBy === rating
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {rating === "all" ? "All" : `${rating}★`}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="flex flex-col dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar alt={review.name} size="md" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{review.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {review.category && (
                  <Badge variant={getCategoryBadge(review.category)}>
                    {review.category}
                  </Badge>
                )}
              </div>

              <div className="mb-3">
                <StarRating rating={review.rating} size="sm" />
              </div>

              <p className="text-slate-700 dark:text-slate-300 mb-4 flex-grow">{review.comment}</p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => handleHelpful(review.id)}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    helpfulReviews.has(review.id)
                      ? "text-slate-900 dark:text-white font-medium"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill={helpfulReviews.has(review.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  Helpful ({review.helpful})
                </button>

                <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  Report
                </button>
              </div>
            </Card>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No reviews found matching your criteria.</p>
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      </Container>
    </section>
  );
}
