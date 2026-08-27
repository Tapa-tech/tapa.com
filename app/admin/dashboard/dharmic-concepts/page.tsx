'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

interface StoryItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  image?: string;
  imageAltText?: string;
  imageCaption?: string;
  displayOrder: number;
}

interface GalleryItem {
  id: string;
  image: string;
  altText?: string;
  caption?: string;
  displayOrder: number;
}

interface MythItem {
  id: string;
  mythStatement: string;
  correctionLabel: string;
  correctionContent: string;
  displayOrder: number;
}

interface RelatedItem {
  id: string;
  title: string;
  description?: string;
  link: string;
  displayOrder: number;
}

interface DharmicConcept {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary?: string | null;
  body: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

  // Banner Section
  bannerEyebrow?: string | null;
  bannerRating?: string | null;
  bannerClassification?: string | null;
  bannerTitle?: string | null;
  bannerDescription?: string | null;
  bannerPrimaryCtaText?: string | null;
  bannerPrimaryCtaLink?: string | null;
  bannerSecondaryCtaText?: string | null;
  bannerSecondaryCtaLink?: string | null;
  bannerShareButtonText?: string | null;

  // Three Stories Section
  threeStoriesTitle?: string | null;
  threeStoriesIntro?: string | null;
  threeStoriesSupportingText?: string | null;
  storiesItemsJson?: string | null;
  threeStoriesGalleryJson?: string | null;
  threeStoriesCaption?: string | null;

  // What They Share Section
  shareSectionHeading?: string | null;
  shareSharedContent?: string | null;
  shareNotSharedContent?: string | null;
  shareHighlightStatement?: string | null;
  shareSupportingDescription?: string | null;
  shareTraditionTag?: string | null;

  // Myths & Facts Section
  mythsSectionHeading?: string | null;
  mythsItemsJson?: string | null;
  reframeLabel?: string | null;
  reframeContent?: string | null;

  // Related Section
  relatedRitualGuidesJson?: string | null;
  relatedPujansJson?: string | null;
  relatedConceptsJson?: string | null;
  relatedDatesJson?: string | null;

  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
  } | null;
}

// Simple Rich Text Editor Component
function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = '140px',
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
  bannerEyebrow: 'DHARMIC CONCEPTS · MEANINGS & PRACTICES',
  category: 'DHARMA',
  bannerRating: '4/5',
  bannerClassification: 'PURANIC',
  bannerTitle: 'Three Stories, One Thread',
  bannerDescription: 'Wife, friend, devotee — three relationships, one act of protection. Not one of them is a sister and a brother.',
  bannerPrimaryCtaText: 'Read the three stories',
  bannerPrimaryCtaLink: '',
  bannerSecondaryCtaText: 'Save this',
  bannerSecondaryCtaLink: '',
  bannerShareButtonText: 'Share',
};

const DEFAULT_STORIES_DEMO: StoryItem[] = [
  {
    id: 'story-1',
    title: 'Wife',
    description: 'A story of protection within a marriage, where the sacred thread represents a bond of care and protection.',
    content: 'In the Bhavishya Purana, Sachi (Indrani) prepared a sacred thread woven with protective mantras and tied it around Lord Indra\'s right wrist before he went to battle Vritrasura.',
    image: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
    imageAltText: 'Rakhi thread on traditional puja plate',
    imageCaption: 'Sachi tying the protective thread to Indra',
    displayOrder: 1,
  },
  {
    id: 'story-2',
    title: 'Friend',
    description: 'A story of friendship and protection, showing that the sacred thread can represent a bond beyond family relationships.',
    content: 'During the Rajasuya Yajna, Lord Krishna cut his finger. Draupadi immediately tore a strip from her silk sari to bind Krishna\'s wound, forging an eternal bond of protection.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    imageAltText: 'Sacred thread bound to a sword',
    imageCaption: 'Draupadi binding Krishna\'s hand in devotion',
    displayOrder: 2,
  },
  {
    id: 'story-3',
    title: 'Devotee',
    description: 'A story of devotion and protection, where the thread becomes a symbol of a sacred relationship.',
    content: 'Goddess Lakshmi tied a sacred thread to King Bali\'s wrist during Shravana Purnima, seeking Lord Vishnu\'s return to Vaikuntha as a gift of protection.',
    image: 'https://images.unsplash.com/photo-1621849400072-f58442787131?auto=format&fit=crop&w=800&q=80',
    imageAltText: 'Sacred thread resting on a lotus leaf',
    imageCaption: 'Lakshmi declaring King Bali as her brother in dharma',
    displayOrder: 3,
  },
];

const DEFAULT_GALLERY_DEMO: GalleryItem[] = [
  {
    id: 'gal-1',
    image: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
    altText: 'Traditional rakhi thread on golden plate',
    caption: 'Story 1: Thread of protection in marriage',
    displayOrder: 1,
  },
  {
    id: 'gal-2',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    altText: 'Sacred thread bound to warrior sword',
    caption: 'Story 2: Friendship and spiritual bond',
    displayOrder: 2,
  },
  {
    id: 'gal-3',
    image: 'https://images.unsplash.com/photo-1621849400072-f58442787131?auto=format&fit=crop&w=800&q=80',
    altText: 'Sacred thread on lotus leaf',
    caption: 'Story 3: Devotion and divine promise',
    displayOrder: 3,
  },
];

const DEFAULT_SHARE_DEMO = {
  shareSectionHeading: 'What the three share, and what they do not',
  shareSharedContent: '<b>Shared:</b> a thread, a moment of vulnerability, an act of protection that was returned.',
  shareNotSharedContent: '<b>Not shared:</b> the relationship. Wife, friend, devotee — three entirely different bonds.',
  shareHighlightStatement: 'The tradition did not restrict the raksha sutra to one kind of relationship, because protection is not restricted to one kind of relationship.',
  shareSupportingDescription: 'The sibling form is the fourth story. It is cultural, widespread and genuine, and it is the family\'s addition to the tradition rather than the tradition\'s founding act.',
  shareTraditionTag: 'PRATHA',
};

const DEFAULT_MYTHS_DEMO: MythItem[] = [
  {
    id: 'myth-1',
    mythStatement: '"All three stories are about siblings — this has always been about sisters and brothers."',
    correctionLabel: 'CORRECTION',
    correctionContent: 'Not one of the three founding narratives involves siblings. Wife and husband, friend and friend, devotee and king. The sibling reading is custom — culturally dominant, textually absent from the founding stories.',
    displayOrder: 1,
  },
  {
    id: 'myth-2',
    mythStatement: '"Draupadi tied a rakhi on Krishna, making him her brother."',
    correctionLabel: 'CORRECTION',
    correctionContent: 'The Mahabharata does not describe a sibling ceremony. Draupadi\'s act was spontaneous care, and Krishna\'s reciprocation was a promise between friends. The brother-and-sister reframing came later.',
    displayOrder: 2,
  },
];

const DEFAULT_REFRAME_DEMO = {
  reframeLabel: 'THE REFRAME',
  reframeContent: 'The tradition put a wife, a friend and a devotee side by side — not to rank them, but to show that the thread\'s power has nothing to do with who you are to each other.<br/><br/>It has to do with whether you mean it when you say: <b>I bind you with protection. Be steadfast. Do not falter.</b>',
};

const DEFAULT_RELATED_RITUAL_GUIDES_DEMO: RelatedItem[] = [
  {
    id: 'rel-rg-1',
    title: 'Raksha Bandhan',
    description: 'Where this thread is tied',
    link: '/ritual-guides/raksha-bandhan',
    displayOrder: 1,
  },
  {
    id: 'rel-rg-2',
    title: 'Parsva Ekadashi',
    description: 'The same Bali, named in the mantra',
    link: '/ritual-guides/parsva-ekadashi',
    displayOrder: 2,
  },
];

const DEFAULT_RELATED_PUJANS_DEMO: RelatedItem[] = [
  {
    id: 'rel-p-1',
    title: 'Satyanarayan Katha',
    description: 'Bookable · household observance',
    link: '/pujans/satyanarayan-katha',
    displayOrder: 1,
  },
];

const DEFAULT_RELATED_CONCEPTS_DEMO: RelatedItem[] = [
  {
    id: 'rel-c-1',
    title: 'Why is a thread tied?',
    description: 'The object itself — coming soon',
    link: '/dharmic-concepts/why-is-thread-tied',
    displayOrder: 1,
  },
  {
    id: 'rel-c-2',
    title: 'Three Teej, compared',
    description: 'The same comparison format',
    link: '/dharmic-concepts/three-teej-compared',
    displayOrder: 2,
  },
];

const DEFAULT_RELATED_DATES_DEMO: RelatedItem[] = [
  {
    id: 'rel-d-1',
    title: 'Shravana Purnima panchang',
    description: 'When the thread is tied',
    link: '/dates/shravana-purnima',
    displayOrder: 1,
  },
];

type ConceptFormTab = 'banner' | 'threeStories' | 'whatTheyShare' | 'mythsAndFacts' | 'related';

function DharmicConceptsCmsContent() {
  const { data: session, status } = useSession();

  // Data & Filtering States
  const [concepts, setConcepts] = useState<DharmicConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Active Tab State for Form Editor
  const [activeTab, setActiveTab] = useState<ConceptFormTab>('banner');

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: DEFAULT_BANNER_DEMO.bannerTitle,
    slug: 'three-stories-one-thread',
    category: DEFAULT_BANNER_DEMO.category,
    summary: DEFAULT_BANNER_DEMO.bannerDescription,
    body: 'The tradition\'s founding stories tell a different tale from the one most people know — three of them, from three texts, involving three completely different relationships.',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',

    // Banner Section Fields
    bannerEyebrow: DEFAULT_BANNER_DEMO.bannerEyebrow,
    bannerRating: DEFAULT_BANNER_DEMO.bannerRating,
    bannerClassification: DEFAULT_BANNER_DEMO.bannerClassification,
    bannerTitle: DEFAULT_BANNER_DEMO.bannerTitle,
    bannerDescription: DEFAULT_BANNER_DEMO.bannerDescription,
    bannerPrimaryCtaText: DEFAULT_BANNER_DEMO.bannerPrimaryCtaText,
    bannerPrimaryCtaLink: DEFAULT_BANNER_DEMO.bannerPrimaryCtaLink,
    bannerSecondaryCtaText: DEFAULT_BANNER_DEMO.bannerSecondaryCtaText,
    bannerSecondaryCtaLink: DEFAULT_BANNER_DEMO.bannerSecondaryCtaLink,
    bannerShareButtonText: DEFAULT_BANNER_DEMO.bannerShareButtonText,

    // Three Stories Section Fields
    threeStoriesTitle: 'Three stories',
    threeStoriesIntro: 'The tradition\'s founding stories tell a different tale from the one most people know — three of them, from three texts, involving three completely different relationships.',
    threeStoriesSupportingText: '<b>Not one is about a sister and a brother.</b> What they share is a thread, a mantra, and someone who needed protecting.',
    storiesItems: DEFAULT_STORIES_DEMO,
    threeStoriesGallery: DEFAULT_GALLERY_DEMO,
    threeStoriesCaption: 'Three stories. Three relationships. One thread.',

    // What They Share Section Fields
    shareSectionHeading: DEFAULT_SHARE_DEMO.shareSectionHeading,
    shareSharedContent: DEFAULT_SHARE_DEMO.shareSharedContent,
    shareNotSharedContent: DEFAULT_SHARE_DEMO.shareNotSharedContent,
    shareHighlightStatement: DEFAULT_SHARE_DEMO.shareHighlightStatement,
    shareSupportingDescription: DEFAULT_SHARE_DEMO.shareSupportingDescription,
    shareTraditionTag: DEFAULT_SHARE_DEMO.shareTraditionTag,

    // Myths & Facts Section Fields
    mythsSectionHeading: 'Myths & Facts',
    mythsItems: DEFAULT_MYTHS_DEMO,
    reframeLabel: DEFAULT_REFRAME_DEMO.reframeLabel,
    reframeContent: DEFAULT_REFRAME_DEMO.reframeContent,

    // Related Section Fields
    relatedRitualGuides: DEFAULT_RELATED_RITUAL_GUIDES_DEMO,
    relatedPujans: DEFAULT_RELATED_PUJANS_DEMO,
    relatedConcepts: DEFAULT_RELATED_CONCEPTS_DEMO,
    relatedDates: DEFAULT_RELATED_DATES_DEMO,
  });

  // Action Feedback States
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const userRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'USER';
  const isAuthorized = ['ADMIN', 'EDITOR', 'SUPER_ADMIN'].includes(userRole);
  const userEmail = session?.user?.email || (session?.user as any)?.phone || 'admin@tapa.co';

  // Fetch concepts from backend API
  const fetchConcepts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/dharmic-concepts?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setConcepts(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch concepts:', err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter]);

  useEffect(() => {
    if (status === 'authenticated' && isAuthorized) {
      fetchConcepts();
    }
  }, [status, isAuthorized, fetchConcepts]);

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

  // State Mutators for Repeatable Stories
  const addStoryItem = () => {
    const newStory: StoryItem = {
      id: 'story-' + Date.now(),
      title: 'New Story',
      description: 'Concise description of this protective relationship story.',
      content: '',
      image: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
      imageAltText: 'Dharmic story illustration',
      imageCaption: 'Story caption',
      displayOrder: formData.storiesItems.length + 1,
    };
    setFormData((prev) => ({
      ...prev,
      storiesItems: [...prev.storiesItems, newStory],
    }));
  };

  const updateStoryItem = (id: string, field: keyof StoryItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      storiesItems: prev.storiesItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeStoryItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      storiesItems: prev.storiesItems.filter((item) => item.id !== id),
    }));
  };

  const moveStoryItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.storiesItems.length) return;
    const updated = [...formData.storiesItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, storiesItems: updated }));
  };

  // State Mutators for Repeatable Gallery Images
  const addGalleryItem = () => {
    const newGal: GalleryItem = {
      id: 'gal-' + Date.now(),
      image: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
      altText: 'Gallery image',
      caption: 'Image caption',
      displayOrder: formData.threeStoriesGallery.length + 1,
    };
    setFormData((prev) => ({
      ...prev,
      threeStoriesGallery: [...prev.threeStoriesGallery, newGal],
    }));
  };

  const updateGalleryItem = (id: string, field: keyof GalleryItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      threeStoriesGallery: prev.threeStoriesGallery.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeGalleryItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      threeStoriesGallery: prev.threeStoriesGallery.filter((item) => item.id !== id),
    }));
  };

  const moveGalleryItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.threeStoriesGallery.length) return;
    const updated = [...formData.threeStoriesGallery];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, threeStoriesGallery: updated }));
  };

  // State Mutators for Repeatable Myth & Fact Items
  const addMythItem = () => {
    const newMyth: MythItem = {
      id: 'myth-' + Date.now(),
      mythStatement: '"Enter myth statement here..."',
      correctionLabel: 'CORRECTION',
      correctionContent: 'Enter textual correction and explanation here...',
      displayOrder: formData.mythsItems.length + 1,
    };
    setFormData((prev) => ({
      ...prev,
      mythsItems: [...prev.mythsItems, newMyth],
    }));
  };

  const updateMythItem = (id: string, field: keyof MythItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      mythsItems: prev.mythsItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeMythItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      mythsItems: prev.mythsItems.filter((item) => item.id !== id),
    }));
  };

  const moveMythItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.mythsItems.length) return;
    const updated = [...formData.mythsItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, mythsItems: updated }));
  };

  // Generic State Mutators for Related Items Groups
  type RelatedGroupKey = 'relatedRitualGuides' | 'relatedPujans' | 'relatedConcepts' | 'relatedDates';

  const addRelatedItem = (groupKey: RelatedGroupKey) => {
    const newItem: RelatedItem = {
      id: `${groupKey}-${Date.now()}`,
      title: 'New Related Item',
      description: 'Brief description...',
      link: '#',
      displayOrder: formData[groupKey].length + 1,
    };
    setFormData((prev) => ({
      ...prev,
      [groupKey]: [...prev[groupKey], newItem],
    }));
  };

  const updateRelatedItem = (groupKey: RelatedGroupKey, id: string, field: keyof RelatedItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [groupKey]: prev[groupKey].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeRelatedItem = (groupKey: RelatedGroupKey, id: string) => {
    setFormData((prev) => ({
      ...prev,
      [groupKey]: prev[groupKey].filter((item) => item.id !== id),
    }));
  };

  const moveRelatedItem = (groupKey: RelatedGroupKey, index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData[groupKey].length) return;
    const updated = [...formData[groupKey]];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, [groupKey]: updated }));
  };

  // Open modal for Create Mode with prefilled demo data
  const openCreateModal = () => {
    setEditingId(null);
    setActiveTab('banner');
    setFormData({
      title: DEFAULT_BANNER_DEMO.bannerTitle,
      slug: 'three-stories-one-thread',
      category: DEFAULT_BANNER_DEMO.category,
      summary: DEFAULT_BANNER_DEMO.bannerDescription,
      body: 'The tradition\'s founding stories tell a different tale from the one most people know — three of them, from three texts, involving three completely different relationships.',
      status: 'DRAFT',

      bannerEyebrow: DEFAULT_BANNER_DEMO.bannerEyebrow,
      bannerRating: DEFAULT_BANNER_DEMO.bannerRating,
      bannerClassification: DEFAULT_BANNER_DEMO.bannerClassification,
      bannerTitle: DEFAULT_BANNER_DEMO.bannerTitle,
      bannerDescription: DEFAULT_BANNER_DEMO.bannerDescription,
      bannerPrimaryCtaText: DEFAULT_BANNER_DEMO.bannerPrimaryCtaText,
      bannerPrimaryCtaLink: DEFAULT_BANNER_DEMO.bannerPrimaryCtaLink,
      bannerSecondaryCtaText: DEFAULT_BANNER_DEMO.bannerSecondaryCtaText,
      bannerSecondaryCtaLink: DEFAULT_BANNER_DEMO.bannerSecondaryCtaLink,
      bannerShareButtonText: DEFAULT_BANNER_DEMO.bannerShareButtonText,

      threeStoriesTitle: 'Three stories',
      threeStoriesIntro: 'The tradition\'s founding stories tell a different tale from the one most people know — three of them, from three texts, involving three completely different relationships.',
      threeStoriesSupportingText: '<b>Not one is about a sister and a brother.</b> What they share is a thread, a mantra, and someone who needed protecting.',
      storiesItems: DEFAULT_STORIES_DEMO,
      threeStoriesGallery: DEFAULT_GALLERY_DEMO,
      threeStoriesCaption: 'Three stories. Three relationships. One thread.',

      shareSectionHeading: DEFAULT_SHARE_DEMO.shareSectionHeading,
      shareSharedContent: DEFAULT_SHARE_DEMO.shareSharedContent,
      shareNotSharedContent: DEFAULT_SHARE_DEMO.shareNotSharedContent,
      shareHighlightStatement: DEFAULT_SHARE_DEMO.shareHighlightStatement,
      shareSupportingDescription: DEFAULT_SHARE_DEMO.shareSupportingDescription,
      shareTraditionTag: DEFAULT_SHARE_DEMO.shareTraditionTag,

      mythsSectionHeading: 'Myths & Facts',
      mythsItems: DEFAULT_MYTHS_DEMO,
      reframeLabel: DEFAULT_REFRAME_DEMO.reframeLabel,
      reframeContent: DEFAULT_REFRAME_DEMO.reframeContent,

      relatedRitualGuides: DEFAULT_RELATED_RITUAL_GUIDES_DEMO,
      relatedPujans: DEFAULT_RELATED_PUJANS_DEMO,
      relatedConcepts: DEFAULT_RELATED_CONCEPTS_DEMO,
      relatedDates: DEFAULT_RELATED_DATES_DEMO,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit Mode
  const openEditModal = (concept: DharmicConcept) => {
    setEditingId(concept.id);
    setActiveTab('banner');

    let parsedStories: StoryItem[] = DEFAULT_STORIES_DEMO;
    if (concept.storiesItemsJson) {
      try {
        parsedStories = JSON.parse(concept.storiesItemsJson);
      } catch (e) { }
    }

    let parsedGallery: GalleryItem[] = DEFAULT_GALLERY_DEMO;
    if (concept.threeStoriesGalleryJson) {
      try {
        parsedGallery = JSON.parse(concept.threeStoriesGalleryJson);
      } catch (e) { }
    }

    let parsedMyths: MythItem[] = DEFAULT_MYTHS_DEMO;
    if (concept.mythsItemsJson) {
      try {
        parsedMyths = JSON.parse(concept.mythsItemsJson);
      } catch (e) { }
    }

    let parsedRitualGuides: RelatedItem[] = DEFAULT_RELATED_RITUAL_GUIDES_DEMO;
    if (concept.relatedRitualGuidesJson) {
      try {
        parsedRitualGuides = JSON.parse(concept.relatedRitualGuidesJson);
      } catch (e) { }
    }

    let parsedPujans: RelatedItem[] = DEFAULT_RELATED_PUJANS_DEMO;
    if (concept.relatedPujansJson) {
      try {
        parsedPujans = JSON.parse(concept.relatedPujansJson);
      } catch (e) { }
    }

    let parsedConcepts: RelatedItem[] = DEFAULT_RELATED_CONCEPTS_DEMO;
    if (concept.relatedConceptsJson) {
      try {
        parsedConcepts = JSON.parse(concept.relatedConceptsJson);
      } catch (e) { }
    }

    let parsedDates: RelatedItem[] = DEFAULT_RELATED_DATES_DEMO;
    if (concept.relatedDatesJson) {
      try {
        parsedDates = JSON.parse(concept.relatedDatesJson);
      } catch (e) { }
    }

    setFormData({
      title: concept.title || DEFAULT_BANNER_DEMO.bannerTitle,
      slug: concept.slug,
      category: concept.category || DEFAULT_BANNER_DEMO.category,
      summary: concept.summary || DEFAULT_BANNER_DEMO.bannerDescription,
      body: concept.body || '',
      status: concept.status || 'DRAFT',

      bannerEyebrow: concept.bannerEyebrow ?? DEFAULT_BANNER_DEMO.bannerEyebrow,
      bannerRating: concept.bannerRating ?? DEFAULT_BANNER_DEMO.bannerRating,
      bannerClassification: concept.bannerClassification ?? DEFAULT_BANNER_DEMO.bannerClassification,
      bannerTitle: concept.bannerTitle ?? concept.title ?? DEFAULT_BANNER_DEMO.bannerTitle,
      bannerDescription: concept.bannerDescription ?? concept.summary ?? DEFAULT_BANNER_DEMO.bannerDescription,
      bannerPrimaryCtaText: concept.bannerPrimaryCtaText ?? DEFAULT_BANNER_DEMO.bannerPrimaryCtaText,
      bannerPrimaryCtaLink: concept.bannerPrimaryCtaLink ?? '',
      bannerSecondaryCtaText: concept.bannerSecondaryCtaText ?? DEFAULT_BANNER_DEMO.bannerSecondaryCtaText,
      bannerSecondaryCtaLink: concept.bannerSecondaryCtaLink ?? '',
      bannerShareButtonText: concept.bannerShareButtonText ?? DEFAULT_BANNER_DEMO.bannerShareButtonText,

      threeStoriesTitle: concept.threeStoriesTitle ?? 'Three stories',
      threeStoriesIntro: concept.threeStoriesIntro ?? 'The tradition\'s founding stories tell a different tale from the one most people know — three of them, from three texts, involving three completely different relationships.',
      threeStoriesSupportingText: concept.threeStoriesSupportingText ?? '<b>Not one is about a sister and a brother.</b> What they share is a thread, a mantra, and someone who needed protecting.',
      storiesItems: parsedStories,
      threeStoriesGallery: parsedGallery,
      threeStoriesCaption: concept.threeStoriesCaption ?? 'Three stories. Three relationships. One thread.',

      shareSectionHeading: concept.shareSectionHeading ?? DEFAULT_SHARE_DEMO.shareSectionHeading,
      shareSharedContent: concept.shareSharedContent ?? DEFAULT_SHARE_DEMO.shareSharedContent,
      shareNotSharedContent: concept.shareNotSharedContent ?? DEFAULT_SHARE_DEMO.shareNotSharedContent,
      shareHighlightStatement: concept.shareHighlightStatement ?? DEFAULT_SHARE_DEMO.shareHighlightStatement,
      shareSupportingDescription: concept.shareSupportingDescription ?? DEFAULT_SHARE_DEMO.shareSupportingDescription,
      shareTraditionTag: concept.shareTraditionTag ?? DEFAULT_SHARE_DEMO.shareTraditionTag,

      mythsSectionHeading: concept.mythsSectionHeading ?? 'Myths & Facts',
      mythsItems: parsedMyths,
      reframeLabel: concept.reframeLabel ?? DEFAULT_REFRAME_DEMO.reframeLabel,
      reframeContent: concept.reframeContent ?? DEFAULT_REFRAME_DEMO.reframeContent,

      relatedRitualGuides: parsedRitualGuides,
      relatedPujans: parsedPujans,
      relatedConcepts: parsedConcepts,
      relatedDates: parsedDates,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Save (Create or Update) Concept
  const handleSaveConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.bannerEyebrow.trim()) {
      setFormError('Banner Eyebrow is required.');
      return;
    }

    if (!formData.category.trim()) {
      setFormError('Category is required.');
      return;
    }

    if (!formData.bannerTitle.trim() && !formData.title.trim()) {
      setFormError('Concept Title is required.');
      return;
    }

    if (!formData.bannerDescription.trim()) {
      setFormError('Concept Description is required.');
      return;
    }

    if (!formData.threeStoriesTitle.trim()) {
      setFormError('Three Stories Title is required.');
      return;
    }

    if (!formData.threeStoriesIntro.trim()) {
      setFormError('Three Stories Introduction is required.');
      return;
    }

    if (!formData.shareSectionHeading.trim()) {
      setFormError('Section Heading for "What They Share" is required.');
      return;
    }

    if (!formData.mythsSectionHeading.trim()) {
      setFormError('Section Heading for "Myths & Facts" is required.');
      return;
    }

    if (!formData.reframeLabel.trim()) {
      setFormError('Reframe Label is required.');
      return;
    }

    if (!formData.reframeContent.trim()) {
      setFormError('Reframe Content is required.');
      return;
    }

    setFormLoading(true);
    try {
      const url = editingId
        ? `/api/admin/dharmic-concepts/${editingId}`
        : '/api/admin/dharmic-concepts';
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        title: formData.bannerTitle || formData.title,
        summary: formData.bannerDescription || formData.summary,
        storiesItemsJson: JSON.stringify(formData.storiesItems),
        threeStoriesGalleryJson: JSON.stringify(formData.threeStoriesGallery),
        mythsItemsJson: JSON.stringify(formData.mythsItems),
        relatedRitualGuidesJson: JSON.stringify(formData.relatedRitualGuides),
        relatedPujansJson: JSON.stringify(formData.relatedPujans),
        relatedConceptsJson: JSON.stringify(formData.relatedConcepts),
        relatedDatesJson: JSON.stringify(formData.relatedDates),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || 'Failed to save concept.');
      } else {
        setSuccessMessage(
          editingId
            ? 'Dharmic Concept updated successfully!'
            : 'New Dharmic Concept created successfully!'
        );
        setIsModalOpen(false);
        fetchConcepts();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Concept
  const handleDeleteConcept = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/dharmic-concepts/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('Concept deleted successfully.');
        setDeleteId(null);
        fetchConcepts();
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
              <span>🧭</span> Dharmic Concepts
            </Link>

            <Link
              href="/admin/dashboard/beginner-guides"
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
              Dharmic Concepts
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
              Compose and manage scripture-verified philosophical concepts, mantras, and guidelines.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={openCreateModal}
              style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(222, 27, 89, 0.2)' }}
            >
              + New Concept
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
              placeholder="Search concepts by title, slug, or content..."
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
              <option value="DHARMA">DHARMA</option>
              <option value="Festive Pujans">Festive Pujans</option>
              <option value="Sadhana">Sadhana</option>
              <option value="Veda">Veda</option>
              <option value="Upanishad">Upanishad</option>
              <option value="Itihasa">Itihasa</option>
              <option value="Puranas">Puranas</option>
              <option value="Darshana">Darshana</option>
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

        {/* CONCEPTS LISTING TABLE CARD */}
        {loading ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
            Loading Dharmic Concepts...
          </div>
        ) : concepts.length === 0 ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>No Dharmic Concepts Found</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>Compose your first scripture-backed concept entry.</p>
            <button
              type="button"
              onClick={openCreateModal}
              style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              + Create Concept
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
                {concepts.map((concept) => (
                  <tr key={concept.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px', fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif" }}>
                        {concept.bannerTitle || concept.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px', fontFamily: 'monospace' }}>/{concept.slug}</div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#4B5563', fontSize: '13px' }}>
                      {concept.category || 'DHARMA'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {concept.status === 'PUBLISHED' ? (
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
                      {new Date(concept.updatedAt).toLocaleDateString('en-GB')}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(concept)}
                          style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #D1D5DB', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          ✏ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(concept.id)}
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

      {/* CREATE / EDIT FORM MODAL WITH SECTION-WISE TABS */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #EFEAE4' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.8px', display: 'block', marginBottom: '2px' }}>
                  DHARMIC CONCEPTS CMS
                </span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  {editingId ? 'Edit Dharmic Concept' : 'Create New Dharmic Concept'}
                </h2>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#F3F4F6', color: '#6B7280', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
                ✕
              </button>
            </div>

            {/* TAB NAVIGATION STRIP */}
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
                🚩 Banner
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('threeStories')}
                style={{
                  background: 'transparent',
                  color: activeTab === 'threeStories' ? '#DE1B59' : '#4B5563',
                  border: 'none',
                  borderBottom: activeTab === 'threeStories' ? '3px solid #DE1B59' : '3px solid transparent',
                  borderRadius: '0',
                  padding: '10px 4px 12px 4px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'threeStories' ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                📖 Three Stories
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('whatTheyShare')}
                style={{
                  background: 'transparent',
                  color: activeTab === 'whatTheyShare' ? '#DE1B59' : '#4B5563',
                  border: 'none',
                  borderBottom: activeTab === 'whatTheyShare' ? '3px solid #DE1B59' : '3px solid transparent',
                  borderRadius: '0',
                  padding: '10px 4px 12px 4px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'whatTheyShare' ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                🤝 What They Share
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mythsAndFacts')}
                style={{
                  background: 'transparent',
                  color: activeTab === 'mythsAndFacts' ? '#DE1B59' : '#4B5563',
                  border: 'none',
                  borderBottom: activeTab === 'mythsAndFacts' ? '3px solid #DE1B59' : '3px solid transparent',
                  borderRadius: '0',
                  padding: '10px 4px 12px 4px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'mythsAndFacts' ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                ⚖️ Myths & Facts
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('related')}
                style={{
                  background: 'transparent',
                  color: activeTab === 'related' ? '#DE1B59' : '#4B5563',
                  border: 'none',
                  borderBottom: activeTab === 'related' ? '3px solid #DE1B59' : '3px solid transparent',
                  borderRadius: '0',
                  padding: '10px 4px 12px 4px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'related' ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                🔗 Related
              </button>
            </div>

            {formError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveConcept}>
              {/* TAB 1: BANNER SECTION */}
              {activeTab === 'banner' && (
                <div style={{ background: '#FFFDF5', border: '1px solid #F3E8D2', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EFE0B8' }}>
                    <span style={{ fontSize: '18px' }}>🚩</span>
                    <div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        Dharmic Concepts — Banner
                      </h3>
                      <div style={{ fontSize: '11px', color: '#8A7A68' }}>
                        Configure hero banner metadata, classification badges, title, description, and call-to-actions.
                      </div>
                    </div>
                  </div>

                  {/* SUBSECTION 1: CLASSIFICATION */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#A07800', letterSpacing: '0.6px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                      Classification
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Banner Eyebrow *</label>
                        <input
                          type="text"
                          placeholder="DHARMIC CONCEPTS · MEANINGS & PRACTICES"
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
                          <option value="Materials">Materials</option>
                          <option value="Meanings & Practices">Meanings & Practices</option>
                          <option value="Daily Puja">Daily Puja</option>
                          <option value="Dharma vs Pratha">Dharma vs Pratha</option>
                          <option value="Mantras">Mantras</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Rating</label>
                        <input
                          type="text"
                          placeholder="4/5"
                          value={formData.bannerRating}
                          onChange={(e) => setFormData({ ...formData, bannerRating: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Tradition / Classification</label>
                        <input
                          type="text"
                          placeholder="PURANIC"
                          value={formData.bannerClassification}
                          onChange={(e) => setFormData({ ...formData, bannerClassification: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SUBSECTION 2: MAIN CONTENT */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#A07800', letterSpacing: '0.6px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                      Main Content
                    </h4>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Concept Title *</label>
                      <input
                        type="text"
                        placeholder="Three Stories, One Thread"
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

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        Concept Description * (Rich Text Editor)
                      </label>
                      <RichTextEditor
                        value={formData.bannerDescription}
                        onChange={(html) => setFormData({ ...formData, bannerDescription: html, summary: html })}
                        placeholder="Wife, friend, devotee — three relationships, one act of protection. Not one of them is a sister and a brother."
                        minHeight="110px"
                      />
                    </div>
                  </div>

                  {/* SUBSECTION 3: ACTIONS */}
                  <div>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#A07800', letterSpacing: '0.6px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                      Actions
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Primary CTA Text *</label>
                        <input
                          type="text"
                          placeholder="Read the three stories"
                          value={formData.bannerPrimaryCtaText}
                          onChange={(e) => setFormData({ ...formData, bannerPrimaryCtaText: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Primary CTA Link</label>
                        <input
                          type="text"
                          placeholder="#three or /guides/..."
                          value={formData.bannerPrimaryCtaLink}
                          onChange={(e) => setFormData({ ...formData, bannerPrimaryCtaLink: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Secondary CTA Text *</label>
                        <input
                          type="text"
                          placeholder="Save this"
                          value={formData.bannerSecondaryCtaText}
                          onChange={(e) => setFormData({ ...formData, bannerSecondaryCtaText: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Secondary CTA Link</label>
                        <input
                          type="text"
                          placeholder="Action URL or leave blank for bookmark action"
                          value={formData.bannerSecondaryCtaLink}
                          onChange={(e) => setFormData({ ...formData, bannerSecondaryCtaLink: e.target.value })}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Share Button Text</label>
                      <input
                        type="text"
                        placeholder="Share"
                        value={formData.bannerShareButtonText}
                        onChange={(e) => setFormData({ ...formData, bannerShareButtonText: e.target.value })}
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: THREE STORIES SECTION */}
              {activeTab === 'threeStories' && (
                <div style={{ background: '#FFFDF5', border: '1px solid #F3E8D2', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EFE0B8' }}>
                    <span style={{ fontSize: '18px' }}>📖</span>
                    <div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        Dharmic Concepts — Three Stories
                      </h3>
                      <div style={{ fontSize: '11px', color: '#8A7A68' }}>
                        Manage section introductory prose, repeatable story cards, media gallery, and captions.
                      </div>
                    </div>
                  </div>

                  {/* SECTION TITLE */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Three Stories Title *</label>
                    <input
                      type="text"
                      placeholder="Three stories"
                      value={formData.threeStoriesTitle}
                      onChange={(e) => setFormData({ ...formData, threeStoriesTitle: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  {/* SECTION INTRODUCTION */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Three Stories Introduction * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.threeStoriesIntro}
                      onChange={(html) => setFormData({ ...formData, threeStoriesIntro: html })}
                      placeholder="The tradition's founding stories tell a different tale from the one most people know — three of them, from three texts, involving three completely different relationships."
                      minHeight="100px"
                    />
                  </div>

                  {/* SUPPORTING INTRODUCTION */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Three Stories Supporting Text * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.threeStoriesSupportingText}
                      onChange={(html) => setFormData({ ...formData, threeStoriesSupportingText: html })}
                      placeholder="<b>Not one is about a sister and a brother.</b> What they share is a thread, a mantra, and someone who needed protecting."
                      minHeight="100px"
                    />
                  </div>

                  {/* REPEATABLE STORIES CARDS LIST */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          Stories ({formData.storiesItems.length})
                        </h4>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          Add, edit, reorder, or delete stories. Unlimited entries supported.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addStoryItem}
                        style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        + Add Story
                      </button>
                    </div>

                    {formData.storiesItems.map((story, sIdx) => (
                      <div
                        key={story.id}
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
                            STORY #{sIdx + 1}: {story.title || 'Untitled'}
                          </span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => moveStoryItem(sIdx, 'up')}
                              disabled={sIdx === 0}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: sIdx === 0 ? 'not-allowed' : 'pointer' }}
                            >
                              ▲ Up
                            </button>
                            <button
                              type="button"
                              onClick={() => moveStoryItem(sIdx, 'down')}
                              disabled={sIdx === formData.storiesItems.length - 1}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: sIdx === formData.storiesItems.length - 1 ? 'not-allowed' : 'pointer' }}
                            >
                              ▼ Down
                            </button>
                            <button
                              type="button"
                              onClick={() => removeStoryItem(story.id)}
                              style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Story Title *</label>
                          <input
                            type="text"
                            placeholder="Wife / Friend / Devotee"
                            value={story.title}
                            onChange={(e) => updateStoryItem(story.id, 'title', e.target.value)}
                            style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                          />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                            Story Description * (Rich Text Editor)
                          </label>
                          <RichTextEditor
                            value={story.description}
                            onChange={(html) => updateStoryItem(story.id, 'description', html)}
                            placeholder="A story of protection within a marriage..."
                            minHeight="80px"
                          />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                            Story Content / Narrative (Rich Text Editor)
                          </label>
                          <RichTextEditor
                            value={story.content || ''}
                            onChange={(html) => updateStoryItem(story.id, 'content', html)}
                            placeholder="Full story narrative..."
                            minHeight="90px"
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Story Image URL</label>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={story.image || ''}
                              onChange={(e) => updateStoryItem(story.id, 'image', e.target.value)}
                              style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Story Image Alt Text</label>
                            <input
                              type="text"
                              placeholder="Alt description for image"
                              value={story.imageAltText || ''}
                              onChange={(e) => updateStoryItem(story.id, 'imageAltText', e.target.value)}
                              style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                            Story Image Caption (Rich Text Editor)
                          </label>
                          <RichTextEditor
                            value={story.imageCaption || ''}
                            onChange={(html) => updateStoryItem(story.id, 'imageCaption', html)}
                            placeholder="Image caption text..."
                            minHeight="70px"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* THREE STORIES GALLERY SECTION */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          Three Stories Gallery ({formData.threeStoriesGallery.length})
                        </h4>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          Manage composite gallery images representing the stories composition.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addGalleryItem}
                        style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        + Add Gallery Image
                      </button>
                    </div>

                    {formData.threeStoriesGallery.map((gal, gIdx) => (
                      <div
                        key={gal.id}
                        style={{
                          background: '#FBF9F5',
                          border: '1px solid #EFEAE4',
                          borderRadius: '12px',
                          padding: '14px',
                          marginBottom: '12px',
                          display: 'flex',
                          gap: '16px',
                          alignItems: 'flex-start',
                        }}
                      >
                        {gal.image && (
                          <img
                            src={gal.image}
                            alt={gal.altText || 'Gallery item'}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB', flexShrink: 0 }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#A07800' }}>
                              GALLERY IMAGE #{gIdx + 1}
                            </span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => moveGalleryItem(gIdx, 'up')}
                                disabled={gIdx === 0}
                                style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => moveGalleryItem(gIdx, 'down')}
                                disabled={gIdx === formData.threeStoriesGallery.length - 1}
                                style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={() => removeGalleryItem(gal.id)}
                                style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 600 }}
                              >
                                ✕ Remove
                              </button>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                            <input
                              type="text"
                              placeholder="Image URL (https://...)"
                              value={gal.image}
                              onChange={(e) => updateGalleryItem(gal.id, 'image', e.target.value)}
                              style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '7px 10px', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
                            />
                            <input
                              type="text"
                              placeholder="Alt text"
                              value={gal.altText || ''}
                              onChange={(e) => updateGalleryItem(gal.id, 'altText', e.target.value)}
                              style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '7px 10px', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SECTION IMAGE CAPTION */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Three Stories Image Caption (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.threeStoriesCaption}
                      onChange={(html) => setFormData({ ...formData, threeStoriesCaption: html })}
                      placeholder="Three stories. Three relationships. One thread."
                      minHeight="90px"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: WHAT THEY SHARE SECTION */}
              {activeTab === 'whatTheyShare' && (
                <div style={{ background: '#FFFDF5', border: '1px solid #F3E8D2', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EFE0B8' }}>
                    <span style={{ fontSize: '18px' }}>🤝</span>
                    <div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        What the three share, and what they do not
                      </h3>
                      <div style={{ fontSize: '11px', color: '#8A7A68' }}>
                        Configure shared/unshared core principles, highlighted callouts, supporting description, and tradition tag.
                      </div>
                    </div>
                  </div>

                  {/* 1. SECTION HEADING */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Section Heading *</label>
                    <input
                      type="text"
                      placeholder="What the three share, and what they do not"
                      value={formData.shareSectionHeading}
                      onChange={(e) => setFormData({ ...formData, shareSectionHeading: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  {/* 2. SHARED CONTENT */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Shared Content * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.shareSharedContent}
                      onChange={(html) => setFormData({ ...formData, shareSharedContent: html })}
                      placeholder="<b>Shared:</b> a thread, a moment of vulnerability, an act of protection that was returned."
                      minHeight="90px"
                    />
                  </div>

                  {/* 3. NOT SHARED CONTENT */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Not Shared Content * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.shareNotSharedContent}
                      onChange={(html) => setFormData({ ...formData, shareNotSharedContent: html })}
                      placeholder="<b>Not shared:</b> the relationship. Wife, friend, devotee — three entirely different bonds."
                      minHeight="90px"
                    />
                  </div>

                  {/* 4. HIGHLIGHT / CALLOUT */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Highlight Statement * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.shareHighlightStatement}
                      onChange={(html) => setFormData({ ...formData, shareHighlightStatement: html })}
                      placeholder="The tradition did not restrict the raksha sutra to one kind of relationship, because protection is not restricted to one kind of relationship."
                      minHeight="100px"
                    />
                  </div>

                  {/* 5. SUPPORTING DESCRIPTION */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Supporting Description * (Rich Text Editor)
                    </label>
                    <RichTextEditor
                      value={formData.shareSupportingDescription}
                      onChange={(html) => setFormData({ ...formData, shareSupportingDescription: html })}
                      placeholder="The sibling form is the fourth story. It is cultural, widespread and genuine, and it is the family's addition to the tradition rather than the tradition's founding act."
                      minHeight="100px"
                    />
                  </div>

                  {/* 6. PRACTICE / TRADITION TAG */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Tradition Tag</label>
                    <input
                      type="text"
                      placeholder="PRATHA"
                      value={formData.shareTraditionTag}
                      onChange={(e) => setFormData({ ...formData, shareTraditionTag: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: MYTHS & FACTS SECTION */}
              {activeTab === 'mythsAndFacts' && (
                <div style={{ background: '#FFFDF5', border: '1px solid #F3E8D2', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EFE0B8' }}>
                    <span style={{ fontSize: '18px' }}>⚖️</span>
                    <div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        Myths & Facts
                      </h3>
                      <div style={{ fontSize: '11px', color: '#8A7A68' }}>
                        Manage common misconceptions, scripture-verified corrections, and the synthesis reframe block.
                      </div>
                    </div>
                  </div>

                  {/* 1. SECTION HEADING */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Section Heading *</label>
                    <input
                      type="text"
                      placeholder="Myths & Facts"
                      value={formData.mythsSectionHeading}
                      onChange={(e) => setFormData({ ...formData, mythsSectionHeading: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  {/* 2. REPEATABLE MYTH & FACT ITEMS */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          Myth & Fact Cards ({formData.mythsItems.length})
                        </h4>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          Add, edit, reorder, or delete myth entries. Unlimited items supported.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addMythItem}
                        style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        + Add Myth & Fact
                      </button>
                    </div>

                    {formData.mythsItems.map((myth, mIdx) => (
                      <div
                        key={myth.id}
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
                            MYTH & FACT #{mIdx + 1}
                          </span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => moveMythItem(mIdx, 'up')}
                              disabled={mIdx === 0}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: mIdx === 0 ? 'not-allowed' : 'pointer' }}
                            >
                              ▲ Up
                            </button>
                            <button
                              type="button"
                              onClick={() => moveMythItem(mIdx, 'down')}
                              disabled={mIdx === formData.mythsItems.length - 1}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: mIdx === formData.mythsItems.length - 1 ? 'not-allowed' : 'pointer' }}
                            >
                              ▼ Down
                            </button>
                            <button
                              type="button"
                              onClick={() => removeMythItem(myth.id)}
                              style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                            Myth Statement * (Rich Text Editor)
                          </label>
                          <RichTextEditor
                            value={myth.mythStatement}
                            onChange={(html) => updateMythItem(myth.id, 'mythStatement', html)}
                            placeholder='"All three stories are about siblings..."'
                            minHeight="80px"
                          />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Correction Label *</label>
                          <input
                            type="text"
                            placeholder="CORRECTION"
                            value={myth.correctionLabel}
                            onChange={(e) => updateMythItem(myth.id, 'correctionLabel', e.target.value)}
                            style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                            Correction Content * (Rich Text Editor)
                          </label>
                          <RichTextEditor
                            value={myth.correctionContent}
                            onChange={(html) => updateMythItem(myth.id, 'correctionContent', html)}
                            placeholder="Not one of the three founding narratives involves siblings..."
                            minHeight="90px"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 3. THE REFRAME CONTENT BLOCK */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
                    <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, color: '#DE1B59', margin: '0 0 14px' }}>
                      The Reframe
                    </h4>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Reframe Label *</label>
                      <input
                        type="text"
                        placeholder="THE REFRAME"
                        value={formData.reframeLabel}
                        onChange={(e) => setFormData({ ...formData, reframeLabel: e.target.value })}
                        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        Reframe Content * (Rich Text Editor)
                      </label>
                      <RichTextEditor
                        value={formData.reframeContent}
                        onChange={(html) => setFormData({ ...formData, reframeContent: html })}
                        placeholder="The tradition put a wife, a friend and a devotee side by side..."
                        minHeight="120px"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: RELATED SECTION */}
              {activeTab === 'related' && (
                <div style={{ background: '#FFFDF5', border: '1px solid #F3E8D2', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #EFE0B8' }}>
                    <span style={{ fontSize: '18px' }}>🔗</span>
                    <div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        Related Resources
                      </h3>
                      <div style={{ fontSize: '11px', color: '#8A7A68' }}>
                        Manage related Ritual Guides, Pujans, Concepts, and Dates with rich descriptions and target links.
                      </div>
                    </div>
                  </div>

                  {/* GROUP 1: RELATED RITUAL GUIDES */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          Related Ritual Guides ({formData.relatedRitualGuides.length})
                        </h4>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          Repeatable ritual guide links.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addRelatedItem('relatedRitualGuides')}
                        style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '9999px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                      >
                        + Add Ritual Guide
                      </button>
                    </div>

                    {formData.relatedRitualGuides.map((item, idx) => (
                      <div key={item.id} style={{ background: '#FBF9F5', border: '1px solid #EFEAE4', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59' }}>RITUAL GUIDE #{idx + 1}</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button type="button" onClick={() => moveRelatedItem('relatedRitualGuides', idx, 'up')} disabled={idx === 0} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▲</button>
                            <button type="button" onClick={() => moveRelatedItem('relatedRitualGuides', idx, 'down')} disabled={idx === formData.relatedRitualGuides.length - 1} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▼</button>
                            <button type="button" onClick={() => removeRelatedItem('relatedRitualGuides', item.id)} style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 600 }}>✕ Remove</button>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Title *</label>
                            <input type="text" value={item.title} onChange={(e) => updateRelatedItem('relatedRitualGuides', item.id, 'title', e.target.value)} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '7px 10px', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Link / Target *</label>
                            <input type="text" value={item.link} onChange={(e) => updateRelatedItem('relatedRitualGuides', item.id, 'link', e.target.value)} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '7px 10px', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Description (Rich Text Editor)</label>
                          <RichTextEditor value={item.description || ''} onChange={(html) => updateRelatedItem('relatedRitualGuides', item.id, 'description', html)} placeholder="Brief description..." minHeight="70px" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* GROUP 2: RELATED PUJANS */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          Related Pujans ({formData.relatedPujans.length})
                        </h4>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          Repeatable pujan links.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addRelatedItem('relatedPujans')}
                        style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '9999px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                      >
                        + Add Pujan
                      </button>
                    </div>

                    {formData.relatedPujans.map((item, idx) => (
                      <div key={item.id} style={{ background: '#FBF9F5', border: '1px solid #EFEAE4', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59' }}>PUJAN #{idx + 1}</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button type="button" onClick={() => moveRelatedItem('relatedPujans', idx, 'up')} disabled={idx === 0} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▲</button>
                            <button type="button" onClick={() => moveRelatedItem('relatedPujans', idx, 'down')} disabled={idx === formData.relatedPujans.length - 1} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▼</button>
                            <button type="button" onClick={() => removeRelatedItem('relatedPujans', item.id)} style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 600 }}>✕ Remove</button>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Title *</label>
                            <input type="text" value={item.title} onChange={(e) => updateRelatedItem('relatedPujans', item.id, 'title', e.target.value)} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '7px 10px', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Link / Target *</label>
                            <input type="text" value={item.link} onChange={(e) => updateRelatedItem('relatedPujans', item.id, 'link', e.target.value)} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '7px 10px', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Description (Rich Text Editor)</label>
                          <RichTextEditor value={item.description || ''} onChange={(html) => updateRelatedItem('relatedPujans', item.id, 'description', html)} placeholder="Brief description..." minHeight="70px" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* GROUP 3: RELATED CONCEPTS */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          Related Concepts ({formData.relatedConcepts.length})
                        </h4>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          Repeatable concept links.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addRelatedItem('relatedConcepts')}
                        style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '9999px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                      >
                        + Add Concept
                      </button>
                    </div>

                    {formData.relatedConcepts.map((item, idx) => (
                      <div key={item.id} style={{ background: '#FBF9F5', border: '1px solid #EFEAE4', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59' }}>CONCEPT #{idx + 1}</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button type="button" onClick={() => moveRelatedItem('relatedConcepts', idx, 'up')} disabled={idx === 0} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▲</button>
                            <button type="button" onClick={() => moveRelatedItem('relatedConcepts', idx, 'down')} disabled={idx === formData.relatedConcepts.length - 1} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▼</button>
                            <button type="button" onClick={() => removeRelatedItem('relatedConcepts', item.id)} style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 600 }}>✕ Remove</button>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Title *</label>
                            <input type="text" value={item.title} onChange={(e) => updateRelatedItem('relatedConcepts', item.id, 'title', e.target.value)} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '7px 10px', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Link / Target *</label>
                            <input type="text" value={item.link} onChange={(e) => updateRelatedItem('relatedConcepts', item.id, 'link', e.target.value)} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '7px 10px', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Description (Rich Text Editor)</label>
                          <RichTextEditor value={item.description || ''} onChange={(html) => updateRelatedItem('relatedConcepts', item.id, 'description', html)} placeholder="Brief description..." minHeight="70px" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* GROUP 4: RELATED DATES */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          Related Dates ({formData.relatedDates.length})
                        </h4>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          Repeatable date / panchang links.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addRelatedItem('relatedDates')}
                        style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '9999px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                      >
                        + Add Date
                      </button>
                    </div>

                    {formData.relatedDates.map((item, idx) => (
                      <div key={item.id} style={{ background: '#FBF9F5', border: '1px solid #EFEAE4', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59' }}>DATE #{idx + 1}</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button type="button" onClick={() => moveRelatedItem('relatedDates', idx, 'up')} disabled={idx === 0} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▲</button>
                            <button type="button" onClick={() => moveRelatedItem('relatedDates', idx, 'down')} disabled={idx === formData.relatedDates.length - 1} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▼</button>
                            <button type="button" onClick={() => removeRelatedItem('relatedDates', item.id)} style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 600 }}>✕ Remove</button>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Title *</label>
                            <input type="text" value={item.title} onChange={(e) => updateRelatedItem('relatedDates', item.id, 'title', e.target.value)} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '7px 10px', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Link / Target *</label>
                            <input type="text" value={item.link} onChange={(e) => updateRelatedItem('relatedDates', item.id, 'link', e.target.value)} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '7px 10px', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Description (Rich Text Editor)</label>
                          <RichTextEditor value={item.description || ''} onChange={(html) => updateRelatedItem('relatedDates', item.id, 'description', html)} placeholder="Brief description..." minHeight="70px" />
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
                    placeholder="three-stories-one-thread"
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
                  {formLoading ? 'Saving...' : editingId ? 'Update Concept' : 'Publish Concept'}
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
              Are you sure you want to delete this concept? This action cannot be undone.
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
                onClick={() => handleDeleteConcept(deleteId)}
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

export default function DharmicConceptsCmsPage() {
  return (
    <SessionProvider>
      <DharmicConceptsCmsContent />
    </SessionProvider>
  );
}
