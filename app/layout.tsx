import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/frontend/lib/theme-context";
import { ThemeToggle } from "@/frontend/components/theme-toggle";

export const metadata: Metadata = {
  title: "RepoRadar - GitHub Repository Analyzer",
  description: "Analyze any public GitHub repository and get a structured technical explanation. Understand code faster with AI-powered insights.",
};

function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-[#050a07]/85 backdrop-blur-md border-b border-emerald-200 dark:border-emerald-500/25">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-emerald-700 dark:text-[#39ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xl font-bold text-emerald-900 dark:text-emerald-100">RepoRadar</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-emerald-700 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-[#39ff88] transition-colors">Features</a>
            <a href="#testimonials" className="text-sm font-medium text-emerald-700 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-[#39ff88] transition-colors">Testimonials</a>
            <a href="#reviews" className="text-sm font-medium text-emerald-700 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-[#39ff88] transition-colors">Reviews</a>
            <a href="#contact" className="text-sm font-medium text-emerald-700 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-[#39ff88] transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="https://github.com/Shubrathshetty/RepoRadar"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-emerald-700 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-[#39ff88] hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors"
              aria-label="GitHub repository"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-emerald-50 dark:bg-[#050a07] text-emerald-900 dark:text-emerald-200 py-12 border-t border-emerald-100 dark:border-emerald-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-8 h-8 text-emerald-700 dark:text-[#39ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xl font-bold text-emerald-900 dark:text-emerald-100">RepoRadar</span>
            </div>
            <p className="text-emerald-800/80 dark:text-emerald-300/80 max-w-sm">
              Analyze any public GitHub repository and get a structured technical explanation.
              Understand code faster with AI-powered insights.
            </p>
          </div>

          <div>
            <h4 className="text-emerald-900 dark:text-emerald-100 font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-emerald-700 dark:hover:text-[#39ff88] transition-colors">Features</a></li>
              <li><a href="#testimonials" className="hover:text-emerald-700 dark:hover:text-[#39ff88] transition-colors">Testimonials</a></li>
              <li><a href="#reviews" className="hover:text-emerald-700 dark:hover:text-[#39ff88] transition-colors">Reviews</a></li>
              <li><a href="#" className="hover:text-emerald-700 dark:hover:text-[#39ff88] transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-emerald-900 dark:text-emerald-100 font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#contact" className="hover:text-emerald-700 dark:hover:text-[#39ff88] transition-colors">Contact</a></li>
              <li><a href="#feedback" className="hover:text-emerald-700 dark:hover:text-[#39ff88] transition-colors">Feedback</a></li>
              <li><a href="#" className="hover:text-emerald-700 dark:hover:text-[#39ff88] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-emerald-700 dark:hover:text-[#39ff88] transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-200 dark:border-emerald-500/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80">
            (c) {new Date().getFullYear()} RepoRadar. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-emerald-700/80 dark:text-emerald-300/80 hover:text-emerald-900 dark:hover:text-[#39ff88] transition-colors">Privacy</a>
            <a href="#" className="text-sm text-emerald-700/80 dark:text-emerald-300/80 hover:text-emerald-900 dark:hover:text-[#39ff88] transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-white dark:bg-[#050a07] text-emerald-950 dark:text-emerald-100 transition-colors">
        <ThemeProvider>
          <Navigation />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
