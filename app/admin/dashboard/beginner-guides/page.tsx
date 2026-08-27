'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

interface KandaItem {
  id: string;
  kandaNumber: number;
  englishName: string;
  sanskritName: string;
  description: string;
  mostRecited: boolean;
  displayOrder: number;
}

interface WorryItem {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
}

interface RelatedContentItem {
  id: string;
  contentType: 'Ritual Guide' | 'Concept' | 'Dates' | 'Beginner Guide' | 'Other';
  title: string;
  description: string;
  target?: string;
  displayOrder: number;
}

interface BeginnerGuide {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

  // Banner Section
  bannerEyebrow?: string | null;
  bannerBadgeText?: string | null;
  bannerBadgeIcon?: string | null;
  bannerTitle?: string | null;
  bannerDescription?: string | null;
  bannerPrimaryCtaText?: string | null;
  bannerPrimaryCtaAction?: string | null;
  bannerPrimaryCtaTarget?: string | null;
  bannerSecondaryCtaText?: string | null;
  bannerSecondaryCtaAction?: string | null;
  bannerSecondaryCtaTarget?: string | null;
  bannerShareEnabled?: boolean;
  bannerShareButtonText?: string | null;

  // Intro Section
  introHeading?: string | null;
  introDescription?: string | null;
  introImage?: string | null;
  introImageAltText?: string | null;
  introImageCaption?: string | null;

  // Why / Seven Kandas Section
  whySectionHeading?: string | null;
  whySectionSubtitle?: string | null;
  kandasJson?: string | null;

  // Where to Start Section
  whereToStartHeading?: string | null;
  whereToStartIntro?: string | null;
  whereToStartHighlight?: string | null;
  whereToStartSupporting?: string | null;
  whereToStartSubHeading?: string | null;
  whereToStartSubIntro?: string | null;
  whereToStartFinalDescription?: string | null;

  // Common Worries Section
  commonWorriesHeading?: string | null;
  commonWorriesSubtitle?: string | null;
  commonWorriesJson?: string | null;
  commonWorriesClosing?: string | null;

  // What to Read Next Section
  whatToReadNextHeading?: string | null;
  whatToReadNextSubtitle?: string | null;
  whatToReadNextItemsJson?: string | null;

  createdAt: string;
  updatedAt: string;
}

// Simple Rich Text Editor Component
function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = '120px',
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const promptLink = () => {
    const url = prompt('Enter link URL (e.g. https://tapa.co/guides/...)');
    if (url) {
      exec('createLink', url);
    }
  };

  return (
    <div style={{ border: '1px solid #D1D5DB', borderRadius: '12px', overflow: 'hidden', background: '#FFFFFF' }}>
      {/* Toolbar */}
      <div
        style={{
          background: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB',
          padding: '6px 10px',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => exec('bold')}
          title="Bold"
          style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          title="Italic"
          style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', fontStyle: 'italic', cursor: 'pointer' }}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => exec('underline')}
          title="Underline"
          style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
        >
          U
        </button>
        <div style={{ width: '1px', height: '18px', background: '#E5E7EB', margin: '0 4px' }} />
        <button
          type="button"
          onClick={() => exec('formatBlock', '<h2>')}
          title="Heading 2"
          style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<h3>')}
          title="Heading 3"
          style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<p>')}
          title="Paragraph"
          style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
        >
          P
        </button>
        <div style={{ width: '1px', height: '18px', background: '#E5E7EB', margin: '0 4px' }} />
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          title="Bullet List"
          style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          title="Numbered List"
          style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={promptLink}
          title="Add Link"
          style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
        >
          🔗 Link
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<blockquote>')}
          title="Blockquote"
          style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
        >
          “ Quote
        </button>
        <div style={{ width: '1px', height: '18px', background: '#E5E7EB', margin: '0 4px' }} />
        <button
          type="button"
          onClick={() => exec('removeFormat')}
          title="Clear Formatting"
          style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
        >
          ✕ Clear Format
        </button>
      </div>

      {/* Editable Content Div */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{
          minHeight,
          padding: '12px 14px',
          fontSize: '13px',
          lineHeight: '1.6',
          color: '#111827',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        data-placeholder={placeholder}
      />
    </div>
  );
}

const DEFAULT_BANNER_DEMO = {
  bannerEyebrow: "BEGINNER'S GUIDES · START HERE",
  bannerBadgeText: 'A MAP BEFORE THE JOURNEY',
  bannerBadgeIcon: '🗺️ Map / Compass',
  bannerTitle: 'Ramcharitmanas: The Seven Kandas Explained',
  bannerDescription: 'What each section contains, why each matters, and where Sundarkand fits.',
  bannerPrimaryCtaText: 'See the seven kandas',
  bannerPrimaryCtaAction: 'Section Anchor',
  bannerPrimaryCtaTarget: '#kandas',
  bannerSecondaryCtaText: 'Save this',
  bannerSecondaryCtaAction: 'Custom Action',
  bannerSecondaryCtaTarget: '',
  bannerShareEnabled: true,
  bannerShareButtonText: 'Share',
  category: 'Itihasa',
};

const DEFAULT_INTRO_DEMO = {
  introHeading: 'The map before the journey.',
  introDescription: '<p>The Ramcharitmanas is Tulsidas\'s retelling of the Ramayana in Awadhi, and it is divided into seven sections called kandas. Each covers a phase of Ram\'s story.</p><p>If you are starting with Sundarkand — as most people do — this shows you where it sits and what surrounds it.</p>',
  introImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  introImageAltText: 'Seven Ramcharitmanas books representing the seven kandas, with Sundarkand as the fifth.',
  introImageCaption: 'Seven books. One story. Sundarkand is the fifth.',
};

const DEFAULT_KANDAS_DEMO: KandaItem[] = [
  {
    id: 'kanda-1',
    kandaNumber: 1,
    englishName: 'Bala Kanda',
    sanskritName: 'बालकाण्ड',
    description: 'Ram\'s birth and childhood, the breaking of Shiva\'s bow, the marriage to Sita.',
    mostRecited: false,
    displayOrder: 1,
  },
  {
    id: 'kanda-2',
    kandaNumber: 2,
    englishName: 'Ayodhya Kanda',
    sanskritName: 'अयोध्याकाण्ड',
    description: 'The exile. Dasharatha\'s promise, Kaikeyi\'s demand, the departure for the forest, Bharat\'s refusal of the throne.',
    mostRecited: false,
    displayOrder: 2,
  },
  {
    id: 'kanda-3',
    kandaNumber: 3,
    englishName: 'Aranya Kanda',
    sanskritName: 'अरण्यकाण्ड',
    description: 'The forest years. Shurpanakha, the golden deer, the abduction of Sita, Jatayu.',
    mostRecited: false,
    displayOrder: 3,
  },
  {
    id: 'kanda-4',
    kandaNumber: 4,
    englishName: 'Kishkindha Kanda',
    sanskritName: 'किष्किन्धाकाण्ड',
    description: 'The alliance with the vanaras. Sugriva, Vali, and the decision to send Hanuman south.',
    mostRecited: false,
    displayOrder: 4,
  },
  {
    id: 'kanda-5',
    kandaNumber: 5,
    englishName: 'Sundarkand',
    sanskritName: 'सुन्दरकाण्ड',
    description: 'Hanuman alone. The leap to Lanka, the search, finding Sita, the burning of Lanka, the return.',
    mostRecited: true,
    displayOrder: 5,
  },
  {
    id: 'kanda-6',
    kandaNumber: 6,
    englishName: 'Lanka Kanda',
    sanskritName: 'लंकाकाण्ड',
    description: 'The war. The bridge, the battle, Ravana, the return to Ayodhya.',
    mostRecited: false,
    displayOrder: 6,
  },
  {
    id: 'kanda-7',
    kandaNumber: 7,
    englishName: 'Uttar Kanda',
    sanskritName: 'उत्तरकाण्ड',
    description: 'After the return. Ram\'s reign, and Tulsidas\'s closing teachings.',
    mostRecited: false,
    displayOrder: 7,
  },
];

const DEFAULT_WHERE_TO_START_DEMO = {
  whereToStartHeading: 'Why Sundarkand is the one people recite',
  whereToStartIntro: 'Every other kanda is about Ram. Sundarkand is about a devotee — sent on an errand nobody was sure could be completed, with no army, no certainty and no way back if it went wrong.',
  whereToStartHighlight: 'It is also the only kanda that ends entirely in success. Nothing is lost in it.',
  whereToStartSupporting: 'The exile is not reversed, the war has not started, and for the length of one section a difficult thing is attempted and simply works. That is a reasonable thing to want to read aloud on a Tuesday evening.',
  whereToStartSubHeading: 'Where to start',
  whereToStartSubIntro: 'You do not need to read the first four kandas before Sundarkand. Most households that recite it weekly have never read the Uttar Kanda at all.',
  whereToStartFinalDescription: 'If you want the story in order, start at Bala Kanda and read at your own pace. If you want to begin the practice, start at Sundarkand.',
};

const DEFAULT_COMMON_WORRIES_DEMO: WorryItem[] = [
  {
    id: 'worry-1',
    question: '"Should I read the whole thing first?"',
    answer: 'No. Starting at Sundarkand is the normal way in, and it is how most households begin.',
    displayOrder: 1,
  },
  {
    id: 'worry-2',
    question: '"Is the Ramcharitmanas the same as the Ramayana?"',
    answer: 'It is a retelling. Valmiki\'s Ramayana is the older Sanskrit epic; Tulsidas wrote the Ramcharitmanas in Awadhi in the sixteenth century so that people without Sanskrit could read it. Both are read; they are different books.',
    displayOrder: 2,
  },
  {
    id: 'worry-3',
    question: '"Which edition should I buy?"',
    answer: 'The Gita Press Gorakhpur edition is the standard one and is inexpensive. Any edition with a transliteration you can read is fine.',
    displayOrder: 3,
  },
  {
    id: 'worry-4',
    question: '"My Hindi is not strong enough for Awadhi."',
    answer: 'Almost nobody\'s is. Every common edition prints a Hindi paraphrase alongside the verse, and many print a transliteration too. Read the verse aloud and the meaning beside it.',
    displayOrder: 4,
  },
];

const DEFAULT_WORRIES_CLOSING_DEMO = `<p>Seven books, one story, and no obligation to read them in order. The households that recite Sundarkand every Tuesday are not skipping ahead — they are doing the thing the tradition has done for four centuries.</p><p>Find out where Sundarkand sits. Then open it, and start.</p>`;

const DEFAULT_WHAT_TO_READ_NEXT_DEMO: RelatedContentItem[] = [
  {
    id: 'next-1',
    contentType: 'Ritual Guide',
    title: 'Sundarkand Path — complete home vidhi',
    description: 'How the recitation is performed at home, start to finish, with the sourcing behind each step.',
    target: '/guides/sundarkand-path-complete-home-vidhi',
    displayOrder: 1,
  },
  {
    id: 'next-2',
    contentType: 'Ritual Guide',
    title: 'Hanuman Chalisa',
    description: 'Forty verses, and where they sit alongside the Sundarkand.',
    target: '/guides/hanuman-chalisa',
    displayOrder: 2,
  },
  {
    id: 'next-3',
    contentType: 'Concept',
    title: 'Sundarkand for beginners',
    description: 'The story itself, told plainly — coming soon.',
    target: '/concepts/sundarkand-for-beginners',
    displayOrder: 3,
  },
  {
    id: 'next-4',
    contentType: 'Dates',
    title: 'Hanuman Jayanti · Ram Navami',
    description: 'When the recitation is most often kept.',
    target: '/dates/hanuman-jayanti-ram-navami',
    displayOrder: 4,
  },
];

type BeginnerGuideFormTab = 'banner' | 'intro' | 'why' | 'where-to-start' | 'common-worries' | 'what-to-read-next';

function BeginnerGuidesCmsContent() {
  const { data: session, status } = useSession();

  // Data & Filtering States
  const [guides, setGuides] = useState<BeginnerGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Active Tab State for Form Editor
  const [activeTab, setActiveTab] = useState<BeginnerGuideFormTab>('banner');

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: DEFAULT_BANNER_DEMO.bannerTitle,
    slug: 'ramcharitmanas-seven-kandas-explained',
    category: DEFAULT_BANNER_DEMO.category,
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',

    // Banner Section Fields
    bannerEyebrow: DEFAULT_BANNER_DEMO.bannerEyebrow,
    bannerBadgeText: DEFAULT_BANNER_DEMO.bannerBadgeText,
    bannerBadgeIcon: DEFAULT_BANNER_DEMO.bannerBadgeIcon,
    bannerTitle: DEFAULT_BANNER_DEMO.bannerTitle,
    bannerDescription: DEFAULT_BANNER_DEMO.bannerDescription,
    bannerPrimaryCtaText: DEFAULT_BANNER_DEMO.bannerPrimaryCtaText,
    bannerPrimaryCtaAction: DEFAULT_BANNER_DEMO.bannerPrimaryCtaAction,
    bannerPrimaryCtaTarget: DEFAULT_BANNER_DEMO.bannerPrimaryCtaTarget,
    bannerSecondaryCtaText: DEFAULT_BANNER_DEMO.bannerSecondaryCtaText,
    bannerSecondaryCtaAction: DEFAULT_BANNER_DEMO.bannerSecondaryCtaAction,
    bannerSecondaryCtaTarget: DEFAULT_BANNER_DEMO.bannerSecondaryCtaTarget,
    bannerShareEnabled: DEFAULT_BANNER_DEMO.bannerShareEnabled,
    bannerShareButtonText: DEFAULT_BANNER_DEMO.bannerShareButtonText,

    // Intro Section Fields
    introHeading: DEFAULT_INTRO_DEMO.introHeading,
    introDescription: DEFAULT_INTRO_DEMO.introDescription,
    introImage: DEFAULT_INTRO_DEMO.introImage,
    introImageAltText: DEFAULT_INTRO_DEMO.introImageAltText,
    introImageCaption: DEFAULT_INTRO_DEMO.introImageCaption,

    // Why / Seven Kandas Section Fields
    whySectionHeading: 'The seven kandas',
    whySectionSubtitle: 'In order. Sundarkand is the fifth.',
    kandasItems: DEFAULT_KANDAS_DEMO,

    // Where to Start Section Fields
    whereToStartHeading: DEFAULT_WHERE_TO_START_DEMO.whereToStartHeading,
    whereToStartIntro: DEFAULT_WHERE_TO_START_DEMO.whereToStartIntro,
    whereToStartHighlight: DEFAULT_WHERE_TO_START_DEMO.whereToStartHighlight,
    whereToStartSupporting: DEFAULT_WHERE_TO_START_DEMO.whereToStartSupporting,
    whereToStartSubHeading: DEFAULT_WHERE_TO_START_DEMO.whereToStartSubHeading,
    whereToStartSubIntro: DEFAULT_WHERE_TO_START_DEMO.whereToStartSubIntro,
    whereToStartFinalDescription: DEFAULT_WHERE_TO_START_DEMO.whereToStartFinalDescription,

    // Common Worries Section Fields
    commonWorriesHeading: 'Common worries — answered',
    commonWorriesSubtitle: 'Every one of these has been asked by someone opening the book for the first time.',
    worriesItems: DEFAULT_COMMON_WORRIES_DEMO,
    commonWorriesClosing: DEFAULT_WORRIES_CLOSING_DEMO,

    // What to Read Next Section Fields
    whatToReadNextHeading: 'What to read next',
    whatToReadNextSubtitle: 'When you want the practice, or the detail.',
    relatedItems: DEFAULT_WHAT_TO_READ_NEXT_DEMO,
  });

  // Action Feedback States
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const userRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'USER';
  const isAuthorized = ['ADMIN', 'EDITOR'].includes(userRole);
  const userEmail = session?.user?.email || (session?.user as any)?.phone || 'admin@tapa.co';

  // Fetch guides from backend API
  const fetchGuides = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/beginner-guides?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setGuides(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch beginner guides:', err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter]);

  useEffect(() => {
    if (status === 'authenticated' && isAuthorized) {
      fetchGuides();
    }
  }, [status, isAuthorized, fetchGuides]);

  // Handle auto-slugification on title change
  const handleTitleChange = (newTitle: string) => {
    const autoSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      bannerTitle: newTitle,
      slug: editingId ? prev.slug : autoSlug,
    }));
  };

  // State Mutators for Repeatable Kandas List
  const addKandaItem = () => {
    const nextNumber = formData.kandasItems.length + 1;
    const newKanda: KandaItem = {
      id: 'kanda-' + Date.now(),
      kandaNumber: nextNumber,
      englishName: `Kanda ${nextNumber}`,
      sanskritName: `काण्ड ${nextNumber}`,
      description: 'Enter kanda narrative description...',
      mostRecited: false,
      displayOrder: nextNumber,
    };
    setFormData((prev) => ({
      ...prev,
      kandasItems: [...prev.kandasItems, newKanda],
    }));
  };

  const updateKandaItem = (id: string, field: keyof KandaItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      kandasItems: prev.kandasItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeKandaItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      kandasItems: prev.kandasItems.filter((item) => item.id !== id),
    }));
  };

  const moveKandaItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.kandasItems.length) return;
    const updated = [...formData.kandasItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, kandasItems: updated }));
  };

  // State Mutators for Repeatable Worries List
  const addWorryItem = () => {
    const nextNumber = formData.worriesItems.length + 1;
    const newWorry: WorryItem = {
      id: 'worry-' + Date.now(),
      question: `"New Worry Question ${nextNumber}?"`,
      answer: 'Enter detailed answer text here...',
      displayOrder: nextNumber,
    };
    setFormData((prev) => ({
      ...prev,
      worriesItems: [...prev.worriesItems, newWorry],
    }));
  };

  const updateWorryItem = (id: string, field: keyof WorryItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      worriesItems: prev.worriesItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeWorryItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      worriesItems: prev.worriesItems.filter((item) => item.id !== id),
    }));
  };

  const moveWorryItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.worriesItems.length) return;
    const updated = [...formData.worriesItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, worriesItems: updated }));
  };

  // State Mutators for Repeatable Related Content Items
  const addRelatedItem = () => {
    const nextNumber = formData.relatedItems.length + 1;
    const newRelated: RelatedContentItem = {
      id: 'next-' + Date.now(),
      contentType: 'Ritual Guide',
      title: `Related Content Title ${nextNumber}`,
      description: 'Enter description for related content...',
      target: '',
      displayOrder: nextNumber,
    };
    setFormData((prev) => ({
      ...prev,
      relatedItems: [...prev.relatedItems, newRelated],
    }));
  };

  const updateRelatedItem = (id: string, field: keyof RelatedContentItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      relatedItems: prev.relatedItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeRelatedItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      relatedItems: prev.relatedItems.filter((item) => item.id !== id),
    }));
  };

  const moveRelatedItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.relatedItems.length) return;
    const updated = [...formData.relatedItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, relatedItems: updated }));
  };

  // Open modal for Create Mode with prefilled exact demo data
  const openCreateModal = () => {
    setEditingId(null);
    setActiveTab('banner');
    setFormData({
      title: DEFAULT_BANNER_DEMO.bannerTitle,
      slug: 'ramcharitmanas-seven-kandas-explained',
      category: DEFAULT_BANNER_DEMO.category,
      status: 'DRAFT',

      bannerEyebrow: DEFAULT_BANNER_DEMO.bannerEyebrow,
      bannerBadgeText: DEFAULT_BANNER_DEMO.bannerBadgeText,
      bannerBadgeIcon: DEFAULT_BANNER_DEMO.bannerBadgeIcon,
      bannerTitle: DEFAULT_BANNER_DEMO.bannerTitle,
      bannerDescription: DEFAULT_BANNER_DEMO.bannerDescription,
      bannerPrimaryCtaText: DEFAULT_BANNER_DEMO.bannerPrimaryCtaText,
      bannerPrimaryCtaAction: DEFAULT_BANNER_DEMO.bannerPrimaryCtaAction,
      bannerPrimaryCtaTarget: DEFAULT_BANNER_DEMO.bannerPrimaryCtaTarget,
      bannerSecondaryCtaText: DEFAULT_BANNER_DEMO.bannerSecondaryCtaText,
      bannerSecondaryCtaAction: DEFAULT_BANNER_DEMO.bannerSecondaryCtaAction,
      bannerSecondaryCtaTarget: DEFAULT_BANNER_DEMO.bannerSecondaryCtaTarget,
      bannerShareEnabled: DEFAULT_BANNER_DEMO.bannerShareEnabled,
      bannerShareButtonText: DEFAULT_BANNER_DEMO.bannerShareButtonText,

      introHeading: DEFAULT_INTRO_DEMO.introHeading,
      introDescription: DEFAULT_INTRO_DEMO.introDescription,
      introImage: DEFAULT_INTRO_DEMO.introImage,
      introImageAltText: DEFAULT_INTRO_DEMO.introImageAltText,
      introImageCaption: DEFAULT_INTRO_DEMO.introImageCaption,

      whySectionHeading: 'The seven kandas',
      whySectionSubtitle: 'In order. Sundarkand is the fifth.',
      kandasItems: DEFAULT_KANDAS_DEMO,

      whereToStartHeading: DEFAULT_WHERE_TO_START_DEMO.whereToStartHeading,
      whereToStartIntro: DEFAULT_WHERE_TO_START_DEMO.whereToStartIntro,
      whereToStartHighlight: DEFAULT_WHERE_TO_START_DEMO.whereToStartHighlight,
      whereToStartSupporting: DEFAULT_WHERE_TO_START_DEMO.whereToStartSupporting,
      whereToStartSubHeading: DEFAULT_WHERE_TO_START_DEMO.whereToStartSubHeading,
      whereToStartSubIntro: DEFAULT_WHERE_TO_START_DEMO.whereToStartSubIntro,
      whereToStartFinalDescription: DEFAULT_WHERE_TO_START_DEMO.whereToStartFinalDescription,

      commonWorriesHeading: 'Common worries — answered',
      commonWorriesSubtitle: 'Every one of these has been asked by someone opening the book for the first time.',
      worriesItems: DEFAULT_COMMON_WORRIES_DEMO,
      commonWorriesClosing: DEFAULT_WORRIES_CLOSING_DEMO,

      whatToReadNextHeading: 'What to read next',
      whatToReadNextSubtitle: 'When you want the practice, or the detail.',
      relatedItems: DEFAULT_WHAT_TO_READ_NEXT_DEMO,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit Mode
  const openEditModal = (guide: BeginnerGuide) => {
    setEditingId(guide.id);
    setActiveTab('banner');

    let parsedKandas: KandaItem[] = DEFAULT_KANDAS_DEMO;
    if (guide.kandasJson) {
      try {
        parsedKandas = JSON.parse(guide.kandasJson);
      } catch (e) { }
    }

    let parsedWorries: WorryItem[] = DEFAULT_COMMON_WORRIES_DEMO;
    if (guide.commonWorriesJson) {
      try {
        parsedWorries = JSON.parse(guide.commonWorriesJson);
      } catch (e) { }
    }

    let parsedNext: RelatedContentItem[] = DEFAULT_WHAT_TO_READ_NEXT_DEMO;
    if (guide.whatToReadNextItemsJson) {
      try {
        parsedNext = JSON.parse(guide.whatToReadNextItemsJson);
      } catch (e) { }
    }

    setFormData({
      title: guide.title || DEFAULT_BANNER_DEMO.bannerTitle,
      slug: guide.slug,
      category: guide.category || DEFAULT_BANNER_DEMO.category,
      status: guide.status || 'DRAFT',

      bannerEyebrow: guide.bannerEyebrow ?? DEFAULT_BANNER_DEMO.bannerEyebrow,
      bannerBadgeText: guide.bannerBadgeText ?? DEFAULT_BANNER_DEMO.bannerBadgeText,
      bannerBadgeIcon: guide.bannerBadgeIcon ?? DEFAULT_BANNER_DEMO.bannerBadgeIcon,
      bannerTitle: guide.bannerTitle ?? guide.title ?? DEFAULT_BANNER_DEMO.bannerTitle,
      bannerDescription: guide.bannerDescription ?? DEFAULT_BANNER_DEMO.bannerDescription,
      bannerPrimaryCtaText: guide.bannerPrimaryCtaText ?? DEFAULT_BANNER_DEMO.bannerPrimaryCtaText,
      bannerPrimaryCtaAction: guide.bannerPrimaryCtaAction ?? DEFAULT_BANNER_DEMO.bannerPrimaryCtaAction,
      bannerPrimaryCtaTarget: guide.bannerPrimaryCtaTarget ?? DEFAULT_BANNER_DEMO.bannerPrimaryCtaTarget,
      bannerSecondaryCtaText: guide.bannerSecondaryCtaText ?? DEFAULT_BANNER_DEMO.bannerSecondaryCtaText,
      bannerSecondaryCtaAction: guide.bannerSecondaryCtaAction ?? DEFAULT_BANNER_DEMO.bannerSecondaryCtaAction,
      bannerSecondaryCtaTarget: guide.bannerSecondaryCtaTarget ?? DEFAULT_BANNER_DEMO.bannerSecondaryCtaTarget,
      bannerShareEnabled: guide.bannerShareEnabled ?? true,
      bannerShareButtonText: guide.bannerShareButtonText ?? DEFAULT_BANNER_DEMO.bannerShareButtonText,

      introHeading: guide.introHeading ?? DEFAULT_INTRO_DEMO.introHeading,
      introDescription: guide.introDescription ?? DEFAULT_INTRO_DEMO.introDescription,
      introImage: guide.introImage ?? DEFAULT_INTRO_DEMO.introImage,
      introImageAltText: guide.introImageAltText ?? DEFAULT_INTRO_DEMO.introImageAltText,
      introImageCaption: guide.introImageCaption ?? DEFAULT_INTRO_DEMO.introImageCaption,

      whySectionHeading: guide.whySectionHeading ?? 'The seven kandas',
      whySectionSubtitle: guide.whySectionSubtitle ?? 'In order. Sundarkand is the fifth.',
      kandasItems: parsedKandas,

      whereToStartHeading: guide.whereToStartHeading ?? DEFAULT_WHERE_TO_START_DEMO.whereToStartHeading,
      whereToStartIntro: guide.whereToStartIntro ?? DEFAULT_WHERE_TO_START_DEMO.whereToStartIntro,
      whereToStartHighlight: guide.whereToStartHighlight ?? DEFAULT_WHERE_TO_START_DEMO.whereToStartHighlight,
      whereToStartSupporting: guide.whereToStartSupporting ?? DEFAULT_WHERE_TO_START_DEMO.whereToStartSupporting,
      whereToStartSubHeading: guide.whereToStartSubHeading ?? DEFAULT_WHERE_TO_START_DEMO.whereToStartSubHeading,
      whereToStartSubIntro: guide.whereToStartSubIntro ?? DEFAULT_WHERE_TO_START_DEMO.whereToStartSubIntro,
      whereToStartFinalDescription: guide.whereToStartFinalDescription ?? DEFAULT_WHERE_TO_START_DEMO.whereToStartFinalDescription,

      commonWorriesHeading: guide.commonWorriesHeading ?? 'Common worries — answered',
      commonWorriesSubtitle: guide.commonWorriesSubtitle ?? 'Every one of these has been asked by someone opening the book for the first time.',
      worriesItems: parsedWorries,
      commonWorriesClosing: guide.commonWorriesClosing ?? DEFAULT_WORRIES_CLOSING_DEMO,

      whatToReadNextHeading: guide.whatToReadNextHeading ?? 'What to read next',
      whatToReadNextSubtitle: guide.whatToReadNextSubtitle ?? 'When you want the practice, or the detail.',
      relatedItems: parsedNext,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Save (Create or Update) Guide
  const handleSaveGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.bannerEyebrow.trim()) {
      setFormError('Eyebrow field is required.');
      return;
    }

    if (!formData.bannerBadgeText.trim()) {
      setFormError('Badge Text field is required.');
      return;
    }

    if (!formData.bannerTitle.trim() && !formData.title.trim()) {
      setFormError('Title field is required.');
      return;
    }

    if (!formData.bannerDescription.trim()) {
      setFormError('Description field is required.');
      return;
    }

    if (!formData.introHeading.trim()) {
      setFormError('Intro Heading field is required.');
      return;
    }

    if (!formData.introDescription.trim()) {
      setFormError('Intro Description field is required.');
      return;
    }

    if (!formData.whySectionHeading.trim()) {
      setFormError('Section Heading for "Why / The Seven Kandas" is required.');
      return;
    }

    if (!formData.whySectionSubtitle.trim()) {
      setFormError('Section Subtitle for "Why / The Seven Kandas" is required.');
      return;
    }

    if (!formData.whereToStartHeading.trim()) {
      setFormError('Section Heading for "Where to Start" is required.');
      return;
    }

    if (!formData.whereToStartIntro.trim()) {
      setFormError('Introduction for "Where to Start" is required.');
      return;
    }

    if (!formData.commonWorriesHeading.trim()) {
      setFormError('Section Heading for "Common Worries — Answered" is required.');
      return;
    }

    if (!formData.commonWorriesSubtitle.trim()) {
      setFormError('Section Subtitle for "Common Worries — Answered" is required.');
      return;
    }

    if (!formData.commonWorriesClosing.trim()) {
      setFormError('Closing Content for "Common Worries — Answered" is required.');
      return;
    }

    if (!formData.whatToReadNextHeading.trim()) {
      setFormError('Section Heading for "What to Read Next" is required.');
      return;
    }

    if (!formData.whatToReadNextSubtitle.trim()) {
      setFormError('Section Subtitle for "What to Read Next" is required.');
      return;
    }

    setFormLoading(true);
    try {
      const url = editingId
        ? `/api/admin/beginner-guides/${editingId}`
        : '/api/admin/beginner-guides';
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        title: formData.bannerTitle || formData.title,
        kandasJson: JSON.stringify(formData.kandasItems),
        commonWorriesJson: JSON.stringify(formData.worriesItems),
        whatToReadNextItemsJson: JSON.stringify(formData.relatedItems),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || 'Failed to save Beginner Guide.');
      } else {
        setSuccessMessage(
          editingId
            ? 'Beginner Guide updated successfully!'
            : 'New Beginner Guide created successfully!'
        );
        setIsModalOpen(false);
        fetchGuides();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Guide
  const handleDeleteGuide = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/beginner-guides/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('Beginner Guide deleted successfully.');
        setDeleteId(null);
        fetchGuides();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <div style={{ fontSize: '14px', color: '#DE1B59', fontWeight: 600 }}>Loading CMS Console...</div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !isAuthorized) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", padding: '20px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #FCA5A5', borderRadius: '20px', padding: '36px', maxWidth: '440px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', letterSpacing: '1px', marginBottom: '8px' }}>
            ACCESS DENIED (403 FORBIDDEN)
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>
            CMS Authorization Required
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 24px', lineHeight: 1.5 }}>
            Only users with <strong>EDITOR</strong> or <strong>ADMIN</strong> roles can manage content. Your current role is <strong>{userRole}</strong>.
          </p>
          <Link
            href="/admin/login"
            style={{ display: 'inline-block', background: '#DE1B59', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}
          >
            Return to Console Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", display: 'flex' }}>
      {/* LEFT SIDEBAR */}
      <aside
        style={{
          width: '240px',
          background: '#FFFFFF',
          borderRight: '1px solid #EAEAEA',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div>
          {/* Logo Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', marginBottom: '28px' }}>
            <span style={{ fontFamily: "'Tiro Devanagari Hindi', Georgia, serif", fontSize: '26px', fontWeight: 900, color: '#DE1B59' }}>
              तप
            </span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>The Tapa Co.</div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.5px' }}>CMS CONSOLE</div>
            </div>
          </div>

          {/* User Account Banner */}
          <div style={{ paddingLeft: '8px', paddingRight: '8px', marginBottom: '24px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.8px', marginBottom: '4px' }}>
              LOGGED IN AS
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userEmail}
            </div>
            <div style={{ marginTop: '4px' }}>
              <span style={{ background: '#FDF2F5', color: '#DE1B59', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>
                SUPER_ADMIN
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Link
              href="/admin/dashboard"
              style={{
                color: '#4B5563',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>🩼</span> Dashboard
            </Link>

            <Link
              href="/admin/dashboard/ritual-guides"
              style={{
                color: '#4B5563',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>📖</span> Ritual Guides
            </Link>

            <Link
              href="/admin/dashboard/dharmic-concepts"
              style={{
                color: '#4B5563',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>🧭</span> Dharmic Concepts
            </Link>

            <Link
              href="/admin/dashboard/beginner-guides"
              style={{
                background: '#DE1B59',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>🌱</span> Beginner Guides
            </Link>

            <Link
              href="/admin/dashboard/panchang"
              style={{
                color: '#4B5563',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>📅</span> Panchang &amp; Vrats
            </Link>

            <Link
              href="/admin/dashboard/user-directory"
              style={{
                color: '#4B5563',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>👥</span> User Directory
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            style={{
              width: '100%',
              background: '#FFFFFF',
              color: '#DE1B59',
              border: '1px solid #DE1B59',
              borderRadius: '9999px',
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            ↳ Sign Out
          </button>
          <div style={{ fontSize: '10px', color: '#9CA3AF', textAlign: 'center' }}>
            Legal Entity: Tale Scale Networks
          </div>
        </div>
      </aside>

      {/* MAIN CMS CONTENT */}
      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif", fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Beginner Guides
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
              Create and manage introductory guides, maps, and foundational primers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={openCreateModal}
              style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(222, 27, 89, 0.2)' }}
            >
              + New Beginner Guide
            </button>
          </div>
        </div>

        {/* SUCCESS NOTIFICATION */}
        {successMessage && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '20px' }}>
            ✓ {successMessage}
          </div>
        )}

        {/* SEARCH & FILTER CONTROLS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search beginner guides by title or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#374151', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
            >
              <option value="ALL">All Categories</option>
              <option value="Itihasa">Itihasa</option>
              <option value="Puranas">Puranas</option>
              <option value="Veda">Veda</option>
              <option value="Upanishad">Upanishad</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#374151', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="DRAFT">DRAFT</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        {/* GUIDES LISTING TABLE CARD */}
        {loading ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
            Loading Beginner Guides...
          </div>
        ) : guides.length === 0 ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>No Beginner Guides Found</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>Create your first beginner guide entry.</p>
            <button
              type="button"
              onClick={openCreateModal}
              style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              + Create Beginner Guide
            </button>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEAE4', color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>TITLE</th>
                  <th style={{ padding: '14px 20px' }}>CATEGORY</th>
                  <th style={{ padding: '14px 20px' }}>STATUS</th>
                  <th style={{ padding: '14px 20px' }}>LAST UPDATED</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {guides.map((guide) => (
                  <tr key={guide.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px', fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif" }}>
                        {guide.bannerTitle || guide.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px', fontFamily: 'monospace' }}>/{guide.slug}</div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#4B5563', fontSize: '13px' }}>
                      {guide.category || 'General'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {guide.status === 'PUBLISHED' ? (
                        <span style={{ background: '#E6F4EA', color: '#137333', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          ✓ PUBLISHED
                        </span>
                      ) : (
                        <span style={{ background: '#FEF7E0', color: '#B06000', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          ○ DRAFT
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6B7280', fontSize: '12px' }}>
                      {new Date(guide.updatedAt).toLocaleDateString('en-GB')}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(guide)}
                          style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #D1D5DB', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          ✏ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(guide.id)}
                          style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* CREATE / EDIT FORM MODAL WITH CLEAN HORIZONTAL UNDERLINE TABS */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #EFEAE4' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.8px', display: 'block', marginBottom: '2px' }}>
                  BEGINNER GUIDES CMS
                </span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  {editingId ? 'Edit Beginner Guide' : 'Create New Beginner Guide'}
                </h2>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#F3F4F6', color: '#6B7280', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
                ✕
              </button>
            </div>

            {/* CLEAN HORIZONTAL UNDERLINE TAB NAVIGATION STRIP */}
            <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #E5E7EB', marginBottom: '24px', overflowX: 'auto' }}>
              <button
                type="button"
                onClick={() => setActiveTab('banner')}
                style={{
                  background: 'transparent',
                  color: activeTab === 'banner' ? '#DE1B59' : '#4B5563',
                  border: 'none',
                  borderBottom: activeTab === 'banner' ? '3px solid #DE1B59' : '3px solid transparent',
                  borderRadius: '0',
                  padding: '10px 4px 12px 4px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'banner' ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                1. Banner
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('intro')}
                style={{
                  background: 'transparent',
                  color: activeTab === 'intro' ? '#DE1B59' : '#4B5563',
                  border: 'none',
                  borderBottom: activeTab === 'intro' ? '3px solid #DE1B59' : '3px solid transparent',
                  borderRadius: '0',
                  padding: '10px 4px 12px 4px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'intro' ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                2. Intro
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('why')}
                style={{
                  background: 'transparent',
                  color: activeTab === 'why' ? '#DE1B59' : '#4B5563',
                  border: 'none',
                  borderBottom: activeTab === 'why' ? '3px solid #DE1B59' : '3px solid transparent',
                  borderRadius: '0',
                  padding: '10px 4px 12px 4px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'why' ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                3. Why / The Seven Kandas
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('where-to-start')}
                style={{
                  background: 'transparent',
                  color: activeTab === 'where-to-start' ? '#DE1B59' : '#4B5563',
                  border: 'none',
                  borderBottom: activeTab === 'where-to-start' ? '3px solid #DE1B59' : '3px solid transparent',
                  borderRadius: '0',
                  padding: '10px 4px 12px 4px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'where-to-start' ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                4. Where to Start
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('common-worries')}
                style={{
                  background: 'transparent',
                  color: activeTab === 'common-worries' ? '#DE1B59' : '#4B5563',
                  border: 'none',
                  borderBottom: activeTab === 'common-worries' ? '3px solid #DE1B59' : '3px solid transparent',
                  borderRadius: '0',
                  padding: '10px 4px 12px 4px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'common-worries' ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                5. Common Worries
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('what-to-read-next')}
                style={{
                  background: 'transparent',
                  color: activeTab === 'what-to-read-next' ? '#DE1B59' : '#4B5563',
                  border: 'none',
                  borderBottom: activeTab === 'what-to-read-next' ? '3px solid #DE1B59' : '3px solid transparent',
                  borderRadius: '0',
                  padding: '10px 4px 12px 4px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'what-to-read-next' ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                6. What to Read Next
              </button>
            </div>

            {formError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveGuide}>
              {/* TAB 1: BANNER SECTION */}
              {activeTab === 'banner' && (
                <div style={{ background: '#FFFDF5', border: '1px solid #F3E8D2', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EFE0B8' }}>
                    <span style={{ fontSize: '18px' }}>🚩</span>
                    <div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        Beginner Guide — Banner
                      </h3>
                      <div style={{ fontSize: '11px', color: '#8A7A68' }}>
                        Configure hero banner eyebrow, badge, icon, main title, rich description, CTAs, and share button.
                      </div>
                    </div>
                  </div>

                  {/* 1. EYEBROW & CATEGORY */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Eyebrow *</label>
                      <input
                        type="text"
                        placeholder="BEGINNER'S GUIDES · START HERE"
                        value={formData.bannerEyebrow}
                        onChange={(e) => setFormData({ ...formData, bannerEyebrow: e.target.value })}
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#374151', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                      >
                        <option value="Itihasa">Itihasa</option>
                        <option value="Puranas">Puranas</option>
                        <option value="Veda">Veda</option>
                        <option value="Upanishad">Upanishad</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  {/* 2. BADGE TEXT & BADGE ICON */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Badge Text *</label>
                      <input
                        type="text"
                        placeholder="A MAP BEFORE THE JOURNEY"
                        value={formData.bannerBadgeText}
                        onChange={(e) => setFormData({ ...formData, bannerBadgeText: e.target.value })}
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Badge Icon</label>
                      <select
                        value={formData.bannerBadgeIcon}
                        onChange={(e) => setFormData({ ...formData, bannerBadgeIcon: e.target.value })}
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#374151', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                      >
                        <option value="🗺️ Map / Compass">🗺️ Map / Compass</option>
                        <option value="📖 Book / Scripture">📖 Book / Scripture</option>
                        <option value="✨ Star / Blessing">✨ Star / Blessing</option>
                        <option value="🚩 Flag / Banner">🚩 Flag / Banner</option>
                        <option value="🩼 Guide / Anchor">🩼 Guide / Anchor</option>
                      </select>
                    </div>
                  </div>

                  {/* 3. MAIN TITLE */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Title *</label>
                    <input
                      type="text"
                      placeholder="Ramcharitmanas: The Seven Kandas Explained"
                      value={formData.bannerTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, bannerTitle: val, title: val });
                        if (!editingId) {
                          handleTitleChange(val);
                        }
                      }}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  {/* 4. SUBTITLE / DESCRIPTION (RICH TEXT EDITOR) */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Description * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.bannerDescription}
                      onChange={(html) => setFormData({ ...formData, bannerDescription: html })}
                      placeholder="What each section contains, why each matters, and where Sundarkand fits."
                      minHeight="110px"
                    />
                  </div>

                  {/* 5. PRIMARY CTA */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#A07800', letterSpacing: '0.6px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                      PRIMARY CTA
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>CTA Text *</label>
                        <input
                          type="text"
                          placeholder="See the seven kandas"
                          value={formData.bannerPrimaryCtaText}
                          onChange={(e) => setFormData({ ...formData, bannerPrimaryCtaText: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>CTA Action</label>
                        <select
                          value={formData.bannerPrimaryCtaAction}
                          onChange={(e) => setFormData({ ...formData, bannerPrimaryCtaAction: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#374151', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                        >
                          <option value="Section Anchor">Section Anchor</option>
                          <option value="Internal Page">Internal Page</option>
                          <option value="External URL">External URL</option>
                          <option value="Custom Action">Custom Action</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>CTA Target *</label>
                        <input
                          type="text"
                          placeholder="#kandas"
                          value={formData.bannerPrimaryCtaTarget}
                          onChange={(e) => setFormData({ ...formData, bannerPrimaryCtaTarget: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. SECONDARY CTA */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#A07800', letterSpacing: '0.6px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                      SECONDARY CTA
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>CTA Text *</label>
                        <input
                          type="text"
                          placeholder="Save this"
                          value={formData.bannerSecondaryCtaText}
                          onChange={(e) => setFormData({ ...formData, bannerSecondaryCtaText: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>CTA Action</label>
                        <select
                          value={formData.bannerSecondaryCtaAction}
                          onChange={(e) => setFormData({ ...formData, bannerSecondaryCtaAction: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#374151', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                        >
                          <option value="Custom Action">Custom Action</option>
                          <option value="Section Anchor">Section Anchor</option>
                          <option value="Internal Page">Internal Page</option>
                          <option value="External URL">External URL</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>CTA Target</label>
                        <input
                          type="text"
                          placeholder="Action target URL or leave empty"
                          value={formData.bannerSecondaryCtaTarget}
                          onChange={(e) => setFormData({ ...formData, bannerSecondaryCtaTarget: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 7. SHARE BUTTON SETTINGS */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '14px', padding: '18px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#A07800', letterSpacing: '0.6px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                      SHARE BUTTON
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={formData.bannerShareEnabled}
                            onChange={(e) => setFormData({ ...formData, bannerShareEnabled: e.target.checked })}
                            style={{ width: '16px', height: '16px', accentColor: '#DE1B59', cursor: 'pointer' }}
                          />
                          Show Share Button
                        </label>
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', paddingLeft: '24px' }}>
                          Controls visibility of the top-right share button.
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Share Button Text *</label>
                        <input
                          type="text"
                          placeholder="Share"
                          value={formData.bannerShareButtonText}
                          onChange={(e) => setFormData({ ...formData, bannerShareButtonText: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INTRO SECTION */}
              {activeTab === 'intro' && (
                <div style={{ background: '#FFFDF5', border: '1px solid #F3E8D2', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EFE0B8' }}>
                    <span style={{ fontSize: '18px' }}>🗺️</span>
                    <div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        Beginner Guide — Intro
                      </h3>
                      <div style={{ fontSize: '11px', color: '#8A7A68' }}>
                        Configure introductory heading, multi-paragraph rich text description, feature image, alt text, and rich caption.
                      </div>
                    </div>
                  </div>

                  {/* 1. INTRO HEADING */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Intro Heading *</label>
                    <input
                      type="text"
                      placeholder="The map before the journey."
                      value={formData.introHeading}
                      onChange={(e) => setFormData({ ...formData, introHeading: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  {/* 2. INTRO DESCRIPTION (RICH TEXT EDITOR) */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Intro Description * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.introDescription}
                      onChange={(html) => setFormData({ ...formData, introDescription: html })}
                      placeholder="The Ramcharitmanas is Tulsidas's retelling of the Ramayana in Awadhi..."
                      minHeight="140px"
                    />
                  </div>

                  {/* 3. INTRO FEATURE IMAGE */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#A07800', letterSpacing: '0.6px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                      FEATURE IMAGE
                    </h4>

                    {formData.introImage && (
                      <div style={{ marginBottom: '12px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E5E7EB', maxHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
                        <img
                          src={formData.introImage}
                          alt={formData.introImageAltText || 'Intro image preview'}
                          style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Intro Image URL *</label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={formData.introImage}
                          onChange={(e) => setFormData({ ...formData, introImage: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newUrl = prompt('Enter image URL or asset link:', formData.introImage);
                          if (newUrl) setFormData({ ...formData, introImage: newUrl });
                        }}
                        style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '18px' }}
                      >
                        🖼 Replace Image
                      </button>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Intro Image Alt Text *</label>
                      <input
                        type="text"
                        placeholder="Seven Ramcharitmanas books representing the seven kandas, with Sundarkand as the fifth."
                        value={formData.introImageAltText}
                        onChange={(e) => setFormData({ ...formData, introImageAltText: e.target.value })}
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* 4. IMAGE CAPTION (RICH TEXT EDITOR) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Intro Image Caption * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.introImageCaption}
                      onChange={(html) => setFormData({ ...formData, introImageCaption: html })}
                      placeholder="Seven books. One story. Sundarkand is the fifth."
                      minHeight="90px"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: WHY / THE SEVEN KANDAS SECTION */}
              {activeTab === 'why' && (
                <div style={{ background: '#FFFDF5', border: '1px solid #F3E8D2', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EFE0B8' }}>
                    <span style={{ fontSize: '18px' }}>📜</span>
                    <div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        Why / The Seven Kandas
                      </h3>
                      <div style={{ fontSize: '11px', color: '#8A7A68' }}>
                        Manage section heading, rich subtitle, and the repeatable seven Kandas list.
                      </div>
                    </div>
                  </div>

                  {/* 1. SECTION HEADING */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Section Heading *</label>
                    <input
                      type="text"
                      placeholder="The seven kandas"
                      value={formData.whySectionHeading}
                      onChange={(e) => setFormData({ ...formData, whySectionHeading: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  {/* 2. SECTION SUBTITLE (RICH TEXT EDITOR) */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Section Subtitle * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.whySectionSubtitle}
                      onChange={(html) => setFormData({ ...formData, whySectionSubtitle: html })}
                      placeholder="In order. Sundarkand is the fifth."
                      minHeight="90px"
                    />
                  </div>

                  {/* 3. REPEATABLE KANDAS LIST */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          Kanda Entries ({formData.kandasItems.length})
                        </h4>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          Add, edit, reorder, or delete Kandas. Unlimited entries supported.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addKandaItem}
                        style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        + Add Kanda
                      </button>
                    </div>

                    {formData.kandasItems.map((kanda, kIdx) => (
                      <div
                        key={kanda.id}
                        style={{
                          background: '#FBF9F5',
                          border: '1px solid #EFEAE4',
                          borderRadius: '14px',
                          padding: '18px',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #EAE5DC' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.5px' }}>
                              KANDA #{kanda.kandaNumber}: {kanda.englishName || 'Untitled'} ({kanda.sanskritName || ''})
                            </span>
                            {kanda.mostRecited && (
                              <span style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                                ★ MOST RECITED
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => moveKandaItem(kIdx, 'up')}
                              disabled={kIdx === 0}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: kIdx === 0 ? 'not-allowed' : 'pointer' }}
                            >
                              ▲ Up
                            </button>
                            <button
                              type="button"
                              onClick={() => moveKandaItem(kIdx, 'down')}
                              disabled={kIdx === formData.kandasItems.length - 1}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: kIdx === formData.kandasItems.length - 1 ? 'not-allowed' : 'pointer' }}
                            >
                              ▼ Down
                            </button>
                            <button
                              type="button"
                              onClick={() => removeKandaItem(kanda.id)}
                              style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Number *</label>
                            <input
                              type="number"
                              value={kanda.kandaNumber}
                              onChange={(e) => updateKandaItem(kanda.id, 'kandaNumber', parseInt(e.target.value) || (kIdx + 1))}
                              style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>English Name *</label>
                            <input
                              type="text"
                              placeholder="Sundarkand"
                              value={kanda.englishName}
                              onChange={(e) => updateKandaItem(kanda.id, 'englishName', e.target.value)}
                              style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Sanskrit / Hindi Name *</label>
                            <input
                              type="text"
                              placeholder="सुन्दरकाण्ड"
                              value={kanda.sanskritName}
                              onChange={(e) => updateKandaItem(kanda.id, 'sanskritName', e.target.value)}
                              style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', fontFamily: "'Tiro Devanagari Hindi', Georgia, serif", boxSizing: 'border-box', outline: 'none' }}
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                            Description * (Rich Text Editor)
                          </label>
                          <RichTextEditor
                            value={kanda.description}
                            onChange={(html) => updateKandaItem(kanda.id, 'description', html)}
                            placeholder="Hanuman alone. The leap to Lanka, the search, finding Sita..."
                            minHeight="90px"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={kanda.mostRecited}
                              onChange={(e) => updateKandaItem(kanda.id, 'mostRecited', e.target.checked)}
                              style={{ width: '16px', height: '16px', accentColor: '#DE1B59', cursor: 'pointer' }}
                            />
                            Most Recited (Displays special badge for this Kanda)
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: WHERE TO START SECTION */}
              {activeTab === 'where-to-start' && (
                <div style={{ background: '#FFFDF5', border: '1px solid #F3E8D2', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EFE0B8' }}>
                    <span style={{ fontSize: '18px' }}>🎯</span>
                    <div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        Why — Where to Start
                      </h3>
                      <div style={{ fontSize: '11px', color: '#8A7A68' }}>
                        Configure rationale for reciting Sundarkand, highlighted callout statement, supporting details, and where-to-start recommendations.
                      </div>
                    </div>
                  </div>

                  {/* 1. SECTION HEADING */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Section Heading *</label>
                    <input
                      type="text"
                      placeholder="Why Sundarkand is the one people recite"
                      value={formData.whereToStartHeading}
                      onChange={(e) => setFormData({ ...formData, whereToStartHeading: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  {/* 2. INTRODUCTION (RICH TEXT EDITOR) */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Introduction * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.whereToStartIntro}
                      onChange={(html) => setFormData({ ...formData, whereToStartIntro: html })}
                      placeholder="Every other kanda is about Ram. Sundarkand is about a devotee..."
                      minHeight="110px"
                    />
                  </div>

                  {/* 3. HIGHLIGHTED STATEMENT (RICH TEXT EDITOR) */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#DE1B59', marginBottom: '6px' }}>
                      Highlighted Statement * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.whereToStartHighlight}
                      onChange={(html) => setFormData({ ...formData, whereToStartHighlight: html })}
                      placeholder="It is also the only kanda that ends entirely in success. Nothing is lost in it."
                      minHeight="90px"
                    />
                  </div>

                  {/* 4. SUPPORTING DESCRIPTION (RICH TEXT EDITOR) */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Supporting Description * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.whereToStartSupporting}
                      onChange={(html) => setFormData({ ...formData, whereToStartSupporting: html })}
                      placeholder="The exile is not reversed, the war has not started..."
                      minHeight="110px"
                    />
                  </div>

                  {/* SUBSECTION: WHERE TO START */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#A07800', letterSpacing: '0.6px', textTransform: 'uppercase', margin: '0 0 16px' }}>
                      WHERE TO START SUBSECTION
                    </h4>

                    {/* 5. WHERE TO START HEADING */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Where to Start Heading *</label>
                      <input
                        type="text"
                        placeholder="Where to start"
                        value={formData.whereToStartSubHeading}
                        onChange={(e) => setFormData({ ...formData, whereToStartSubHeading: e.target.value })}
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>

                    {/* 6. WHERE TO START INTRODUCTION (RICH TEXT EDITOR) */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        Where to Start Introduction * (Rich Text Editor)
                      </label>
                      <RichTextEditor
                        value={formData.whereToStartSubIntro}
                        onChange={(html) => setFormData({ ...formData, whereToStartSubIntro: html })}
                        placeholder="You do not need to read the first four kandas before Sundarkand..."
                        minHeight="100px"
                      />
                    </div>

                    {/* 7. WHERE TO START DESCRIPTION (RICH TEXT EDITOR) */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        Where to Start Description * (Rich Text Editor)
                      </label>
                      <RichTextEditor
                        value={formData.whereToStartFinalDescription}
                        onChange={(html) => setFormData({ ...formData, whereToStartFinalDescription: html })}
                        placeholder="If you want the story in order, start at Bala Kanda and read at your own pace..."
                        minHeight="100px"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: COMMON WORRIES SECTION */}
              {activeTab === 'common-worries' && (
                <div style={{ background: '#FFFDF5', border: '1px solid #F3E8D2', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EFE0B8' }}>
                    <span style={{ fontSize: '18px' }}>❓</span>
                    <div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        Why — Common Worries — Answered
                      </h3>
                      <div style={{ fontSize: '11px', color: '#8A7A68' }}>
                        Configure section heading, rich subtitle, repeatable Q&A worries list, and dark closing content block.
                      </div>
                    </div>
                  </div>

                  {/* 1. SECTION HEADING */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Section Heading *</label>
                    <input
                      type="text"
                      placeholder="Common worries — answered"
                      value={formData.commonWorriesHeading}
                      onChange={(e) => setFormData({ ...formData, commonWorriesHeading: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  {/* 2. SECTION SUBTITLE (RICH TEXT EDITOR) */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Section Subtitle * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.commonWorriesSubtitle}
                      onChange={(html) => setFormData({ ...formData, commonWorriesSubtitle: html })}
                      placeholder="Every one of these has been asked by someone opening the book for the first time."
                      minHeight="90px"
                    />
                  </div>

                  {/* 3. REPEATABLE COMMON WORRIES LIST */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          Common Worries Items ({formData.worriesItems.length})
                        </h4>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          Add, edit, reorder, or delete common questions and answers.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addWorryItem}
                        style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        + Add Worry
                      </button>
                    </div>

                    {formData.worriesItems.map((worry, wIdx) => (
                      <div
                        key={worry.id}
                        style={{
                          background: '#FBF9F5',
                          border: '1px solid #EFEAE4',
                          borderRadius: '14px',
                          padding: '18px',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #EAE5DC' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.5px' }}>
                            WORRY ITEM #{wIdx + 1}
                          </span>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => moveWorryItem(wIdx, 'up')}
                              disabled={wIdx === 0}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: wIdx === 0 ? 'not-allowed' : 'pointer' }}
                            >
                              ▲ Up
                            </button>
                            <button
                              type="button"
                              onClick={() => moveWorryItem(wIdx, 'down')}
                              disabled={wIdx === formData.worriesItems.length - 1}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: wIdx === formData.worriesItems.length - 1 ? 'not-allowed' : 'pointer' }}
                            >
                              ▼ Down
                            </button>
                            <button
                              type="button"
                              onClick={() => removeWorryItem(worry.id)}
                              style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              🗑 Delete Worry
                            </button>
                          </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Question *</label>
                          <input
                            type="text"
                            placeholder='"Should I read the whole thing first?"'
                            value={worry.question}
                            onChange={(e) => updateWorryItem(worry.id, 'question', e.target.value)}
                            style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                            Answer * (Rich Text Editor)
                          </label>
                          <RichTextEditor
                            value={worry.answer}
                            onChange={(html) => updateWorryItem(worry.id, 'answer', html)}
                            placeholder="No. Starting at Sundarkand is the normal way in..."
                            minHeight="90px"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 4. CLOSING CONTENT (RICH TEXT EDITOR) */}
                  <div style={{ background: '#111827', color: '#FFFFFF', borderRadius: '16px', padding: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#F3F4F6', marginBottom: '8px' }}>
                      Closing Content * (Rich Text Editor - Dark Block on Frontend)
                    </label>
                    <RichTextEditor
                      value={formData.commonWorriesClosing}
                      onChange={(html) => setFormData({ ...formData, commonWorriesClosing: html })}
                      placeholder="Seven books, one story, and no obligation to read them in order..."
                      minHeight="110px"
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: WHAT TO READ NEXT SECTION */}
              {activeTab === 'what-to-read-next' && (
                <div style={{ background: '#FFFDF5', border: '1px solid #F3E8D2', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EFE0B8' }}>
                    <span style={{ fontSize: '18px' }}>📚</span>
                    <div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        Why — What to Read Next
                      </h3>
                      <div style={{ fontSize: '11px', color: '#8A7A68' }}>
                        Configure section heading, rich subtitle, and repeatable related content items.
                      </div>
                    </div>
                  </div>

                  {/* 1. SECTION HEADING */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Section Heading *</label>
                    <input
                      type="text"
                      placeholder="What to read next"
                      value={formData.whatToReadNextHeading}
                      onChange={(e) => setFormData({ ...formData, whatToReadNextHeading: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  {/* 2. SECTION SUBTITLE (RICH TEXT EDITOR) */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Section Subtitle * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.whatToReadNextSubtitle}
                      onChange={(html) => setFormData({ ...formData, whatToReadNextSubtitle: html })}
                      placeholder="When you want the practice, or the detail."
                      minHeight="90px"
                    />
                  </div>

                  {/* 3. REPEATABLE RELATED CONTENT LIST */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          Related Content Items ({formData.relatedItems.length})
                        </h4>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          Add, edit, reorder, or delete related reading recommendations.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addRelatedItem}
                        style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        + Add Related Content
                      </button>
                    </div>

                    {formData.relatedItems.map((item, rIdx) => (
                      <div
                        key={item.id}
                        style={{
                          background: '#FBF9F5',
                          border: '1px solid #EFEAE4',
                          borderRadius: '14px',
                          padding: '18px',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #EAE5DC' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.5px' }}>
                            RELATED ITEM #{rIdx + 1}: {item.title || 'Untitled'} ({item.contentType})
                          </span>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => moveRelatedItem(rIdx, 'up')}
                              disabled={rIdx === 0}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: rIdx === 0 ? 'not-allowed' : 'pointer' }}
                            >
                              ▲ Up
                            </button>
                            <button
                              type="button"
                              onClick={() => moveRelatedItem(rIdx, 'down')}
                              disabled={rIdx === formData.relatedItems.length - 1}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: rIdx === formData.relatedItems.length - 1 ? 'not-allowed' : 'pointer' }}
                            >
                              ▼ Down
                            </button>
                            <button
                              type="button"
                              onClick={() => removeRelatedItem(item.id)}
                              style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Content Type *</label>
                            <select
                              value={item.contentType}
                              onChange={(e) => updateRelatedItem(item.id, 'contentType', e.target.value as any)}
                              style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#374151', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                            >
                              <option value="Ritual Guide">Ritual Guide</option>
                              <option value="Concept">Concept</option>
                              <option value="Dates">Dates</option>
                              <option value="Beginner Guide">Beginner Guide</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Title *</label>
                            <input
                              type="text"
                              placeholder="Sundarkand Path — complete home vidhi"
                              value={item.title}
                              onChange={(e) => updateRelatedItem(item.id, 'title', e.target.value)}
                              style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                            Description * (Rich Text Editor)
                          </label>
                          <RichTextEditor
                            value={item.description}
                            onChange={(html) => updateRelatedItem(item.id, 'description', html)}
                            placeholder="How the recitation is performed at home, start to finish..."
                            minHeight="90px"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Target / Link (Optional)</label>
                          <input
                            type="text"
                            placeholder="/guides/sundarkand-path-complete-home-vidhi"
                            value={item.target || ''}
                            onChange={(e) => updateRelatedItem(item.id, 'target', e.target.value)}
                            style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace', boxSizing: 'border-box', outline: 'none' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SYSTEM METADATA FIELDS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Slug</label>
                  <input
                    type="text"
                    placeholder="ramcharitmanas-seven-kandas-explained"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'monospace', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#374151', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  >
                    <option value="PUBLISHED">PUBLISHED (Visible)</option>
                    <option value="DRAFT">DRAFT (Unpublished)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #D1D5DB', padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: formLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(222, 27, 89, 0.25)' }}
                >
                  {formLoading ? 'Saving...' : editingId ? 'Update Beginner Guide' : 'Publish Beginner Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '400px', padding: '28px', textAlign: 'center', border: '1px solid #EFEAE4' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#DC2626', margin: '0 0 8px' }}>Confirm Deletion</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px', lineHeight: 1.4 }}>
              Are you sure you want to delete this beginner guide? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #D1D5DB', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteGuide(deleteId)}
                style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BeginnerGuidesCmsPage() {
  return (
    <SessionProvider>
      <BeginnerGuidesCmsContent />
    </SessionProvider>
  );
}
