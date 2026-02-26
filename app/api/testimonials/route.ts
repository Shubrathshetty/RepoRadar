import { NextResponse } from "next/server";

const testimonials = [
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

export async function GET() {
  return NextResponse.json(testimonials);
}
