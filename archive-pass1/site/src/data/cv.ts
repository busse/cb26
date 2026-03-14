// CV/Resume data - structured for the about page

export const cv = {
  name: 'Chris Busse',
  label: 'Technology Leader · Enterprise Solutions · AI',
  email: 'chris@chrisbusse.com',
  location: 'Richmond, Virginia',
  summary: `Technology leader with 30 years of experience specializing in APIs, enterprise modernization, 
and AI transformation. International speaker at SXSW, Nordic APIs, Twilio SIGNAL, and APIStrat. 
Founded API Craft RVA and launched the first public API platform for a North American bank.`,

  experience: [
    {
      company: 'SingleStone',
      position: 'Enterprise Client Solutions & AI Lead',
      location: 'Richmond, VA',
      url: 'https://www.singlestone.com',
      startDate: '2024',
      endDate: 'Present',
      summary: 'Leading enterprise client solutions and AI initiatives for consulting clients.',
      highlights: [
        'Enterprise client solutions leadership',
        'AI strategy and implementation',
        'Architecture modernization using domain-driven design',
      ],
    },
    {
      company: 'Eszett',
      position: 'Founder',
      location: 'Richmond, VA',
      url: 'https://www.eszetthq.com',
      startDate: '2024',
      endDate: 'Present',
      summary: 'Helping artists who reject AI in their art leverage it to better position and sell their work.',
      highlights: [
        'AI-powered business tools for traditional artists',
        'Marketing and positioning strategy for creatives',
        'Bridging the gap between art and commerce',
      ],
    },
    {
      company: 'Terazo',
      position: 'Chief Digital Officer & VP of Delivery',
      location: 'Richmond, VA',
      url: 'https://terazo.com',
      startDate: '2018',
      endDate: '2024',
      summary: 'Led digital transformation initiatives and Twilio partnership.',
      highlights: [
        'Twilio SIGNAL speaker (2020, 2021, 2023)',
        'Twilio SKO 2024 presenter',
        'Built Twilio Flex contact center solutions for enterprise clients',
        'Established Terazo as a premier Twilio partner',
      ],
    },
    {
      company: 'APIvista',
      position: 'CTO & Co-Founder',
      location: 'Richmond, VA',
      startDate: '2016',
      endDate: '2018',
      summary: 'API strategy consulting helping clients design, publish, and support APIs.',
      highlights: [
        'Nordic APIs Platform Summit keynote (Stockholm, 2018)',
        'APIStrat 2017 speaker (Portland)',
        'Austin API Summit 2018 speaker',
        'Contract-first API development methodology',
      ],
    },
    {
      company: 'Capital One',
      position: 'Senior Manager, Developer Marketing & API Consumer Services',
      location: 'Richmond, VA',
      startDate: '2014',
      endDate: '2016',
      summary: 'Led the launch of Capital One DevExchange—the first public API platform for a North American bank.',
      highlights: [
        'Launched Capital One DevExchange',
        'First public API platform for a North American bank',
        'Founded API Craft RVA meetup (288+ members)',
      ],
    },
    {
      company: 'Fahrenheit Technology / Emerging Media Group',
      position: 'Partner & Manager of Technology',
      location: 'Richmond, VA',
      startDate: '2010',
      endDate: '2014',
      summary: 'Led technology initiatives for the emerging media practice.',
      highlights: [
        'SXSW Interactive 2011 speaker',
        'Social media API integration',
        'Technology strategy consulting',
      ],
    },
    {
      company: 'Earlier Career',
      position: 'Various Technology Roles',
      location: 'Richmond, VA',
      startDate: '1995',
      endDate: '2010',
      summary: 'Technology leadership at Create Digital, Sublimata, MemberPath, iXL, and others.',
      highlights: [
        'Web development and digital transformation',
        'Early internet and e-commerce projects',
        'Software development and architecture',
      ],
    },
  ],

  skills: [
    {
      name: 'API Strategy & Design',
      keywords: ['REST API Design', 'OpenAPI/Swagger', 'Contract-First Development', 'API Governance', 'Developer Experience (DX)'],
    },
    {
      name: 'Twilio Ecosystem',
      keywords: ['Twilio Flex', 'Twilio Voice', 'Twilio SMS', 'Twilio Conversations', 'Twilio Segment', 'Twilio Studio'],
    },
    {
      name: 'Enterprise Modernization',
      keywords: ['Legacy Application Redesign', 'API-First Architecture', 'Domain-Driven Design', 'Microservices'],
    },
    {
      name: 'AI & ML',
      keywords: ['AI Strategy', 'AI Transformation', 'LLMs', 'Conversational AI', 'AI-Assisted Development'],
    },
    {
      name: 'Leadership',
      keywords: ['Product Management', 'Digital Transformation', 'Technical Strategy', 'Team Building'],
    },
  ],

  speakingHighlights: [
    { year: 2024, event: 'Twilio SKO', location: 'San Francisco' },
    { year: 2023, event: 'Twilio SIGNAL', location: 'San Francisco' },
    { year: 2021, event: 'Twilio SIGNAL Roundtable', location: 'Virtual' },
    { year: 2020, event: 'Twilio SIGNAL', location: 'Virtual' },
    { year: 2018, event: 'Nordic APIs Platform Summit (Keynote)', location: 'Stockholm' },
    { year: 2018, event: 'Austin API Summit', location: 'Austin' },
    { year: 2017, event: 'APIStrat', location: 'Portland' },
    { year: 2011, event: 'SXSW Interactive', location: 'Austin' },
  ],
};
