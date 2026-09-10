export const SITE = {
  name: "Suyog Dahal",
  role: "AI Engineer & Researcher",
  availability: "Available for new opportunities",
  intro:
    "I design and build machine intelligence through reinforcement-learning agents, computer-vision systems, and the full-stack applications around them. Working from Kathmandu (GMT+5:45) with teams anywhere.",
  location: "Kathmandu, Nepal",
  timeZone: "Asia/Kathmandu",
  email: "sonofdahal@gmail.com",
  tagline: "AI engineer and software developer.",
  socials: {
    github: "https://github.com/DahalSuyog",
    linkedin: "https://www.linkedin.com/in/suyog-dahal-452801274/",
  },
} as const;

export interface SkillGroup {
  icon: string;
  title: string;
  desc: string;
  tags: string[];
}

export const SKILLS: SkillGroup[] = [
  {
    icon: "code",
    title: "Core languages",
    desc: "Low-level performance with C/C++, rapid iteration in Python, and type-safe JavaScript across the stack.",
    tags: ["C / C++", "Python", "JavaScript"],
  },
  {
    icon: "web",
    title: "Web architecture",
    desc: "Full-stack systems, dashboards, and interfaces built to be fast, accessible, and maintainable.",
    tags: ["React / Next.js", "Tailwind CSS", "Node.js / PHP"],
  },
  {
    icon: "science",
    title: "Deep & reinforcement learning",
    desc: "Designing and tuning models, from curiosity-driven agents in simulated environments to computer-vision systems.",
    tags: ["PyTorch", "Gymnasium", "PPO / RND", "R-CNN", "Computer vision"],
  },
];

export interface TimelineEntry {
  period: string;
  title: string;
  org: string;
  desc: string;
}

export const TIMELINE: TimelineEntry[] = [
  {
    period: "2021 – 2025",
    title: "BE in Computer Engineering",
    org: "Purbanchal University",
    desc: "Formal training in data structures and algorithms, computational theory, artificial intelligence, computer networks, and database systems.",
  },
  {
    period: "Present",
    title: "Open to work",
    org: "Internship & entry-level roles",
    desc: "Seeking an internship or entry-level software or AI engineering role where I can apply these skills to real-world challenges.",
  },
];
