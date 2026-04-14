// ─────────────────────────────────────────────────────────────────────────────
//  Job Service — Mock API with realistic job data
//
//  Images used (all free, no API key needed):
//  • Company thumbnails: Unsplash (topic-matched, direct URL)
//  • Recommended Cloudinary alternative: upload your own images to
//    https://cloudinary.com and replace the image URLs below with:
//    https://res.cloudinary.com/<your_cloud_name>/image/upload/<public_id>
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'TechNova Solutions',
    location: 'San Francisco, CA',
    salary: '$110,000 – $150,000',
    type: 'Full-time',
    remote: true,
    description:
      'Build next-gen mobile experiences for millions of users. You will collaborate with designers and backend engineers to ship features in a fast-paced agile environment.',
    // Unsplash: laptop & code — replace with your Cloudinary URL if preferred
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&q=80',
    postedDate: '1 day ago',
    tags: ['React Native', 'TypeScript', 'Redux'],
    applicants: 42,
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'Creative Studio Co.',
    location: 'New York, NY',
    salary: '$85,000 – $115,000',
    type: 'Full-time',
    remote: false,
    description:
      'Shape beautiful user experiences for our flagship SaaS products. You will own the design process end-to-end, from wireframes to high-fidelity prototypes.',
    // Unsplash: design & color palette
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&q=80',
    postedDate: '2 days ago',
    tags: ['Figma', 'Sketch', 'Prototyping'],
    applicants: 89,
  },
  {
    id: '3',
    title: 'Backend Engineer (Node.js)',
    company: 'DataStream Inc.',
    location: 'Austin, TX',
    salary: '$95,000 – $130,000',
    type: 'Full-time',
    remote: true,
    description:
      'Scale our cloud infrastructure to handle millions of requests per day. Strong knowledge of AWS, microservices, and PostgreSQL is a must.',
    // Unsplash: server / data center
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&q=80',
    postedDate: '3 days ago',
    tags: ['Node.js', 'AWS', 'PostgreSQL'],
    applicants: 31,
  },
  {
    id: '4',
    title: 'Digital Marketing Manager',
    company: 'GrowthHack Agency',
    location: 'Chicago, IL',
    salary: '$70,000 – $95,000',
    type: 'Full-time',
    remote: true,
    description:
      'Lead multi-channel digital campaigns across SEO, paid media and social to drive pipeline growth. You will own budgets and report directly to the CMO.',
    // Unsplash: analytics dashboard
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80',
    postedDate: '4 days ago',
    tags: ['SEO', 'Google Ads', 'Analytics'],
    applicants: 67,
  },
  {
    id: '5',
    title: 'Product Manager',
    company: 'InnovateTech Ltd.',
    location: 'Seattle, WA',
    salary: '$120,000 – $160,000',
    type: 'Full-time',
    remote: false,
    description:
      'Drive the roadmap for our core product suite. Work cross-functionally with engineering, design and sales to ship impactful features on time.',
    // Unsplash: team meeting / collaboration
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&q=80',
    postedDate: '5 days ago',
    tags: ['Agile', 'Roadmapping', 'Scrum'],
    applicants: 123,
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'AnalyticsPro',
    location: 'Boston, MA',
    salary: '$105,000 – $145,000',
    type: 'Contract',
    remote: true,
    description:
      'Apply ML and statistical modelling to uncover actionable business insights. You will work with petabyte-scale datasets and deploy models to production.',
    // Unsplash: charts & data
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=80',
    postedDate: '1 week ago',
    tags: ['Python', 'TensorFlow', 'SQL'],
    applicants: 55,
  },
  {
    id: '7',
    title: 'DevOps Engineer',
    company: 'CloudBase Systems',
    location: 'Remote',
    salary: '$100,000 – $135,000',
    type: 'Full-time',
    remote: true,
    description:
      'Build, maintain and automate CI/CD pipelines and cloud infrastructure for a rapidly growing fintech platform.',
    // Unsplash: cloud / network infrastructure
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80',
    postedDate: '2 days ago',
    tags: ['Docker', 'Kubernetes', 'Terraform'],
    applicants: 28,
  },
  {
    id: '8',
    title: 'Content Strategist',
    company: 'WordCraft Media',
    location: 'Los Angeles, CA',
    salary: '$60,000 – $80,000',
    type: 'Part-time',
    remote: true,
    description:
      'Develop and execute content strategies across blogs, newsletters, and social media to grow our audience to 1M readers.',
    // Unsplash: writing / content creation
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&q=80',
    postedDate: '3 days ago',
    tags: ['Content', 'SEO', 'Copywriting'],
    applicants: 44,
  },
];

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Simulates a network call — replace with a real fetch() if you wire up a
 * backend later.
 */
export const fetchJobs = async () => {
  try {
    await delay(1200); // simulate network latency
    return { success: true, data: MOCK_JOBS };
  } catch (error) {
    return { success: false, error: 'Failed to load jobs. Please try again.' };
  }
};

/**
 * Filter jobs client-side (search + category).
 */
export const filterJobs = (jobs, query, category) => {
  let result = [...jobs];

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (category && category !== 'All') {
    if (category === 'Remote') {
      result = result.filter((job) => job.remote);
    } else {
      result = result.filter((job) => job.type === category);
    }
  }

  return result;
};

// helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
