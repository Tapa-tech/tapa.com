'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

interface SankalpaCard {
  id: string;
  cardTitle: string;
  cardDescription: string;
}

interface KathaCard {
  id: string;
  cardNumber: number;
  cardTitle: string;
  cardDescription: string;
}

interface SamagriItem {
  id: string;
  itemName: string;
  itemDetails: string;
  itemOrder?: number;
  itemImage?: string;
  itemImageAltText?: string;
  itemImageCaption?: string;
}

interface FastingOption {
  id: string;
  title: string;
  description: string;
  displayOrder?: number;
}

interface MythItem {
  id: string;
  mythStatement: string;
  correctionLabel: string;
  correctionContent: string;
  displayOrder?: number;
}

interface VidhiStep {
  id: string;
  stepNumber: number;
  stepDescription: string;
  stepLabels: string[];
  stepImage?: string;
  stepImageAltText?: string;
  stepImageCaption?: string;
}

interface VidhiDay {
  id: string;
  dayNumber: number;
  dayTitle: string;
  dayDescription: string;

  // Muhurat
  muhuratLabel: string;
  muhuratInformation: string;

  // Steps
  steps: VidhiStep[];

  // Mantra
  mantraLabel: string;
  mantraText: string;
  mantraTransliteration: string;
  mantraAudio?: string;

  // Japa Audio
  japaAudio?: string;

  // Day Explanation
  dayExplanation?: string;
  explanationLabels: string[];
}

interface RitualGuide {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';

  // Banner Content
  sectionLabel: string | null;
  category: string | null;
  rating: string | null;
  classification: string | null;
  guideTitle: string | null;
  guideSubtitle: string | null;
  festivalName: string | null;
  panchangLocation: string | null;
  primaryButtonText: string | null;
  primaryButtonAction: string | null;
  primaryButtonTarget: string | null;
  secondaryButtonText: string | null;
  secondaryButtonAction: string | null;
  secondaryButtonTarget: string | null;
  thirdButtonText: string | null;
  thirdButtonAction: string | null;
  thirdButtonTarget: string | null;

  // Source of Truth
  sotSectionHeading: string | null;
  sotButtonText: string | null;
  sotButtonAction: string | null;
  sotButtonTarget: string | null;
  sotPracticeLabel: string | null;
  sotPracticeTitle: string | null;
  sotPracticeCategory: string | null;
  sotPracticeRating: string | null;
  sotPracticeClassification: string | null;
  sotScripturalSource: string | null;
  sotParentScripture: string | null;
  sotSourceReference: string | null;
  sotSourceUrl: string | null;
  sotSourceNotes: string | null;
  sotSummaryLabel: string | null;
  sotCorePracticesCount: number | null;
  sotScripturalElementsCount: number | null;
  sotRegionalCustomsCount: number | null;
  sotCorrectionsCount: number | null;

  // Story Section
  storyTitle: string | null;
  storyIntroduction: string | null;
  storySubsectionTitle: string | null;
  storyContent: string | null;
  storyPracticeCategory: string | null;
  storyPracticeRating: string | null;
  storyPracticeClassification: string | null;
  storyScripturalSource: string | null;
  storyContinuation: string | null;
  storyImage: string | null;
  storyImageAltText: string | null;
  storyImageCaption: string | null;
  storyImageCredit: string | null;
  storyImageSource: string | null;

  // Sankalpa Section
  sankalpaTitle: string | null;
  sankalpaSubtitle: string | null;
  sankalpaInstruction: string | null;
  sankalpaText: string | null;
  sankalpaMeaning: string | null;
  sankalpaExplanation: string | null;
  sankalpaDetailsJson: string | null;
  sankalpaNoteHeading: string | null;
  sankalpaNoteContent: string | null;
  sankalpaImage: string | null;

  // Vidhi Section
  vidhiDaysJson: string | null;

  // Vrat Katha Section
  kathaTitle: string | null;
  kathaSubtitle: string | null;
  kathaScripturalReference: string | null;
  kathaHeadline: string | null;
  kathaIntroduction: string | null;
  kathaCardsJson: string | null;
  kathaSupportingExplanation: string | null;
  kathaAudio: string | null;
  kathaAudioButtonText: string | null;
  kathaAudioDuration: string | null;
  kathaFullKathaButtonText: string | null;
  kathaFullKathaLink: string | null;
  kathaImage: string | null;
  kathaImageAltText: string | null;
  kathaImageCaption: string | null;

  // Durga Ashtami and Maha Navami Context
  festivalContextTitle: string | null;
  festivalContextIntroduction: string | null;
  festivalContextDetails: string | null;
  festivalPracticeCategory: string | null;
  festivalPracticeRating: string | null;
  festivalClassification: string | null;
  sandhiPujaInformation: string | null;

  // Samagri Section
  samagriTitle: string | null;
  samagriSubtitle: string | null;
  samagriItemsJson: string | null;
  samagriAudio: string | null;
  samagriAudioButtonText: string | null;
  samagriAudioDuration: string | null;

  // Fasting Section
  fastingTitle: string | null;
  fastingSubtitle: string | null;
  fastingOptionsJson: string | null;
  fastingGuidanceHeading: string | null;
  fastingGuidanceContent: string | null;

  // Myths & Corrections Section
  mythsTitle: string | null;
  mythsSubtitle: string | null;
  mythsItemsJson: string | null;

  createdAt: string;
  updatedAt: string;
}

const DEFAULT_SANKALPA_CARDS: SankalpaCard[] = [];

const DEFAULT_KATHA_CARDS: KathaCard[] = [];

const DEFAULT_SAMAGRI_ITEMS: SamagriItem[] = [];

const DEFAULT_FASTING_OPTIONS: FastingOption[] = [];

const DEFAULT_MYTHS_ITEMS: MythItem[] = [];

const DEFAULT_VIDHI_DAYS: VidhiDay[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    dayTitle: '',
    dayDescription: '',
    muhuratLabel: '',
    muhuratInformation: '',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        stepDescription: '',
        stepLabels: [],
      },
    ],
    mantraLabel: '',
    mantraText: '',
    mantraTransliteration: '',
    mantraAudio: '',
    japaAudio: '',
    dayExplanation: '',
    explanationLabels: [],
  },
];

const EMPTY_FORM_DATA = {
  title: '',
  slug: '',
  status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',

  // Banner Information
  sectionLabel: '',
  category: '',
  rating: '',
  classification: '',
  guideTitle: '',
  guideSubtitle: '',
  festivalName: '',
  panchangLocation: '',

  primaryButtonText: '',
  primaryButtonAction: '',
  primaryButtonTarget: '',
  secondaryButtonText: '',
  secondaryButtonAction: '',
  secondaryButtonTarget: '',
  thirdButtonText: '',
  thirdButtonAction: '',
  thirdButtonTarget: '',

  // Source of Truth
  sotSectionHeading: '',
  sotButtonText: '',
  sotButtonAction: '',
  sotButtonTarget: '',
  sotPracticeLabel: '',
  sotPracticeTitle: '',
  sotPracticeCategory: '',
  sotPracticeRating: '',
  sotPracticeClassification: '',
  sotScripturalSource: '',
  sotParentScripture: '',
  sotSourceReference: '',
  sotSourceUrl: '',
  sotSourceNotes: '',
  sotSummaryLabel: '',
  sotCorePracticesCount: 0,
  sotScripturalElementsCount: 0,
  sotRegionalCustomsCount: 0,
  sotCorrectionsCount: 0,

  // Story Section
  storyTitle: '',
  storyIntroduction: '',
  storySubsectionTitle: '',
  storyContent: '',
  storyPracticeCategory: '',
  storyPracticeRating: '',
  storyPracticeClassification: '',
  storyScripturalSource: '',
  storyContinuation: '',
  storyImage: '',
  storyImageAltText: '',
  storyImageCaption: '',
  storyImageCredit: '',
  storyImageSource: '',

  // Sankalpa Section
  sankalpaTitle: '',
  sankalpaSubtitle: '',
  sankalpaInstruction: '',
  sankalpaText: '',
  sankalpaMeaning: '',
  sankalpaExplanation: '',
  sankalpaCards: DEFAULT_SANKALPA_CARDS,
  sankalpaNoteHeading: '',
  sankalpaNoteContent: '',
  sankalpaImage: '',

  // Vidhi Section
  vidhiDays: DEFAULT_VIDHI_DAYS,

  // Vrat Katha Section
  kathaTitle: '',
  kathaSubtitle: '',
  kathaScripturalReference: '',
  kathaHeadline: '',
  kathaIntroduction: '',
  kathaCards: DEFAULT_KATHA_CARDS,
  kathaSupportingExplanation: '',
  kathaAudio: '',
  kathaAudioButtonText: '',
  kathaAudioDuration: '',
  kathaFullKathaButtonText: '',
  kathaFullKathaLink: '',
  kathaImage: '',
  kathaImageAltText: '',
  kathaImageCaption: '',

  // Durga Ashtami & Maha Navami Context
  festivalContextTitle: '',
  festivalContextIntroduction: '',
  festivalContextDetails: '',
  festivalPracticeCategory: '',
  festivalPracticeRating: '',
  festivalClassification: '',
  sandhiPujaInformation: '',

  // Samagri Section
  samagriTitle: '',
  samagriSubtitle: '',
  samagriItems: DEFAULT_SAMAGRI_ITEMS,
  samagriAudio: '',
  samagriAudioButtonText: '',
  samagriAudioDuration: '',

  // Fasting Section
  fastingTitle: '',
  fastingSubtitle: '',
  fastingOptions: DEFAULT_FASTING_OPTIONS,
  fastingGuidanceHeading: '',
  fastingGuidanceContent: '',

  // Myths & Corrections Section
  mythsTitle: '',
  mythsSubtitle: '',
  mythsItems: DEFAULT_MYTHS_ITEMS,

  // Related Content Fields
  relatedTitle: '',
  relatedSubtitle: '',
  relatedLinksText: '',

  // Services / Booking Fields
  servicesTitle: '',
  servicesSubtitle: '',
  servicesButtonText: '',
  servicesTargetUrl: '',

  // SEO & Search Engine Information
  metaTitle: '',
  metaDescription: '',
  keywords: '',
};

type FormTab =
  | 'basic'
  | 'sot'
  | 'story'
  | 'sankalpa'
  | 'vidhi'
  | 'katha'
  | 'samagri'
  | 'fasting'
  | 'myths'
  | 'related'
  | 'services'
  | 'seo';

function RitualGuidesCmsContent() {
  const { data: session, status } = useSession();

  // Data & Filtering States
  const [guides, setGuides] = useState<RitualGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Active Tab State for Form Editor
  const [activeTab, setActiveTab] = useState<FormTab>('basic');

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Active Vidhi Day Index in Modal UI
  const [activeVidhiDayIndex, setActiveVidhiDayIndex] = useState(0);

  // Form Data — starts blank
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  // Action Feedback States
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const userRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'USER';
  const isAuthorized = ['ADMIN', 'EDITOR', 'SUPER_ADMIN', 'SUPER_USER'].includes(userRole);
  const userEmail = session?.user?.email || (session?.user as any)?.phone || 'admin@tapa.co';

  // Fetch Ritual Guides from backend API
  const fetchGuides = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/ritual-guides?${params.toString()}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setGuides(data.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch ritual guides:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    if (status === 'authenticated' && isAuthorized) {
      fetchGuides();
    }
  }, [status, isAuthorized, fetchGuides]);

  // Handle auto-slugification on guide title change
  const handleGuideTitleChange = (newGuideTitle: string) => {
    const autoSlug = newGuideTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

    setFormData((prev) => ({
      ...prev,
      guideTitle: newGuideTitle,
      title: newGuideTitle,
      slug: editingId ? prev.slug : autoSlug,
    }));
  };

  // Generic image-upload helper (was duplicated per-field before; now shared by Story & Katha images)
  const handleImageUpload = (
    field: 'storyImage' | 'kathaImage',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Generic repeatable-array-field helpers (previously duplicated 5x for Sankalpa/Katha/
  // Samagri/Fasting/Myths — every card/item manager below now reuses these three).
  type ArrayField =
    | 'sankalpaCards'
    | 'kathaCards'
    | 'samagriItems'
    | 'fastingOptions'
    | 'mythsItems';

  const updateArrayItem = (field: ArrayField, index: number, patch: Record<string, any>) => {
    setFormData((prev) => {
      const arr = [...(prev[field] as any[])];
      arr[index] = { ...arr[index], ...patch };
      return { ...prev, [field]: arr };
    });
  };

  const removeArrayItem = (field: ArrayField, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index),
    }));
  };

  const moveArrayItem = (field: ArrayField, index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const arr = [...(prev[field] as any[])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return prev;
      [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      return { ...prev, [field]: arr };
    });
  };

  // Sankalpa Card Management
  const addSankalpaCard = () => {
    setFormData((prev) => ({
      ...prev,
      sankalpaCards: [...prev.sankalpaCards, { id: `card-${Date.now()}`, cardTitle: '', cardDescription: '' }],
    }));
  };
  const updateSankalpaCard = (index: number, field: 'cardTitle' | 'cardDescription', value: string) =>
    updateArrayItem('sankalpaCards', index, { [field]: value });
  const removeSankalpaCard = (index: number) => removeArrayItem('sankalpaCards', index);

  // Katha Story Cards Management
  const addKathaCard = () => {
    setFormData((prev) => ({
      ...prev,
      kathaCards: [
        ...prev.kathaCards,
        { id: `kcard-${Date.now()}`, cardNumber: prev.kathaCards.length + 1, cardTitle: '', cardDescription: '' },
      ],
    }));
  };
  const updateKathaCard = (index: number, field: keyof KathaCard, value: any) =>
    updateArrayItem('kathaCards', index, { [field]: value });
  const removeKathaCard = (index: number) => removeArrayItem('kathaCards', index);
  const moveKathaCard = (index: number, direction: 'up' | 'down') => moveArrayItem('kathaCards', index, direction);

  // Samagri Items Management
  const addSamagriItem = () => {
    setFormData((prev) => ({
      ...prev,
      samagriItems: [
        ...prev.samagriItems,
        { id: `sitem-${Date.now()}`, itemName: '', itemDetails: '', itemOrder: prev.samagriItems.length + 1 },
      ],
    }));
  };
  const updateSamagriItem = (index: number, field: keyof SamagriItem, value: any) =>
    updateArrayItem('samagriItems', index, { [field]: value });
  const removeSamagriItem = (index: number) => removeArrayItem('samagriItems', index);
  const moveSamagriItem = (index: number, direction: 'up' | 'down') => moveArrayItem('samagriItems', index, direction);

  // Fasting Options Management
  const addFastingOption = () => {
    setFormData((prev) => ({
      ...prev,
      fastingOptions: [
        ...prev.fastingOptions,
        { id: `foption-${Date.now()}`, title: '', description: '', displayOrder: prev.fastingOptions.length + 1 },
      ],
    }));
  };
  const updateFastingOption = (index: number, field: keyof FastingOption, value: any) =>
    updateArrayItem('fastingOptions', index, { [field]: value });
  const removeFastingOption = (index: number) => removeArrayItem('fastingOptions', index);
  const moveFastingOption = (index: number, direction: 'up' | 'down') => moveArrayItem('fastingOptions', index, direction);

  // Myths & Corrections Management
  const addMythItem = () => {
    setFormData((prev) => ({
      ...prev,
      mythsItems: [
        ...prev.mythsItems,
        {
          id: `mitem-${Date.now()}`,
          mythStatement: '',
          correctionLabel: '',
          correctionContent: '',
          displayOrder: prev.mythsItems.length + 1,
        },
      ],
    }));
  };
  const updateMythItem = (index: number, field: keyof MythItem, value: any) =>
    updateArrayItem('mythsItems', index, { [field]: value });
  const removeMythItem = (index: number) => removeArrayItem('mythsItems', index);
  const moveMythItem = (index: number, direction: 'up' | 'down') => moveArrayItem('mythsItems', index, direction);

  // Vidhi Days Management Helpers
  const addVidhiDay = () => {
    setFormData((prev) => {
      const nextDayNum = prev.vidhiDays.length + 1;
      const newDay: VidhiDay = {
        id: `day-${Date.now()}`,
        dayNumber: nextDayNum,
        dayTitle: '',
        dayDescription: '',
        muhuratLabel: '',
        muhuratInformation: '',
        steps: [
          {
            id: `step-${Date.now()}-1`,
            stepNumber: 1,
            stepDescription: '',
            stepLabels: [],
          },
        ],
        mantraLabel: '',
        mantraText: '',
        mantraTransliteration: '',
        explanationLabels: [],
      };
      return {
        ...prev,
        vidhiDays: [...prev.vidhiDays, newDay],
      };
    });
    setActiveVidhiDayIndex(formData.vidhiDays.length);
  };

  const updateActiveVidhiDay = (field: keyof VidhiDay, value: any) => {
    setFormData((prev) => {
      const days = [...prev.vidhiDays];
      if (!days[activeVidhiDayIndex]) return prev;
      days[activeVidhiDayIndex] = {
        ...days[activeVidhiDayIndex],
        [field]: value,
      };
      return { ...prev, vidhiDays: days };
    });
  };

  const removeVidhiDay = (dayIndex: number) => {
    if (formData.vidhiDays.length <= 1) {
      alert('A Ritual Guide must contain at least one Vidhi Day.');
      return;
    }
    setFormData((prev) => {
      const days = prev.vidhiDays.filter((_, i) => i !== dayIndex);
      return { ...prev, vidhiDays: days };
    });
    setActiveVidhiDayIndex(0);
  };

  // Vidhi Mantra Audio Upload Helper (stores as base64 data URL, saved to DB via vidhiDaysJson)
  const handleMantraAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateActiveVidhiDay('mantraAudio', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeMantraAudio = () => {
    updateActiveVidhiDay('mantraAudio', '');
  };

  // Vidhi Steps Helpers inside active day
  const addVidhiStep = () => {
    setFormData((prev) => {
      const days = [...prev.vidhiDays];
      const activeDay = days[activeVidhiDayIndex];
      if (!activeDay) return prev;
      const nextStepNum = activeDay.steps.length + 1;
      const newStep: VidhiStep = {
        id: `step-${Date.now()}`,
        stepNumber: nextStepNum,
        stepDescription: '',
        stepLabels: [],
      };
      activeDay.steps = [...activeDay.steps, newStep];
      days[activeVidhiDayIndex] = activeDay;
      return { ...prev, vidhiDays: days };
    });
  };

  const updateVidhiStep = (stepIndex: number, field: keyof VidhiStep, value: any) => {
    setFormData((prev) => {
      const days = [...prev.vidhiDays];
      const activeDay = days[activeVidhiDayIndex];
      if (!activeDay || !activeDay.steps[stepIndex]) return prev;
      activeDay.steps[stepIndex] = {
        ...activeDay.steps[stepIndex],
        [field]: value,
      };
      days[activeVidhiDayIndex] = activeDay;
      return { ...prev, vidhiDays: days };
    });
  };

  const removeVidhiStep = (stepIndex: number) => {
    setFormData((prev) => {
      const days = [...prev.vidhiDays];
      const activeDay = days[activeVidhiDayIndex];
      if (!activeDay) return prev;
      activeDay.steps = activeDay.steps.filter((_, i) => i !== stepIndex);
      days[activeVidhiDayIndex] = activeDay;
      return { ...prev, vidhiDays: days };
    });
  };

  const moveVidhiStep = (stepIndex: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const days = [...prev.vidhiDays];
      const activeDay = days[activeVidhiDayIndex];
      if (!activeDay) return prev;
      const steps = [...activeDay.steps];
      const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
      if (targetIndex < 0 || targetIndex >= steps.length) return prev;
      const temp = steps[stepIndex];
      steps[stepIndex] = steps[targetIndex];
      steps[targetIndex] = temp;
      activeDay.steps = steps;
      days[activeVidhiDayIndex] = activeDay;
      return { ...prev, vidhiDays: days };
    });
  };

  // Open modal for Create Mode (starts fully blank)
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM_DATA);
    setActiveVidhiDayIndex(0);
    setActiveTab('basic');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit Mode
  const openEditModal = (guide: RitualGuide) => {
    setEditingId(guide.id);

    let parsedCards: SankalpaCard[] = DEFAULT_SANKALPA_CARDS;
    if (guide.sankalpaDetailsJson) {
      try {
        parsedCards = JSON.parse(guide.sankalpaDetailsJson);
      } catch (err) { }
    }

    let parsedKathaCards: KathaCard[] = DEFAULT_KATHA_CARDS;
    if (guide.kathaCardsJson) {
      try {
        parsedKathaCards = JSON.parse(guide.kathaCardsJson);
      } catch (err) { }
    }

    let parsedSamagriItems: SamagriItem[] = DEFAULT_SAMAGRI_ITEMS;
    if (guide.samagriItemsJson) {
      try {
        parsedSamagriItems = JSON.parse(guide.samagriItemsJson);
      } catch (err) { }
    }

    let parsedFastingOptions: FastingOption[] = DEFAULT_FASTING_OPTIONS;
    if (guide.fastingOptionsJson) {
      try {
        parsedFastingOptions = JSON.parse(guide.fastingOptionsJson);
      } catch (err) { }
    }

    let parsedMythsItems: MythItem[] = DEFAULT_MYTHS_ITEMS;
    if (guide.mythsItemsJson) {
      try {
        parsedMythsItems = JSON.parse(guide.mythsItemsJson);
      } catch (err) { }
    }

    let parsedVidhiDays: VidhiDay[] = DEFAULT_VIDHI_DAYS;
    if (guide.vidhiDaysJson) {
      try {
        parsedVidhiDays = JSON.parse(guide.vidhiDaysJson);
      } catch (err) { }
    }

    setFormData({
      ...EMPTY_FORM_DATA,
      title: guide.title || guide.guideTitle || '',
      slug: guide.slug || '',
      status: guide.status || 'DRAFT',

      sectionLabel: guide.sectionLabel || '',
      category: guide.category || '',
      rating: guide.rating || '',
      classification: guide.classification || '',
      guideTitle: guide.guideTitle || guide.title || '',
      guideSubtitle: guide.guideSubtitle || '',
      festivalName: guide.festivalName || '',
      panchangLocation: guide.panchangLocation || '',

      primaryButtonText: guide.primaryButtonText || '',
      primaryButtonAction: guide.primaryButtonAction || '',
      primaryButtonTarget: guide.primaryButtonTarget || '',
      secondaryButtonText: guide.secondaryButtonText || '',
      secondaryButtonAction: guide.secondaryButtonAction || '',
      secondaryButtonTarget: guide.secondaryButtonTarget || '',
      thirdButtonText: guide.thirdButtonText || '',
      thirdButtonAction: guide.thirdButtonAction || '',
      thirdButtonTarget: guide.thirdButtonTarget || '',

      sotSectionHeading: guide.sotSectionHeading || '',
      sotButtonText: guide.sotButtonText || '',
      sotButtonAction: guide.sotButtonAction || '',
      sotButtonTarget: guide.sotButtonTarget || '',
      sotPracticeLabel: guide.sotPracticeLabel || '',
      sotPracticeTitle: guide.sotPracticeTitle || '',
      sotPracticeCategory: guide.sotPracticeCategory || '',
      sotPracticeRating: guide.sotPracticeRating || '',
      sotPracticeClassification: guide.sotPracticeClassification || '',
      sotScripturalSource: guide.sotScripturalSource || '',
      sotParentScripture: guide.sotParentScripture || '',
      sotSourceReference: guide.sotSourceReference || '',
      sotSourceUrl: guide.sotSourceUrl || '',
      sotSourceNotes: guide.sotSourceNotes || '',
      sotSummaryLabel: guide.sotSummaryLabel || '',
      sotCorePracticesCount: guide.sotCorePracticesCount ?? 0,
      sotScripturalElementsCount: guide.sotScripturalElementsCount ?? 0,
      sotRegionalCustomsCount: guide.sotRegionalCustomsCount ?? 0,
      sotCorrectionsCount: guide.sotCorrectionsCount ?? 0,

      storyTitle: guide.storyTitle || '',
      storyIntroduction: guide.storyIntroduction || '',
      storySubsectionTitle: guide.storySubsectionTitle || '',
      storyContent: guide.storyContent || '',
      storyPracticeCategory: guide.storyPracticeCategory || '',
      storyPracticeRating: guide.storyPracticeRating || '',
      storyPracticeClassification: guide.storyPracticeClassification || '',
      storyScripturalSource: guide.storyScripturalSource || '',
      storyContinuation: guide.storyContinuation || '',
      storyImage: guide.storyImage || '',
      storyImageAltText: guide.storyImageAltText || '',
      storyImageCaption: guide.storyImageCaption || '',
      storyImageCredit: guide.storyImageCredit || '',
      storyImageSource: guide.storyImageSource || '',

      sankalpaTitle: guide.sankalpaTitle || '',
      sankalpaSubtitle: guide.sankalpaSubtitle || '',
      sankalpaInstruction: guide.sankalpaInstruction || '',
      sankalpaText: guide.sankalpaText || '',
      sankalpaMeaning: guide.sankalpaMeaning || '',
      sankalpaExplanation: guide.sankalpaExplanation || '',
      sankalpaCards: parsedCards,
      sankalpaNoteHeading: guide.sankalpaNoteHeading || '',
      sankalpaNoteContent: guide.sankalpaNoteContent || '',
      sankalpaImage: guide.sankalpaImage || '',

      vidhiDays: parsedVidhiDays,

      // Vrat Katha Section
      kathaTitle: guide.kathaTitle || '',
      kathaSubtitle: guide.kathaSubtitle || '',
      kathaScripturalReference: guide.kathaScripturalReference || '',
      kathaHeadline: guide.kathaHeadline || '',
      kathaIntroduction: guide.kathaIntroduction || '',
      kathaCards: parsedKathaCards,
      kathaSupportingExplanation: guide.kathaSupportingExplanation || '',
      kathaAudio: guide.kathaAudio || '',
      kathaAudioButtonText: guide.kathaAudioButtonText || '',
      kathaAudioDuration: guide.kathaAudioDuration || '',
      kathaFullKathaButtonText: guide.kathaFullKathaButtonText || '',
      kathaFullKathaLink: guide.kathaFullKathaLink || '',
      kathaImage: guide.kathaImage || '',
      kathaImageAltText: guide.kathaImageAltText || '',
      kathaImageCaption: guide.kathaImageCaption || '',

      // Durga Ashtami and Maha Navami Context
      festivalContextTitle: guide.festivalContextTitle || '',
      festivalContextIntroduction: guide.festivalContextIntroduction || '',
      festivalContextDetails: guide.festivalContextDetails || '',
      festivalPracticeCategory: guide.festivalPracticeCategory || '',
      festivalPracticeRating: guide.festivalPracticeRating || '',
      festivalClassification: guide.festivalClassification || '',
      sandhiPujaInformation: guide.sandhiPujaInformation || '',

      // Samagri Section
      samagriTitle: guide.samagriTitle || '',
      samagriSubtitle: guide.samagriSubtitle || '',
      samagriItems: parsedSamagriItems,
      samagriAudio: guide.samagriAudio || '',
      samagriAudioButtonText: guide.samagriAudioButtonText || '',
      samagriAudioDuration: guide.samagriAudioDuration || '',

      // Fasting Section
      fastingTitle: guide.fastingTitle || '',
      fastingSubtitle: guide.fastingSubtitle || '',
      fastingOptions: parsedFastingOptions,
      fastingGuidanceHeading: guide.fastingGuidanceHeading || '',
      fastingGuidanceContent: guide.fastingGuidanceContent || '',

      // Myths & Corrections Section
      mythsTitle: guide.mythsTitle || '',
      mythsSubtitle: guide.mythsSubtitle || '',
      mythsItems: parsedMythsItems,
    });
    setActiveVidhiDayIndex(0);
    setActiveTab('basic');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Save (Create or Update) Ritual Guide.
  //
  // IMPORTANT:
  // The CMS form is section-based and all section fields are intentionally optional.
  // The database still contains a few legacy non-null RitualGuide columns
  // (introText, sankalpaBody, sankalpaQuote, fastOptions, fastNote, kathaTitle,
  // kathaBody, etc.). We always provide safe compatibility values for those
  // columns here so an empty section can never cause a 400/500 save failure.
  const handleSaveGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Never allow an invalid/empty core record to reach the API.
    const clean = (value: unknown, fallback = ''): string => {
      if (typeof value !== 'string') return fallback;
      const trimmed = value.trim();
      return trimmed || fallback;
    };

    const toJson = (value: unknown): string => {
      try {
        return JSON.stringify(value ?? []);
      } catch {
        return '[]';
      }
    };

    const title = clean(
      formData.title || formData.guideTitle,
      'Untitled Ritual Guide'
    );

    const slugBase = clean(
      formData.slug || formData.guideTitle || formData.title,
      'untitled-ritual-guide'
    )
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const slug = slugBase || 'untitled-ritual-guide';

    // Prisma ContentStatus only supports DRAFT/PUBLISHED.
    const status =
      formData.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';

    // Legacy DB compatibility fields.
    // These are NOT additional CMS requirements; they are derived from the
    // corresponding section content when available, otherwise safe defaults.
    const introText = clean(
      formData.storyIntroduction ||
      formData.storyContent ||
      formData.guideSubtitle ||
      formData.guideTitle ||
      formData.title,
      'Ritual Guide'
    );

    const sankalpaBody = clean(
      formData.sankalpaText ||
      formData.sankalpaExplanation ||
      formData.sankalpaMeaning ||
      formData.sankalpaInstruction,
      'Sankalpa is performed with a sincere intention.'
    );

    const sankalpaQuote = clean(
      formData.sankalpaNoteContent ||
      formData.sankalpaNoteHeading ||
      formData.sankalpaInstruction,
      'Perform the sankalpa with sincere intention.'
    );

    const fastNote = clean(
      formData.fastingGuidanceContent ||
      formData.fastingGuidanceHeading ||
      formData.fastingSubtitle,
      'Choose a fasting practice according to your capacity and tradition.'
    );

    const kathaTitle = clean(formData.kathaTitle, 'Vrat Katha');

    const kathaBody = clean(
      formData.kathaIntroduction ||
      formData.kathaSupportingExplanation ||
      formData.kathaSubtitle,
      'Vrat Katha content.'
    );

    const payload = {
      // Core fields
      ...formData,
      title,
      slug,
      status,

      // Never send an invalid/blank category to the required DB column.
      category: clean(formData.category, 'General'),

      // Legacy required DB columns kept compatible with the new section-based CMS.
      introText,
      sankalpaBody,
      sankalpaQuote,
      fastOptions: formData.fastingOptions || [],
      fastNote,
      kathaTitle,
      kathaBody,

      // Section JSON fields.
      sankalpaDetailsJson: toJson(formData.sankalpaCards),
      kathaCardsJson: toJson(formData.kathaCards),
      samagriItemsJson: toJson(formData.samagriItems),
      fastingOptionsJson: toJson(formData.fastingOptions),
      mythsItemsJson: toJson(formData.mythsItems),
      vidhiDaysJson: toJson(formData.vidhiDays),
    };

    setFormLoading(true);

    try {
      const url = editingId
        ? `/api/admin/ritual-guides/${editingId}`
        : '/api/admin/ritual-guides';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json()
        : { success: false, error: await res.text() };

      if (!res.ok || !data.success) {
        const apiError =
          data?.error ||
          data?.message ||
          `Failed to save Ritual Guide (${res.status}).`;

        console.error('Ritual Guide save failed:', {
          status: res.status,
          method,
          url,
          error: apiError,
        });

        setFormError(apiError);
        return;
      }

      setSuccessMessage(
        editingId
          ? 'Ritual Guide updated successfully!'
          : 'New Ritual Guide created successfully!'
      );
      setIsModalOpen(false);
      fetchGuides();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      console.error('Ritual Guide save error:', err);
      setFormError(
        err instanceof Error
          ? err.message
          : 'Unable to save Ritual Guide. Please try again.'
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Ritual Guide
  const handleDeleteGuide = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/ritual-guides/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('Ritual Guide deleted successfully.');
        setDeleteId(null);
        fetchGuides();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const activeDay = formData.vidhiDays[activeVidhiDayIndex] || formData.vidhiDays[0];

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

  const TABS_CONFIG: { key: FormTab; label: string }[] = [
    { key: 'basic', label: '1. Basic Info & Banner' },
    { key: 'sot', label: '2. Source of Truth' },
    { key: 'story', label: '3. Story' },
    { key: 'sankalpa', label: '4. Sankalpa' },
    { key: 'vidhi', label: '5. Vidhi (Steps)' },
    { key: 'katha', label: '6. Katha / Narrative' },
    { key: 'samagri', label: '7. Samagri Checklist' },
    { key: 'fasting', label: '8. Fasting Rules' },
    { key: 'myths', label: '9. Myths & Corrections' },
    { key: 'related', label: '10. Related Content' },
    { key: 'services', label: '11. Services & CTAs' },
    { key: 'seo', label: '12. SEO & Publishing' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", display: 'flex' }}>
      <AdminSidebar userEmail={userEmail} userRole="SUPER_ADMIN" />

      {/* MAIN CMS CONTENT */}
      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif", fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Ritual Guides CMS
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
              Section-wise Tab Editor · Banner, Source of Truth, Story, Sankalpa, Vidhi, Vrat Katha, Samagri, Fasting &amp; Myths.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={openCreateModal}
              style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(222, 27, 89, 0.2)' }}
            >
              + New Ritual Guide
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
              placeholder="Search by title, myths, fasting options, samagri..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
            />
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
              {/* ARCHIVED is not supported by the current RitualGuide ContentStatus enum. */}
            </select>
          </div>
        </div>

        {/* LISTING TABLE CARD */}
        {loading ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
            Loading Ritual Guides...
          </div>
        ) : guides.length === 0 ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>No Ritual Guides Found</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>Create your first Ritual Guide entry with tab-based section editing.</p>
            <button
              type="button"
              onClick={openCreateModal}
              style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              + Add Ritual Guide
            </button>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEAE4', color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>GUIDE TITLE</th>
                  <th style={{ padding: '14px 20px' }}>SECTIONS STATUS</th>
                  <th style={{ padding: '14px 20px' }}>CATEGORY</th>
                  <th style={{ padding: '14px 20px' }}>STATUS</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {guides.map((guide) => (
                  <tr key={guide.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px', fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif" }}>
                        {guide.guideTitle || guide.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                        Slug: /{guide.slug}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#FFF8E6', color: '#A07800', border: '1px solid #EFE0B8', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>📌 Banner</span>
                        <span style={{ background: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>📜 Source</span>
                        <span style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>📖 Story</span>
                        <span style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>🪔 Sankalpa</span>
                        <span style={{ background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>🕯️ Vidhi</span>
                        <span style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>📜 Vrat Katha</span>
                        <span style={{ background: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>🏺 Samagri</span>
                        <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>🥗 Fasting</span>
                        <span style={{ background: '#FFF1F2', color: '#BE123C', border: '1px solid #FECDD3', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>💡 Myths</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#4B5563', fontSize: '13px' }}>
                      <strong>{guide.category || '—'}</strong> · {guide.rating || '—'}
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
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(guide)}
                          style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #D1D5DB', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          ✏ Edit Guide
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

      {/* RITUAL GUIDE TAB-BASED FORM MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '980px', maxHeight: '92vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #EFEAE4' }}>

            {/* MODAL TOP HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: '#F3F4F6', color: '#374151', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                >
                  ←
                </button>
                <div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {editingId ? 'Edit Ritual Guide' : 'Create Ritual Guide'}
                  </h2>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                    Compose detail-oriented scriptures and verify content properties.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  style={{ background: '#FAFAFA', border: '1px solid #D1D5DB', color: '#374151', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, outline: 'none' }}
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  {/* ARCHIVED is not supported by the current RitualGuide ContentStatus enum. */}
                </select>

                <button
                  type="button"
                  onClick={(e) => handleSaveGuide(e)}
                  disabled={formLoading}
                  style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '9px 18px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: formLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(222, 27, 89, 0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ✓ {formLoading ? 'Saving...' : 'Save Guide'}
                </button>
              </div>
            </div>

            {/* ERROR NOTIFICATION */}
            {formError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' }}>
                ⚠️ {formError}
              </div>
            )}

            {/* HORIZONTAL SECTION TABS NAV */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', borderBottom: '2px solid #EFEAE4', marginBottom: '24px', paddingBottom: '2px', scrollbarWidth: 'none' }}>
              {TABS_CONFIG.map((t) => {
                const isActive = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '3px solid #DE1B59' : '3px solid transparent',
                      color: isActive ? '#DE1B59' : '#6B7280',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '13px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      marginBottom: '-2px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSaveGuide}>
              {/* ======================================================== */}
              {/* TAB 1: BASIC INFO & BANNER */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'basic' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # Basic Information &amp; Banner
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', background: '#FAFAFA', padding: '16px', borderRadius: '14px', border: '1px solid #F3F4F6' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Publication Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#374151', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="DRAFT">DRAFT (Unpublished)</option>
                      <option value="PUBLISHED">PUBLISHED (Visible)</option>
                      {/* ARCHIVED is not supported by the current RitualGuide ContentStatus enum. */}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Slug Identifier</label>
                    <input
                      type="text"
                      placeholder="my-ritual-guide-slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontFamily: 'monospace', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Section Label</label>
                  <input
                    type="text"
                    value={formData.sectionLabel}
                    onChange={(e) => setFormData({ ...formData, sectionLabel: e.target.value })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        color: '#374151',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    >
                      <option value="">Select category…</option>
                      <option value="Beginner's Guides">Beginner's Guides</option>
                      <option value="Festive Pujans">Festive Pujans</option>
                      <option value="All-Year Pujans">All-Year Pujans</option>
                      <option value="Sanskar & Life Events">Sanskar & Life Events</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Rating</label>
                    <input
                      type="text"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Classification</label>
                    <input
                      type="text"
                      value={formData.classification}
                      onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                      style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Guide Title</label>
                  <textarea
                    rows={2}
                    value={formData.guideTitle}
                    onChange={(e) => handleGuideTitleChange(e.target.value)}
                    style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', fontFamily: 'Georgia, serif' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Guide Subtitle</label>
                  <textarea
                    rows={2}
                    value={formData.guideSubtitle}
                    onChange={(e) => setFormData({ ...formData, guideSubtitle: e.target.value })}
                    style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                  />
                </div>

                {/* Panchang Config */}
                <div style={{ background: '#FFFDF9', border: '1px solid #F3EAD8', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#B45309', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    📅 Panchang Configuration
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Festival Name</label>
                      <input
                        type="text"
                        value={formData.festivalName}
                        onChange={(e) => setFormData({ ...formData, festivalName: e.target.value })}
                        style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Panchang Location</label>
                      <input
                        type="text"
                        value={formData.panchangLocation}
                        onChange={(e) => setFormData({ ...formData, panchangLocation: e.target.value })}
                        style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Banner Actions */}
                <div style={{ background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: '14px', padding: '16px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#374151', margin: '0 0 10px', textTransform: 'uppercase' }}>Banner Buttons &amp; Actions</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Primary Button Text</label>
                      <input type="text" value={formData.primaryButtonText} onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Secondary Button Text</label>
                      <input type="text" value={formData.secondaryButtonText} onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Third Button Text</label>
                      <input type="text" value={formData.thirdButtonText} onChange={(e) => setFormData({ ...formData, thirdButtonText: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* TAB 2: SOURCE OF TRUTH */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'sot' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # Source of Truth
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Section Heading</label>
                  <input
                    type="text"
                    value={formData.sotSectionHeading}
                    onChange={(e) => setFormData({ ...formData, sotSectionHeading: e.target.value })}
                    style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Source Button Text</label>
                    <input
                      type="text"
                      value={formData.sotButtonText}
                      onChange={(e) => setFormData({ ...formData, sotButtonText: e.target.value })}
                      style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Source Button Action</label>
                    <input
                      type="text"
                      value={formData.sotButtonAction}
                      onChange={(e) => setFormData({ ...formData, sotButtonAction: e.target.value })}
                      style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Source Button Target</label>
                    <input
                      type="text"
                      value={formData.sotButtonTarget}
                      onChange={(e) => setFormData({ ...formData, sotButtonTarget: e.target.value })}
                      style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Practice Title</label>
                  <textarea
                    rows={2}
                    value={formData.sotPracticeTitle}
                    onChange={(e) => setFormData({ ...formData, sotPracticeTitle: e.target.value })}
                    style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Scriptural Source</label>
                    <input
                      type="text"
                      value={formData.sotScripturalSource}
                      onChange={(e) => setFormData({ ...formData, sotScripturalSource: e.target.value })}
                      style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Parent Scripture</label>
                    <input
                      type="text"
                      value={formData.sotParentScripture}
                      onChange={(e) => setFormData({ ...formData, sotParentScripture: e.target.value })}
                      style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                {/* Summary Counts */}
                <div style={{ background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: '14px', padding: '16px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#374151', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Summary Counts
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Core Practices</label>
                      <input
                        type="number"
                        value={formData.sotCorePracticesCount}
                        onChange={(e) => setFormData({ ...formData, sotCorePracticesCount: Number(e.target.value) })}
                        style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Scriptural Elements</label>
                      <input
                        type="number"
                        value={formData.sotScripturalElementsCount}
                        onChange={(e) => setFormData({ ...formData, sotScripturalElementsCount: Number(e.target.value) })}
                        style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Regional Customs</label>
                      <input
                        type="number"
                        value={formData.sotRegionalCustomsCount}
                        onChange={(e) => setFormData({ ...formData, sotRegionalCustomsCount: Number(e.target.value) })}
                        style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Corrections</label>
                      <input
                        type="number"
                        value={formData.sotCorrectionsCount}
                        onChange={(e) => setFormData({ ...formData, sotCorrectionsCount: Number(e.target.value) })}
                        style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* TAB 3: STORY SECTION */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'story' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # Story Section
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Story Title</label>
                  <input
                    type="text"
                    value={formData.storyTitle}
                    onChange={(e) => setFormData({ ...formData, storyTitle: e.target.value })}
                    style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', fontFamily: 'Georgia, serif' }}
                  />
                </div>

                <RichTextEditor
                  label="Story Introduction"
                  value={formData.storyIntroduction}
                  onChange={(html) => setFormData({ ...formData, storyIntroduction: html })}
                  minHeight="80px"
                />

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Story Subsection Title</label>
                  <input
                    type="text"
                    value={formData.storySubsectionTitle}
                    onChange={(e) => setFormData({ ...formData, storySubsectionTitle: e.target.value })}
                    style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                  />
                </div>

                <RichTextEditor
                  label="Story Content"
                  value={formData.storyContent}
                  onChange={(html) => setFormData({ ...formData, storyContent: html })}
                  minHeight="120px"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Practice Category</label>
                    <input
                      type="text"
                      value={formData.storyPracticeCategory}
                      onChange={(e) => setFormData({ ...formData, storyPracticeCategory: e.target.value })}
                      style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Practice Rating</label>
                    <input
                      type="text"
                      value={formData.storyPracticeRating}
                      onChange={(e) => setFormData({ ...formData, storyPracticeRating: e.target.value })}
                      style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Practice Classification</label>
                    <input
                      type="text"
                      value={formData.storyPracticeClassification}
                      onChange={(e) => setFormData({ ...formData, storyPracticeClassification: e.target.value })}
                      style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <RichTextEditor
                  label="Story Continuation"
                  value={formData.storyContinuation}
                  onChange={(html) => setFormData({ ...formData, storyContinuation: html })}
                  minHeight="90px"
                />

                {/* Story Image */}
                <div style={{ background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: '14px', padding: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Story Image (Upload or URL)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '14px', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#E5E7EB', border: '1px solid #D1D5DB' }}>
                      {formData.storyImage && <img src={formData.storyImage} alt="Story Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload('storyImage', e)} style={{ marginBottom: '6px', fontSize: '12px' }} />
                      <input type="text" value={formData.storyImage} onChange={(e) => setFormData({ ...formData, storyImage: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }} />
                    </div>
                  </div>
                  <input type="text" placeholder="Alt text..." value={formData.storyImageAltText} onChange={(e) => setFormData({ ...formData, storyImageAltText: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '10px' }} />
                  <RichTextEditor label="Image Caption" value={formData.storyImageCaption} onChange={(html) => setFormData({ ...formData, storyImageCaption: html })} minHeight="60px" />
                </div>
              </div>

              {/* ======================================================== */}
              {/* TAB 4: SANKALPA SECTION */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'sankalpa' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # Sankalpa Section
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Sankalpa Title</label>
                  <input
                    type="text"
                    value={formData.sankalpaTitle}
                    onChange={(e) => setFormData({ ...formData, sankalpaTitle: e.target.value })}
                    style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', fontFamily: 'Georgia, serif' }}
                  />
                </div>

                <RichTextEditor
                  label="Sankalpa Subtitle"
                  value={formData.sankalpaSubtitle}
                  onChange={(html) => setFormData({ ...formData, sankalpaSubtitle: html })}
                  minHeight="60px"
                />

                <RichTextEditor
                  label="Sankalpa Instruction"
                  value={formData.sankalpaInstruction}
                  onChange={(html) => setFormData({ ...formData, sankalpaInstruction: html })}
                  minHeight="60px"
                />

                <RichTextEditor
                  label="Sankalpa Text (Sanskrit)"
                  value={formData.sankalpaText}
                  onChange={(html) => setFormData({ ...formData, sankalpaText: html })}
                  minHeight="80px"
                />

                <RichTextEditor
                  label="Sankalpa Meaning"
                  value={formData.sankalpaMeaning}
                  onChange={(html) => setFormData({ ...formData, sankalpaMeaning: html })}
                  minHeight="60px"
                />

                <RichTextEditor
                  label="Sankalpa Explanation"
                  value={formData.sankalpaExplanation}
                  onChange={(html) => setFormData({ ...formData, sankalpaExplanation: html })}
                  minHeight="80px"
                />

                {/* Sankalpa Details Cards Manager */}
                <div style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'uppercase' }}>
                      Sankalpa Details Cards ({formData.sankalpaCards.length})
                    </h4>
                    <button type="button" onClick={addSankalpaCard} style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                      + Add Card
                    </button>
                  </div>
                  {formData.sankalpaCards.map((card, idx) => (
                    <div key={card.id || idx} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59' }}>CARD #{idx + 1}</span>
                        <button type="button" onClick={() => removeSankalpaCard(idx)} style={{ color: '#991B1B', border: 'none', background: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>✕ Remove</button>
                      </div>
                      <input type="text" value={card.cardTitle} onChange={(e) => updateSankalpaCard(idx, 'cardTitle', e.target.value)} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }} />
                      <RichTextEditor label="Description" value={card.cardDescription} onChange={(html) => updateSankalpaCard(idx, 'cardDescription', html)} minHeight="60px" />
                    </div>
                  ))}
                </div>

                <RichTextEditor
                  label="Sankalpa Note Heading"
                  value={formData.sankalpaNoteHeading}
                  onChange={(html) => setFormData({ ...formData, sankalpaNoteHeading: html })}
                  minHeight="60px"
                />

                <RichTextEditor
                  label="Sankalpa Note Content"
                  value={formData.sankalpaNoteContent}
                  onChange={(html) => setFormData({ ...formData, sankalpaNoteContent: html })}
                  minHeight="70px"
                />
              </div>

              {/* ======================================================== */}
              {/* TAB 5: VIDHI SECTION */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'vidhi' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # Vidhi Section (Day-wise Structure)
                </h3>

                {/* DAY SELECTOR TABS */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {formData.vidhiDays.map((day, idx) => (
                    <button
                      key={day.id || idx}
                      type="button"
                      onClick={() => setActiveVidhiDayIndex(idx)}
                      style={{
                        background: activeVidhiDayIndex === idx ? '#DE1B59' : '#FFFFFF',
                        color: activeVidhiDayIndex === idx ? '#FFFFFF' : '#374151',
                        border: activeVidhiDayIndex === idx ? 'none' : '1px solid #D1D5DB',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      Day {day.dayNumber}: {day.dayTitle || 'Untitled'}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={addVidhiDay}
                    style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add Day
                  </button>

                  {formData.vidhiDays.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVidhiDay(activeVidhiDayIndex)}
                      style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}
                    >
                      🗑 Remove Day {activeDay?.dayNumber}
                    </button>
                  )}
                </div>

                {/* ACTIVE DAY EDITOR */}
                {activeDay && (
                  <div style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Day Number</label>
                        <input
                          type="number"
                          value={activeDay.dayNumber}
                          onChange={(e) => updateActiveVidhiDay('dayNumber', Number(e.target.value))}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Day Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Ghatasthapana"
                          value={activeDay.dayTitle}
                          onChange={(e) => updateActiveVidhiDay('dayTitle', e.target.value)}
                          style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }}
                        />
                      </div>
                    </div>

                    <RichTextEditor
                      label="Day Description"
                      value={activeDay.dayDescription}
                      onChange={(html) => updateActiveVidhiDay('dayDescription', html)}
                      minHeight="70px"
                    />

                    {/* Muhurat Sub-section */}
                    <div style={{ background: '#FFFDF9', border: '1px solid #F3EAD8', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#B45309', margin: '0 0 10px', textTransform: 'uppercase' }}>
                        Muhurat Information
                      </h4>
                      <input
                        type="text"
                        value={activeDay.muhuratLabel}
                        onChange={(e) => updateActiveVidhiDay('muhuratLabel', e.target.value)}
                        style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '8px' }}
                      />
                      <RichTextEditor
                        label="Muhurat Details"
                        value={activeDay.muhuratInformation}
                        onChange={(html) => updateActiveVidhiDay('muhuratInformation', html)}
                        minHeight="70px"
                      />
                    </div>

                    {/* Vidhi Steps */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'uppercase' }}>
                          Vidhi Ritual Steps ({activeDay.steps.length})
                        </h4>
                        <button
                          type="button"
                          onClick={addVidhiStep}
                          style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          + Add Step
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {activeDay.steps.map((step, sIdx) => (
                          <div key={step.id || sIdx} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '10px', padding: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59' }}>Step #{step.stepNumber}</span>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button type="button" onClick={() => moveVidhiStep(sIdx, 'up')} disabled={sIdx === 0} style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▲</button>
                                <button type="button" onClick={() => moveVidhiStep(sIdx, 'down')} disabled={sIdx === activeDay.steps.length - 1} style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▼</button>
                                <button type="button" onClick={() => removeVidhiStep(sIdx)} style={{ color: '#991B1B', border: 'none', background: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}>✕</button>
                              </div>
                            </div>
                            <RichTextEditor label={`Step ${step.stepNumber} Description`} value={step.stepDescription} onChange={(html) => updateVidhiStep(sIdx, 'stepDescription', html)} minHeight="60px" />
                            <input
                              type="text"
                              placeholder="Labels (e.g. PRATHA, SHASTRA)..."
                              value={step.stepLabels ? step.stepLabels.join(', ') : ''}
                              onChange={(e) => {
                                const lbls = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                                updateVidhiStep(sIdx, 'stepLabels', lbls);
                              }}
                              style={{ width: '100%', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: '6px', fontSize: '11px' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Day Mantra & Audio */}
                    <div style={{ background: '#111827', color: '#FFFFFF', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#DE1B59', margin: '0 0 10px', textTransform: 'uppercase' }}>Day Mantra &amp; Audio</h4>
                      <input type="text" value={activeDay.mantraLabel} onChange={(e) => updateActiveVidhiDay('mantraLabel', e.target.value)} style={{ width: '100%', background: '#1F2937', border: '1px solid #374151', color: '#FFFFFF', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', marginBottom: '8px' }} />
                      <RichTextEditor label="Mantra Text (Sanskrit)" value={activeDay.mantraText} onChange={(html) => updateActiveVidhiDay('mantraText', html)} minHeight="60px" />
                      <RichTextEditor label="Transliteration" value={activeDay.mantraTransliteration} onChange={(html) => updateActiveVidhiDay('mantraTransliteration', html)} minHeight="50px" />

                      {/* Mantra Audio — file upload (stored as base64, saved to DB on Save) */}
                      <div style={{ marginTop: '10px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#D1D5DB', marginBottom: '4px' }}>Mantra Audio (Upload File)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleMantraAudioUpload}
                            style={{ fontSize: '12px', color: '#FFFFFF' }}
                          />
                          {activeDay.mantraAudio && (
                            <button
                              type="button"
                              onClick={removeMantraAudio}
                              style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              ✕ Remove Audio
                            </button>
                          )}
                        </div>
                        {activeDay.mantraAudio && (
                          <audio controls src={activeDay.mantraAudio} style={{ width: '100%', marginTop: '8px', height: '34px' }} />
                        )}
                      </div>
                    </div>

                    {/* Japa Audio */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Japa Audio URL</label>
                      <input type="text" placeholder="https://example.com/audio/japa-108.mp3" value={activeDay.japaAudio || ''} onChange={(e) => updateActiveVidhiDay('japaAudio', e.target.value)} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }} />
                    </div>

                    {/* Day Explanation */}
                    <div>
                      <RichTextEditor label="Day Explanation" value={activeDay.dayExplanation || ''} onChange={(html) => updateActiveVidhiDay('dayExplanation', html)} minHeight="60px" />
                      <input type="text" placeholder="Explanation labels (e.g. PRATHA)..." value={activeDay.explanationLabels ? activeDay.explanationLabels.join(', ') : ''} onChange={(e) => { const lbls = e.target.value.split(',').map((s) => s.trim()).filter(Boolean); updateActiveVidhiDay('explanationLabels', lbls); }} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', marginTop: '6px' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* ======================================================== */}
              {/* TAB 6: THE VRAT KATHA */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'katha' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # Vrat Katha Section
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Vrat Katha Title</label>
                    <input type="text" value={formData.kathaTitle} onChange={(e) => setFormData({ ...formData, kathaTitle: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Scriptural Reference</label>
                    <input type="text" value={formData.kathaScripturalReference} onChange={(e) => setFormData({ ...formData, kathaScripturalReference: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px' }} />
                  </div>
                </div>

                <RichTextEditor label="Vrat Katha Subtitle" value={formData.kathaSubtitle} onChange={(html) => setFormData({ ...formData, kathaSubtitle: html })} minHeight="60px" />

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Katha Headline</label>
                  <input type="text" value={formData.kathaHeadline} onChange={(e) => setFormData({ ...formData, kathaHeadline: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }} />
                </div>

                <RichTextEditor label="Katha Introduction" value={formData.kathaIntroduction} onChange={(html) => setFormData({ ...formData, kathaIntroduction: html })} minHeight="80px" />

                {/* Repeatable Story Cards Manager */}
                <div style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '18px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Repeatable Katha Story Cards ({formData.kathaCards.length})
                    </h4>
                    <button type="button" onClick={addKathaCard} style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                      + Add Story Card
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {formData.kathaCards.map((card, cIdx) => (
                      <div key={card.id || cIdx} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '12px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59' }}>
                            STORY CARD #{card.cardNumber || cIdx + 1}
                          </span>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button type="button" onClick={() => moveKathaCard(cIdx, 'up')} disabled={cIdx === 0} style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▲</button>
                            <button type="button" onClick={() => moveKathaCard(cIdx, 'down')} disabled={cIdx === formData.kathaCards.length - 1} style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▼</button>
                            <button type="button" onClick={() => removeKathaCard(cIdx)} style={{ color: '#991B1B', border: 'none', background: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>✕ Delete</button>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px', marginBottom: '8px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Card Number</label>
                            <input type="number" value={card.cardNumber} onChange={(e) => updateKathaCard(cIdx, 'cardNumber', Number(e.target.value))} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Card Title</label>
                            <input type="text" value={card.cardTitle} onChange={(e) => updateKathaCard(cIdx, 'cardTitle', e.target.value)} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }} />
                          </div>
                        </div>

                        <RichTextEditor label="Card Description" value={card.cardDescription} onChange={(html) => updateKathaCard(cIdx, 'cardDescription', html)} minHeight="60px" />
                      </div>
                    ))}
                  </div>
                </div>

                <RichTextEditor label="Katha Supporting Explanation" value={formData.kathaSupportingExplanation} onChange={(html) => setFormData({ ...formData, kathaSupportingExplanation: html })} minHeight="80px" />

                {/* Katha Audio Section */}
                <div style={{ background: '#FFFDF9', border: '1px solid #F3EAD8', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#B45309', margin: '0 0 10px', textTransform: 'uppercase' }}>🎧 Vrat Katha Audio</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Audio URL / Upload</label>
                      <input type="text" placeholder="https://example.com/audio/katha.mp3" value={formData.kathaAudio || ''} onChange={(e) => setFormData({ ...formData, kathaAudio: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Audio Button Text</label>
                      <input type="text" value={formData.kathaAudioButtonText} onChange={(e) => setFormData({ ...formData, kathaAudioButtonText: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Audio Duration</label>
                      <input type="text" value={formData.kathaAudioDuration} onChange={(e) => setFormData({ ...formData, kathaAudioDuration: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }} />
                    </div>
                  </div>
                </div>

                {/* Full Katha CTA */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Full Katha Button Text</label>
                    <input type="text" value={formData.kathaFullKathaButtonText} onChange={(e) => setFormData({ ...formData, kathaFullKathaButtonText: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Full Katha Link</label>
                    <input type="text" value={formData.kathaFullKathaLink} onChange={(e) => setFormData({ ...formData, kathaFullKathaLink: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px' }} />
                  </div>
                </div>

                {/* Katha Image */}
                <div style={{ background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Katha Image (Upload or URL)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '14px', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#E5E7EB', border: '1px solid #D1D5DB' }}>
                      {formData.kathaImage && <img src={formData.kathaImage} alt="Katha Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload('kathaImage', e)} style={{ marginBottom: '6px', fontSize: '12px' }} />
                      <input type="text" value={formData.kathaImage} onChange={(e) => setFormData({ ...formData, kathaImage: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }} />
                    </div>
                  </div>
                  <input type="text" placeholder="Alt text..." value={formData.kathaImageAltText} onChange={(e) => setFormData({ ...formData, kathaImageAltText: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '10px' }} />
                  <RichTextEditor label="Image Caption" value={formData.kathaImageCaption} onChange={(html) => setFormData({ ...formData, kathaImageCaption: html })} minHeight="60px" />
                </div>

                {/* Durga Ashtami & Maha Navami Context Subsection */}
                <div style={{ background: '#FDF2F5', border: '1px solid #FCE7F3', borderRadius: '16px', padding: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#DE1B59', margin: '0 0 12px', fontFamily: 'Georgia, serif' }}>
                    🌸 Festival Context (e.g. Durga Ashtami / Maha Navami)
                  </h4>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Festival Context Title</label>
                    <input type="text" value={formData.festivalContextTitle} onChange={(e) => setFormData({ ...formData, festivalContextTitle: e.target.value })} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700 }} />
                  </div>

                  <RichTextEditor label="Festival Context Introduction" value={formData.festivalContextIntroduction} onChange={(html) => setFormData({ ...formData, festivalContextIntroduction: html })} minHeight="70px" />
                  <RichTextEditor label="Festival Context Details" value={formData.festivalContextDetails} onChange={(html) => setFormData({ ...formData, festivalContextDetails: html })} minHeight="80px" />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', margin: '12px 0' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>Practice Category</label>
                      <input type="text" value={formData.festivalPracticeCategory} onChange={(e) => setFormData({ ...formData, festivalPracticeCategory: e.target.value })} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '6px', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>Practice Rating</label>
                      <input type="text" value={formData.festivalPracticeRating} onChange={(e) => setFormData({ ...formData, festivalPracticeRating: e.target.value })} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '6px', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>Classification</label>
                      <input type="text" value={formData.festivalClassification} onChange={(e) => setFormData({ ...formData, festivalClassification: e.target.value })} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '6px', fontSize: '12px' }} />
                    </div>
                  </div>

                  <RichTextEditor label="Sandhi Puja Information" value={formData.sandhiPujaInformation} onChange={(html) => setFormData({ ...formData, sandhiPujaInformation: html })} minHeight="70px" />
                </div>
              </div>

              {/* ======================================================== */}
              {/* TAB 7: SAMAGRI CHECKLIST */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'samagri' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # Samagri Section
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Samagri Title</label>
                  <input type="text" value={formData.samagriTitle} onChange={(e) => setFormData({ ...formData, samagriTitle: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: 700 }} />
                </div>

                <RichTextEditor label="Samagri Subtitle" value={formData.samagriSubtitle} onChange={(html) => setFormData({ ...formData, samagriSubtitle: html })} minHeight="60px" />

                {/* Repeatable Samagri Items Manager */}
                <div style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '18px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Repeatable Samagri Materials ({formData.samagriItems.length} Items)
                    </h4>
                    <button type="button" onClick={addSamagriItem} style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                      + Add Samagri Item
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {formData.samagriItems.map((item, sIdx) => (
                      <div key={item.id || sIdx} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '12px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59' }}>
                            ITEM #{item.itemOrder || sIdx + 1}: {item.itemName || 'Untitled'}
                          </span>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button type="button" onClick={() => moveSamagriItem(sIdx, 'up')} disabled={sIdx === 0} style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▲</button>
                            <button type="button" onClick={() => moveSamagriItem(sIdx, 'down')} disabled={sIdx === formData.samagriItems.length - 1} style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▼</button>
                            <button type="button" onClick={() => removeSamagriItem(sIdx)} style={{ color: '#991B1B', border: 'none', background: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>✕ Delete</button>
                          </div>
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Item Name</label>
                          <input type="text" value={item.itemName} onChange={(e) => updateSamagriItem(sIdx, 'itemName', e.target.value)} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }} />
                        </div>

                        <RichTextEditor label="Item Details" value={item.itemDetails} onChange={(html) => updateSamagriItem(sIdx, 'itemDetails', html)} minHeight="50px" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Samagri Audio Section */}
                <div style={{ background: '#FFFDF9', border: '1px solid #F3EAD8', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#B45309', margin: '0 0 10px', textTransform: 'uppercase' }}>🏺 Samagri Audio Guide</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 120px', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Audio URL / Upload</label>
                      <input type="text" placeholder="https://example.com/audio/samagri.mp3" value={formData.samagriAudio || ''} onChange={(e) => setFormData({ ...formData, samagriAudio: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Audio Button Text</label>
                      <input type="text" placeholder="Audio Label..." value={formData.samagriAudioButtonText || ''} onChange={(e) => setFormData({ ...formData, samagriAudioButtonText: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Audio Duration</label>
                      <input type="text" placeholder="e.g. 5 min..." value={formData.samagriAudioDuration || ''} onChange={(e) => setFormData({ ...formData, samagriAudioDuration: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* TAB 8: FASTING RULES */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'fasting' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # Fasting Section
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Fasting Title</label>
                  <input type="text" value={formData.fastingTitle} onChange={(e) => setFormData({ ...formData, fastingTitle: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: 700 }} />
                </div>

                <RichTextEditor label="Fasting Subtitle" value={formData.fastingSubtitle} onChange={(html) => setFormData({ ...formData, fastingSubtitle: html })} minHeight="60px" />

                {/* Repeatable Fasting Options Manager */}
                <div style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '18px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Repeatable Fasting Options ({formData.fastingOptions.length} Cards)
                    </h4>
                    <button type="button" onClick={addFastingOption} style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                      + Add Fasting Option
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {formData.fastingOptions.map((opt, fIdx) => (
                      <div key={opt.id || fIdx} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '12px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59' }}>
                            OPTION #{opt.displayOrder || fIdx + 1}: {opt.title || 'Untitled'}
                          </span>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button type="button" onClick={() => moveFastingOption(fIdx, 'up')} disabled={fIdx === 0} style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▲</button>
                            <button type="button" onClick={() => moveFastingOption(fIdx, 'down')} disabled={fIdx === formData.fastingOptions.length - 1} style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 6px', fontSize: '10px' }}>▼</button>
                            <button type="button" onClick={() => removeFastingOption(fIdx)} style={{ color: '#991B1B', border: 'none', background: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>✕ Delete</button>
                          </div>
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Option Title</label>
                          <input type="text" value={opt.title} onChange={(e) => updateFastingOption(fIdx, 'title', e.target.value)} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }} />
                        </div>

                        <RichTextEditor label="Option Description" value={opt.description} onChange={(html) => updateFastingOption(fIdx, 'description', html)} minHeight="60px" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fasting Guidance Block */}
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '16px', padding: '20px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#047857', margin: '0 0 12px', textTransform: 'uppercase' }}>
                    🥗 Fasting Guidance Block
                  </h4>

                  <RichTextEditor label="Fasting Guidance Heading" value={formData.fastingGuidanceHeading} onChange={(html) => setFormData({ ...formData, fastingGuidanceHeading: html })} minHeight="60px" />
                  <RichTextEditor label="Fasting Guidance Content" value={formData.fastingGuidanceContent} onChange={(html) => setFormData({ ...formData, fastingGuidanceContent: html })} minHeight="70px" />
                </div>
              </div>

              {/* ======================================================== */}
              {/* TAB 9: MYTHS & CORRECTIONS */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'myths' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # Myths &amp; Corrections Section
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Section Title</label>
                  <input type="text" value={formData.mythsTitle} onChange={(e) => setFormData({ ...formData, mythsTitle: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: 700 }} />
                </div>

                <RichTextEditor label="Section Subtitle" value={formData.mythsSubtitle} onChange={(html) => setFormData({ ...formData, mythsSubtitle: html })} minHeight="60px" />

                {/* Repeatable Myths & Facts Manager */}
                <div style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '18px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Repeatable Myths &amp; Facts ({formData.mythsItems.length} Entries)
                    </h4>
                    <button type="button" onClick={addMythItem} style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      + Add Myth &amp; Fact
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {formData.mythsItems.map((mItem, mIdx) => (
                      <div key={mItem.id || mIdx} style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#DE1B59' }}>
                            MYTH &amp; FACT #{mItem.displayOrder || mIdx + 1}
                          </span>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button type="button" onClick={() => moveMythItem(mIdx, 'up')} disabled={mIdx === 0} style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>▲ Move Up</button>
                            <button type="button" onClick={() => moveMythItem(mIdx, 'down')} disabled={mIdx === formData.mythsItems.length - 1} style={{ border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>▼ Move Down</button>
                            <button type="button" onClick={() => removeMythItem(mIdx)} style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>🗑 Delete Myth</button>
                          </div>
                        </div>

                        <RichTextEditor label="Myth Statement" value={mItem.mythStatement} onChange={(html) => updateMythItem(mIdx, 'mythStatement', html)} minHeight="60px" />

                        <div style={{ marginBottom: '10px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '2px' }}>Correction Label</label>
                          <input type="text" value={mItem.correctionLabel} onChange={(e) => updateMythItem(mIdx, 'correctionLabel', e.target.value)} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }} />
                        </div>

                        <RichTextEditor label="Correction Content" value={mItem.correctionContent} onChange={(html) => updateMythItem(mIdx, 'correctionContent', html)} minHeight="80px" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* TAB 10: RELATED CONTENT */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'related' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # Related Content
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Related Section Title</label>
                  <input type="text" value={formData.relatedTitle} onChange={(e) => setFormData({ ...formData, relatedTitle: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Related Subtitle</label>
                  <input type="text" value={formData.relatedSubtitle} onChange={(e) => setFormData({ ...formData, relatedSubtitle: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px' }} />
                </div>

                <RichTextEditor label="Related Guides &amp; Concepts" value={formData.relatedLinksText} onChange={(html) => setFormData({ ...formData, relatedLinksText: html })} minHeight="100px" />
              </div>

              {/* ======================================================== */}
              {/* TAB 11: SERVICES & CTAS */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'services' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # Services &amp; CTAs
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>CTA Section Title</label>
                  <input type="text" value={formData.servicesTitle} onChange={(e) => setFormData({ ...formData, servicesTitle: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>CTA Subtitle</label>
                  <input type="text" value={formData.servicesSubtitle} onChange={(e) => setFormData({ ...formData, servicesSubtitle: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Button Text</label>
                    <input type="text" value={formData.servicesButtonText} onChange={(e) => setFormData({ ...formData, servicesButtonText: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Target Booking URL</label>
                    <input type="text" value={formData.servicesTargetUrl} onChange={(e) => setFormData({ ...formData, servicesTargetUrl: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }} />
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* TAB 12: SEO & PUBLISHING */}
              {/* ======================================================== */}
              <div style={{ display: activeTab === 'seo' ? 'block' : 'none' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #EFEAE4' }}>
                  # SEO &amp; Publishing Settings
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Meta Title</label>
                  <input type="text" value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Meta Description</label>
                  <textarea rows={3} value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Keywords (comma-separated)</label>
                  <input type="text" value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} style={{ width: '100%', border: '1px solid #D1D5DB', padding: '10px 12px', borderRadius: '10px', fontSize: '13px' }} />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #F3F4F6', marginTop: '24px' }}>
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
                  {formLoading ? 'Saving...' : editingId ? 'Update Ritual Guide' : 'Save Ritual Guide'}
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
              Are you sure you want to delete this Ritual Guide entry? This action cannot be undone.
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

export default function RitualGuidesCmsPage() {
  return (
    <SessionProvider>
      <RitualGuidesCmsContent />
    </SessionProvider>
  );
}