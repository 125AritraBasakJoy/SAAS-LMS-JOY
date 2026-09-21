export interface PersonRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  bio?: string;
  roles: ('author' | 'instructor' | 'lms_admin' | 'learner' | 'system_admin')[];
  organizationId: string;
  department?: string;
  title?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PersonnelAttachment {
  id: string;
  name: string;
  size: number;
  sizeFormatted: string;
  type: string;
  category: 'CV / Resume' | 'Certificate / Credential' | 'Portfolio / Sample' | 'Identity / Government ID' | 'General Document' | 'Other Media';
  url: string;
  uploadedAt: string;
  isImage?: boolean;
}

export interface AuthorProfile {
  id: string;
  personId: string;
  name: string;
  email: string;
  contactNumber?: string;
  bio?: string;
  specialization: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  isInstructor: boolean;
  instructorId?: string;
  organizationId: string;
  createdAt: string;
  updatedAt?: string;
  authoredItemsCount?: number;
  isProfileComplete?: boolean;
  incompleteReason?: string;
  attachments?: PersonnelAttachment[];
}

export interface LearnerFeedbackItem {
  id: string;
  studentName: string;
  studentRole: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  tag: string;
}

export interface AuthorshipRecord {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  contentItemId: string;
  contentItemTitle: string;
  contentType: 'video' | 'audio' | 'document' | 'quiz' | 'reading' | 'interactive' | 'assignment' | 'lab' | string;
  courseId: string;
  courseName: string;
  courseStatus: 'Published' | 'Draft' | 'Inactive' | 'Archived';
  lmsId: string;
  lmsName: string;
  version: string;
  nodeTitle?: string;
  creditedDate: string;
  rating?: number;
  reviewsCount?: number;
  completionRate?: number;
  learnersCount?: number;
  provenance?: string[];
  feedbackReviews?: LearnerFeedbackItem[];
}

export interface ContentRepositoryItem {
  id: string;
  title: string;
  description: string;
  family: 'learning' | 'assessment';
  subtype: 'video' | 'audio' | 'document' | 'reading' | 'interactive' | 'quiz' | 'assignment' | 'survey' | 'lab';
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  authorRole?: string;
  organizationId: string;
  category: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  durationMinutes: number;
  status: 'Published' | 'Draft' | 'In Review' | 'Archived';
  version: string;
  mediaUrl?: string;
  documentUrl?: string;
  contentHtml?: string;
  questionsCount?: number;
  rubricSummary?: string;
  createdAt: string;
  updatedAt?: string;
  coursesUsedCount: number;
  coursesUsed?: { courseId: string; courseCode?: string; courseName: string; lmsName: string; nodeTitle?: string }[];
  totalLearnersReached?: number;
  averageRating?: number;
  reviewsCount?: number;
}

export const INITIAL_CONTENT_REPOSITORY_ITEMS: ContentRepositoryItem[] = [
  {
    id: 'repo-item-01',
    title: 'VO Grassroots Structure & Member Onboarding Video Masterclass',
    description: 'High-definition interactive video walkthrough of standard weekly Village Organization procedures, meeting discipline, and member charter onboarding.',
    family: 'learning',
    subtype: 'video',
    authorId: 'auth-mahbubur',
    authorName: 'Mahbubur Rahman',
    authorEmail: 'mahbubur.r@brac.net',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Video Scripting & Interactive Media Production',
    organizationId: 'tenant-brac',
    category: 'Microfinance & Compliance',
    tags: ['VO Operations', 'Video Masterclass', 'Member Onboarding', 'Field Training'],
    difficulty: 'Intermediate',
    durationMinutes: 20,
    status: 'Published',
    version: 'v2.1',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    createdAt: '12/01/2026',
    updatedAt: '18/02/2026',
    coursesUsedCount: 3,
    coursesUsed: [
      { courseId: 'crs-brac-101', courseCode: 'CRS-MF-OPS-2026', courseName: 'BRAC Microfinance Operations & Client Protection Principles', lmsName: 'BRAC Microfinance Operations & Enterprise Academy', nodeTitle: 'Lesson 1.1.1: VO Formation & Meeting Governance' },
      { courseId: 'crs-brac-102', courseCode: 'CRS-HLTH-COMM-2026', courseName: 'Community Health Worker Grassroots Protocol', lmsName: 'BRAC Health Services & Nutrition Academy', nodeTitle: 'Phase 1: Field Orientation' }
    ],
    totalLearnersReached: 1240,
    averageRating: 4.9,
    reviewsCount: 142
  },
  {
    id: 'repo-item-02',
    title: 'Smart Campaign Client Protection Standards Manual (SOP Guide)',
    description: 'Comprehensive digitized standard operating procedure covering client dignity, non-coercive recovery mechanisms, transparent pricing disclosure, and privacy safeguarding.',
    family: 'learning',
    subtype: 'document',
    authorId: 'auth-farhana',
    authorName: 'Farhana Ahmed',
    authorEmail: 'farhana.ahmed@brac.net',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Curriculum Architect & Regulatory Compliance Lead',
    organizationId: 'tenant-brac',
    category: 'Governance & Field Operations',
    tags: ['Smart Campaign', 'SOP Manual', 'Consumer Protection', 'Regulatory Compliance'],
    difficulty: 'Intermediate',
    durationMinutes: 30,
    status: 'Published',
    version: 'v1.4',
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '08/01/2026',
    updatedAt: '15/02/2026',
    coursesUsedCount: 4,
    coursesUsed: [
      { courseId: 'crs-brac-101', courseCode: 'CRS-MF-OPS-2026', courseName: 'BRAC Microfinance Operations & Client Protection Principles', lmsName: 'BRAC Microfinance Operations & Enterprise Academy', nodeTitle: 'Lesson 1.1.1: VO Formation & Meeting Governance' }
    ],
    totalLearnersReached: 2180,
    averageRating: 4.8,
    reviewsCount: 96
  },
  {
    id: 'repo-item-03',
    title: 'Field Case Study: Simulated Household Credit Risk Audit',
    description: 'Formative subjective evaluation analyzing agricultural household cash flows, seasonal vulnerabilities, and over-indebtedness risk with structured grading rubrics.',
    family: 'assessment',
    subtype: 'assignment',
    authorId: 'auth-sadia',
    authorName: 'Sadia Rahman',
    authorEmail: 'sadia.rahman@brac.net',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Psychometric Assessment & Rubric Architect',
    organizationId: 'tenant-brac',
    category: 'Microfinance & Compliance',
    tags: ['Credit Appraisal', 'Simulation', 'Manual Grading', 'Rubric'],
    difficulty: 'Advanced',
    durationMinutes: 45,
    status: 'Published',
    version: 'v2.0',
    rubricSummary: '4-Tier Grading: Cash Flow Integrity (30%), Ethical Recovery Safeguards (30%), Vulnerability Flagging (20%), Remediation Plan (20%)',
    createdAt: '15/01/2026',
    updatedAt: '20/02/2026',
    coursesUsedCount: 2,
    coursesUsed: [
      { courseId: 'crs-brac-101', courseCode: 'CRS-MF-OPS-2026', courseName: 'BRAC Microfinance Operations & Client Protection Principles', lmsName: 'BRAC Microfinance Operations & Enterprise Academy', nodeTitle: 'Topic 1.2: Credit Risk Assessment' }
    ],
    totalLearnersReached: 840,
    averageRating: 4.9,
    reviewsCount: 68
  },
  {
    id: 'repo-item-04',
    title: 'Client Financial Grievance De-escalation Audio Case Study',
    description: 'Immersive audio drama demonstrating active listening, psychological safety, and respectful negotiation when resolving disputed loan balances.',
    family: 'learning',
    subtype: 'audio',
    authorId: 'auth-mahbubur',
    authorName: 'Mahbubur Rahman',
    authorEmail: 'mahbubur.r@brac.net',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Video Scripting & Interactive Media Production',
    organizationId: 'tenant-brac',
    category: 'Customer Experience',
    tags: ['Audio Learning', 'Grievance Resolution', 'De-escalation', 'Empathy'],
    difficulty: 'Beginner',
    durationMinutes: 15,
    status: 'Published',
    version: 'v1.2',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    createdAt: '20/01/2026',
    coursesUsedCount: 2,
    coursesUsed: [
      { courseId: 'crs-brac-101', courseCode: 'CRS-MF-OPS-2026', courseName: 'BRAC Microfinance Operations & Client Protection Principles', lmsName: 'BRAC Microfinance Operations & Enterprise Academy' }
    ],
    totalLearnersReached: 910,
    averageRating: 4.7,
    reviewsCount: 52
  },
  {
    id: 'repo-item-05',
    title: 'Biometric POS & Cash Reconciliation Interactive Simulation Lab',
    description: 'Step-by-step browser simulation reproducing the offline field POS terminal, fingerprint capture, and end-of-day branch vault cash ledger matching.',
    family: 'learning',
    subtype: 'interactive',
    authorId: 'auth-shakil',
    authorName: 'Shakil Anwar',
    authorEmail: 'shakil.anwar@brac.net',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Gamification & Interactive Systems Specialist',
    organizationId: 'tenant-brac',
    category: 'Digital Transformation',
    tags: ['POS Terminal', 'Interactive Simulation', 'Cash Ledger', 'Biometrics'],
    difficulty: 'Intermediate',
    durationMinutes: 25,
    status: 'Published',
    version: 'v1.0',
    createdAt: '25/01/2026',
    coursesUsedCount: 2,
    coursesUsed: [
      { courseId: 'crs-brac-101', courseCode: 'CRS-MF-OPS-2026', courseName: 'BRAC Microfinance Operations & Client Protection Principles', lmsName: 'BRAC Microfinance Operations & Enterprise Academy' }
    ],
    totalLearnersReached: 760,
    averageRating: 4.9,
    reviewsCount: 44
  },
  {
    id: 'repo-item-06',
    title: 'Formative Diagnostic: Field Ethics & Client Dignity Objective Exam',
    description: '20-question randomized knowledge evaluation with instant automated feedback, question level analytics, and regulatory references.',
    family: 'assessment',
    subtype: 'quiz',
    authorId: 'auth-sadia',
    authorName: 'Sadia Rahman',
    authorEmail: 'sadia.rahman@brac.net',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Psychometric Assessment & Rubric Architect',
    organizationId: 'tenant-brac',
    category: 'Compliance & Security',
    tags: ['Objective Quiz', 'Automated Grading', 'Field Ethics', 'Diagnostic'],
    difficulty: 'Beginner',
    durationMinutes: 20,
    status: 'Published',
    version: 'v1.5',
    questionsCount: 20,
    createdAt: '02/02/2026',
    coursesUsedCount: 3,
    coursesUsed: [
      { courseId: 'crs-brac-101', courseCode: 'CRS-MF-OPS-2026', courseName: 'BRAC Microfinance Operations & Client Protection Principles', lmsName: 'BRAC Microfinance Operations & Enterprise Academy' }
    ],
    totalLearnersReached: 1850,
    averageRating: 4.8,
    reviewsCount: 110
  }
];

export interface DuplicatePersonnelMatch {
  confidencePercentage: number;
  personName: string;
  personEmail: string;
  personContact?: string;
  personAvatar?: string;
  matchedRoles: ('Author' | 'Instructor' | 'User')[];
  reasons: string[];
  matchedAuthor?: AuthorProfile;
  matchedInstructor?: any;
}

export interface DeactivationBlockResolution {
  contentItemId: string;
  courseId: string;
  action: 'reassign' | 'remove';
  replacementAuthorId?: string;
}

export interface AuthorCreateForm {
  name: string;
  email: string;
  contactNumber?: string;
  bio?: string;
  specialization: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  attachments?: PersonnelAttachment[];
  isQuickAdd?: boolean;
}

export const INITIAL_AUTHORS_REPO: AuthorProfile[] = [
  {
    id: 'auth-mahbubur',
    personId: 'person-mahbubur',
    name: 'Mahbubur Rahman',
    email: 'mahbubur.r@brac.net',
    contactNumber: '+880 1711-450921',
    bio: 'Award-winning instructional media designer with 8+ years developing interactive microlearning videos, animated compliance guides, and multimedia scenario simulations across BRAC global operations.',
    specialization: 'Video Scripting & Interactive Media Production',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    status: 'Active',
    isInstructor: false,
    organizationId: 'tenant-brac',
    createdAt: '10/01/2026',
    authoredItemsCount: 5
  },
  {
    id: 'auth-tanvir',
    personId: 'person-tanvir',
    name: 'Tanvir Hossain',
    email: 'tanvir.hossain@brac.net',
    contactNumber: '+880 1819-234567',
    bio: 'Lead Microfinance Master Instructor and Curriculum Author. Co-author of BRAC Client Protection Manual and Responsible Microcredit SOPs, holding dual Master Instructor and Course Author roles.',
    specialization: 'Microfinance SOPs, Responsible Lending & Credit Risk Rubrics',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'Active',
    isInstructor: true,
    instructorId: 'inst-tanvir',
    organizationId: 'tenant-brac',
    createdAt: '15/01/2026',
    authoredItemsCount: 4
  },
  {
    id: 'auth-ayesha',
    personId: 'person-ayesha',
    name: 'Ayesha Siddiqua',
    email: 'ayesha.s@brac.net',
    contactNumber: '+880 1912-887766',
    bio: 'Senior Pedagogical Field Researcher specializing in participatory community learning frameworks, ultra-poor household coaching materials, and social accountability assessment design.',
    specialization: 'Instructional Design, Case Studies & Qualitative Assessments',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    status: 'Active',
    isInstructor: false,
    organizationId: 'tenant-brac',
    createdAt: '22/01/2026',
    authoredItemsCount: 3
  },
  {
    id: 'auth-kamrul',
    personId: 'person-kamrul',
    name: 'Kamrul Hasan',
    email: 'kamrul.h@brac.net',
    contactNumber: '+880 1610-998811',
    bio: 'Curriculum Architect and Technical Content Developer. Focuses on digital toolkits, SCORM/xAPI compliant interactive sandboxes, and automated diagnostic quiz banks.',
    specialization: 'Interactive Simulators & Assessment Question Banks',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    status: 'Active',
    isInstructor: false,
    organizationId: 'tenant-brac',
    createdAt: '05/02/2026',
    authoredItemsCount: 4
  },
  {
    id: 'auth-sadia',
    personId: 'person-sadia',
    name: 'Sadia Rahman',
    email: 'sadia.rahman@brac.net',
    contactNumber: '+880 1713-334455',
    bio: 'Digital Pedagogy & Assessment Lead. Dual role holder as Master Faculty and Instructional Designer with specialization in youth skill development pathways and adaptive question banks.',
    specialization: 'Curriculum Architecture, Youth Pedagogy & Adaptive Quizzes',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    status: 'Active',
    isInstructor: true,
    instructorId: 'inst-sadia',
    organizationId: 'tenant-brac',
    createdAt: '18/02/2026',
    authoredItemsCount: 3
  },
  {
    id: 'auth-farhana',
    personId: 'person-farhana',
    name: 'Farhana Ahmed',
    email: 'farhana.ahmed@brac.net',
    contactNumber: '+880 1714-556677',
    bio: 'Principal Compliance Specialist and co-author of AML/CFT compliance modules and anti-fraud interactive case studies.',
    specialization: 'Regulatory Compliance Modules & Audit Simulations',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'Active',
    isInstructor: true,
    instructorId: 'inst-farhana',
    organizationId: 'tenant-brac',
    createdAt: '01/03/2026',
    authoredItemsCount: 2
  }
];

export const INITIAL_AUTHORSHIP_RECORDS: AuthorshipRecord[] = [
  {
    id: 'auth-rec-1',
    authorId: 'auth-mahbubur',
    authorName: 'Mahbubur Rahman',
    authorEmail: 'mahbubur.r@brac.net',
    contentItemId: 'cnt-1',
    contentItemTitle: 'VO Grassroots Structure & Member Onboarding Video',
    contentType: 'video',
    courseId: 'crs-brac-101',
    courseName: 'BRAC Microfinance Operations & Client Protection Principles',
    courseStatus: 'Published',
    lmsId: 'LMS-1972-01',
    lmsName: 'BRAC Microfinance Operations & Enterprise Academy',
    version: 'v1.0',
    nodeTitle: 'Lesson 1.1.1: VO Formation & Meeting Governance',
    creditedDate: '10/01/2026',
    rating: 4.9,
    reviewsCount: 84,
    completionRate: 94,
    learnersCount: 1420,
    provenance: [
      'BRAC Microfinance Academy (Course #101)',
      'Field Operations Leadership (Course #104)',
      'International Grassroots Onboarding'
    ],
    feedbackReviews: [
      {
        id: 'rev-1',
        studentName: 'Shahnaz Begum',
        studentRole: 'Credit Officer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: '14/02/2026',
        comment: 'The visual storytelling and animation around Village Organization bylaws made the weekly collection workflow crystal clear.',
        tag: 'High Clarity Video'
      },
      {
        id: 'rev-2',
        studentName: 'Kamal Uddin',
        studentRole: 'Branch Accountant',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        rating: 4.8,
        date: '20/02/2026',
        comment: 'Engaging real-world case simulations. Helped me explain loan cycles to new borrowers with confidence.',
        tag: 'Practical Field Relevance'
      }
    ]
  },
  {
    id: 'auth-rec-2',
    authorId: 'auth-tanvir',
    authorName: 'Tanvir Hossain',
    authorEmail: 'tanvir.hossain@brac.net',
    contentItemId: 'cnt-2',
    contentItemTitle: 'BRAC Client Protection Manual (SOP Ref Guide)',
    contentType: 'document',
    courseId: 'crs-brac-101',
    courseName: 'BRAC Microfinance Operations & Client Protection Principles',
    courseStatus: 'Published',
    lmsId: 'LMS-1972-01',
    lmsName: 'BRAC Microfinance Operations & Enterprise Academy',
    version: 'v1.0',
    nodeTitle: 'Lesson 1.1.1: VO Formation & Meeting Governance',
    creditedDate: '15/01/2026',
    rating: 4.8,
    reviewsCount: 62,
    completionRate: 91,
    learnersCount: 1180,
    provenance: [
      'BRAC Microfinance Academy (Course #101)',
      'Compliance & AML Governance Track (Course #103)'
    ],
    feedbackReviews: [
      {
        id: 'rev-3',
        studentName: 'Rashida Khatun',
        studentRole: 'Senior Program Organizer',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: '02/03/2026',
        comment: 'The step-by-step grievance redressal protocols in this manual prevent compliance escalations in our rural branches.',
        tag: 'Actionable SOP'
      }
    ]
  },
  {
    id: 'auth-rec-3',
    authorId: 'auth-kamrul',
    authorName: 'Kamrul Hasan',
    authorEmail: 'kamrul.h@brac.net',
    contentItemId: 'cnt-3',
    contentItemTitle: 'Formative Check: Client Dignity & Code of Conduct Quiz',
    contentType: 'quiz',
    courseId: 'crs-brac-101',
    courseName: 'BRAC Microfinance Operations & Client Protection Principles',
    courseStatus: 'Published',
    lmsId: 'LMS-1972-01',
    lmsName: 'BRAC Microfinance Operations & Enterprise Academy',
    version: 'v1.0',
    nodeTitle: 'Lesson 1.1.1: VO Formation & Meeting Governance',
    creditedDate: '05/02/2026',
    rating: 4.7,
    reviewsCount: 95,
    completionRate: 88,
    learnersCount: 1350,
    provenance: [
      'BRAC Microfinance Academy (Course #101)',
      'Universal Code of Conduct Bank'
    ],
    feedbackReviews: [
      {
        id: 'rev-4',
        studentName: 'Anwar Parvez',
        studentRole: 'Field Supervisor',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
        rating: 4.6,
        date: '28/02/2026',
        comment: 'Scenario-based questions test real ethical dilemmas rather than mere rote memorization.',
        tag: 'Rigorous Quiz'
      }
    ]
  },
  {
    id: 'auth-rec-4',
    authorId: 'auth-mahbubur',
    authorName: 'Mahbubur Rahman',
    authorEmail: 'mahbubur.r@brac.net',
    contentItemId: 'cnt-4',
    contentItemTitle: 'Field Cash Handling & Digital Collections Walkthrough',
    contentType: 'video',
    courseId: 'crs-brac-101',
    courseName: 'BRAC Microfinance Operations & Client Protection Principles',
    courseStatus: 'Published',
    lmsId: 'LMS-1972-01',
    lmsName: 'BRAC Microfinance Operations & Enterprise Academy',
    version: 'v1.0',
    nodeTitle: 'Lesson 1.1.2: Digital Ledger Reconciliation',
    creditedDate: '12/01/2026',
    rating: 5.0,
    reviewsCount: 76,
    completionRate: 96,
    learnersCount: 1290,
    provenance: [
      'BRAC Microfinance Academy (Course #101)',
      'Digital Microfinance Pilot Hub'
    ],
    feedbackReviews: [
      {
        id: 'rev-5',
        studentName: 'Fatima Noor',
        studentRole: 'Digital Cash Officer',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: '08/03/2026',
        comment: 'The exact mobile tablet screen captures made balancing daily batch ledgers straightforward.',
        tag: 'Flawless Walkthrough'
      }
    ]
  },
  {
    id: 'auth-rec-5',
    authorId: 'auth-ayesha',
    authorName: 'Ayesha Siddiqua',
    authorEmail: 'ayesha.s@brac.net',
    contentItemId: 'cnt-upg-1',
    contentItemTitle: 'Household Mentorship Coaching Video Simulation',
    contentType: 'video',
    courseId: 'crs-brac-102',
    courseName: 'Ultra-Poor Graduation (UPG) Coaching & Asset Transfer Mastery',
    courseStatus: 'Published',
    lmsId: 'LMS-1972-02',
    lmsName: 'Ultra-Poor Graduation & Social Development Institute',
    version: 'v1.1',
    nodeTitle: 'Lesson 1.1: Household Selection & Vulnerability Index',
    creditedDate: '24/01/2026',
    rating: 4.9,
    reviewsCount: 54,
    completionRate: 93,
    learnersCount: 920,
    provenance: [
      'Ultra-Poor Graduation Institute (Course #102)',
      'Global Social Development Hub'
    ],
    feedbackReviews: [
      {
        id: 'rev-6',
        studentName: 'Mamunur Rashid',
        studentRole: 'Community Development Specialist',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: '01/03/2026',
        comment: 'The empathy-driven coaching demonstrations provide profound insight into household mentorship.',
        tag: 'High Emotional Intelligence'
      }
    ]
  },
  {
    id: 'auth-rec-6',
    authorId: 'auth-sadia',
    authorName: 'Sadia Rahman',
    authorEmail: 'sadia.rahman@brac.net',
    contentItemId: 'cnt-upg-2',
    contentItemTitle: 'Asset Transfer Diagnostic Questionnaire & Scoring Matrix',
    contentType: 'quiz',
    courseId: 'crs-brac-102',
    courseName: 'Ultra-Poor Graduation (UPG) Coaching & Asset Transfer Mastery',
    courseStatus: 'Published',
    lmsId: 'LMS-1972-02',
    lmsName: 'Ultra-Poor Graduation & Social Development Institute',
    version: 'v1.1',
    nodeTitle: 'Lesson 1.2: Asset Allocation & Livelihood Planning',
    creditedDate: '20/02/2026',
    rating: 4.8,
    reviewsCount: 42,
    completionRate: 90,
    learnersCount: 780,
    provenance: [
      'Ultra-Poor Graduation Institute (Course #102)'
    ],
    feedbackReviews: [
      {
        id: 'rev-7',
        studentName: 'Jahangir Alam',
        studentRole: 'Livelihood Coach',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
        rating: 4.8,
        date: '04/03/2026',
        comment: 'Clear rubrics for evaluating livestock viability and household readiness.',
        tag: 'Accurate Rubrics'
      }
    ]
  },
  {
    id: 'auth-rec-7',
    authorId: 'auth-kamrul',
    authorName: 'Kamrul Hasan',
    authorEmail: 'kamrul.h@brac.net',
    contentItemId: 'cnt-upg-3',
    contentItemTitle: 'Graduation Criteria Milestone Verification Simulator',
    contentType: 'interactive',
    courseId: 'crs-brac-102',
    courseName: 'Ultra-Poor Graduation (UPG) Coaching & Asset Transfer Mastery',
    courseStatus: 'Published',
    lmsId: 'LMS-1972-02',
    lmsName: 'Ultra-Poor Graduation & Social Development Institute',
    version: 'v1.1',
    nodeTitle: 'Lesson 1.3: Milestone Tracking & Graduation Evaluation',
    creditedDate: '08/02/2026',
    rating: 4.9,
    reviewsCount: 38,
    completionRate: 92,
    learnersCount: 650,
    provenance: [
      'Ultra-Poor Graduation Institute (Course #102)',
      'Adaptive Graduation Simulator Suite'
    ],
    feedbackReviews: [
      {
        id: 'rev-8',
        studentName: 'Nusrat Jahan',
        studentRole: 'Program Manager',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: '10/03/2026',
        comment: 'The simulated graduation dashboard allowed our teams to practice evaluating nutrition, savings, and income targets without real-world risk.',
        tag: 'Interactive Excellence'
      }
    ]
  },
  {
    id: 'auth-rec-8',
    authorId: 'auth-farhana',
    authorName: 'Farhana Ahmed',
    authorEmail: 'farhana.ahmed@brac.net',
    contentItemId: 'cnt-aml-1',
    contentItemTitle: 'Anti-Money Laundering & Sanctions Screening Standard SOP',
    contentType: 'document',
    courseId: 'crs-brac-103',
    courseName: 'Enterprise Compliance, AML & Operational Risk Governance',
    courseStatus: 'Published',
    lmsId: 'LMS-1972-01',
    lmsName: 'BRAC Microfinance Operations & Enterprise Academy',
    version: 'v2.0',
    nodeTitle: 'Lesson 2.1: KYC Verification & Suspicious Transaction Reporting',
    creditedDate: '05/03/2026',
    rating: 4.8,
    reviewsCount: 50,
    completionRate: 95,
    learnersCount: 1600,
    provenance: [
      'BRAC Enterprise Compliance (Course #103)',
      'Central Compliance Knowledge Base'
    ],
    feedbackReviews: [
      {
        id: 'rev-9',
        studentName: 'Mizanur Rahman',
        studentRole: 'Audit Officer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        rating: 4.9,
        date: '12/03/2026',
        comment: 'Strict regulatory clauses broken down into actionable flowchart diagrams.',
        tag: 'Regulatory Rigor'
      }
    ]
  },
  {
    id: 'auth-rec-9',
    authorId: 'auth-mahbubur',
    authorName: 'Mahbubur Rahman',
    authorEmail: 'mahbubur.r@brac.net',
    contentItemId: 'cnt-repo-reused-1',
    contentItemTitle: 'VO Grassroots Structure & Member Onboarding Video',
    contentType: 'video',
    courseId: 'crs-brac-104',
    courseName: 'Field Operations Leadership & Branch Management',
    courseStatus: 'Draft',
    lmsId: 'LMS-1972-01',
    lmsName: 'BRAC Microfinance Operations & Enterprise Academy',
    version: 'v1.0',
    nodeTitle: 'Lesson 1.1: Foundations of Branch Oversight',
    creditedDate: '10/01/2026',
    rating: 4.9,
    reviewsCount: 18,
    completionRate: 89,
    learnersCount: 310,
    provenance: [
      'Syndicated from Course #101',
      'Branch Manager Leadership Sandbox'
    ],
    feedbackReviews: [
      {
        id: 'rev-10',
        studentName: 'Habibur Rahman',
        studentRole: 'Assistant Branch Manager',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        rating: 4.9,
        date: '16/03/2026',
        comment: 'Reused directly in our management track—solid continuity across levels.',
        tag: 'Cross-Course Asset'
      }
    ]
  }
];
