import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withEditorAuth } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';
import { getInMemoryGuides, saveInMemoryGuide } from '@/lib/ritual-guides-store';

/**
 * GET /api/admin/ritual-guides
 * Listing endpoint with search and status filter (Requires EDITOR or ADMIN)
 */
export const GET = withEditorAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { guideTitle: { contains: search } },
        { slug: { contains: search } },
        { category: { contains: search } },
        { festivalName: { contains: search } },
        { sotScripturalSource: { contains: search } },
        { sotParentScripture: { contains: search } },
        { storyTitle: { contains: search } },
        { storyScripturalSource: { contains: search } },
        { sankalpaTitle: { contains: search } },
        { sankalpaText: { contains: search } },
        { vidhiDaysJson: { contains: search } },
      ];
    }

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    let guides: any[] = [];
    let isDbAvailable = false;
    try {
      guides = await prisma.ritualGuide.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
      });
      isDbAvailable = true;
    } catch (dbErr: any) {
      console.warn('[API Admin Ritual Guides GET] DB fetch warning:', dbErr?.message || dbErr);
    }

    // Only fallback to in-memory store if database is unreachable/failing
    if (!isDbAvailable) {
      let fallbackGuides = getInMemoryGuides();
      if (search) {
        const lowerSearch = search.toLowerCase();
        fallbackGuides = fallbackGuides.filter(
          (g) =>
            g.title?.toLowerCase().includes(lowerSearch) ||
            g.guideTitle?.toLowerCase().includes(lowerSearch) ||
            g.slug?.toLowerCase().includes(lowerSearch) ||
            g.category?.toLowerCase().includes(lowerSearch)
        );
      }
      if (status && status !== 'ALL') {
        fallbackGuides = fallbackGuides.filter((g: any) => g.status === status);
      }
      guides = fallbackGuides;
    }

    return NextResponse.json({
      success: true,
      count: guides.length,
      data: guides,
    });
  } catch (err: any) {
    console.error('[API Admin Ritual Guides GET] Error:', err);
    return NextResponse.json(
      { success: true, count: 0, data: [] },
      { status: 200 }
    );
  }
});

/**
 * POST /api/admin/ritual-guides
 * Create a new Ritual Guide entry with Banner, Source of Truth, Story, Sankalpa & Vidhi info (Requires EDITOR or ADMIN)
 */
export const POST = withEditorAuth(async (req) => {
  try {
    const body = await req.json();
    const {
      title,
      slug: rawSlug,
      status,

      // Banner Content
      sectionLabel,
      category,
      rating,
      classification,
      guideTitle,
      guideSubtitle,
      festivalName,
      panchangLocation,
      primaryButtonText,
      primaryButtonAction,
      primaryButtonTarget,
      secondaryButtonText,
      secondaryButtonAction,
      secondaryButtonTarget,
      thirdButtonText,
      thirdButtonAction,
      thirdButtonTarget,

      // Source of Truth
      sotSectionHeading,
      sotButtonText,
      sotButtonAction,
      sotButtonTarget,
      sotPracticeLabel,
      sotPracticeTitle,
      sotPracticeCategory,
      sotPracticeRating,
      sotPracticeClassification,
      sotScripturalSource,
      sotParentScripture,
      sotSourceReference,
      sotSourceUrl,
      sotSourceNotes,
      sotSummaryLabel,
      sotCorePracticesCount,
      sotScripturalElementsCount,
      sotRegionalCustomsCount,
      sotCorrectionsCount,

      // Story Section
      storyTitle,
      storyIntroduction,
      storySubsectionTitle,
      storyContent,
      storyPracticeCategory,
      storyPracticeRating,
      storyPracticeClassification,
      storyScripturalSource,
      storyContinuation,
      storyImage,
      storyImageAltText,
      storyImageCaption,
      storyImageCredit,
      storyImageSource,

      // Sankalpa Section
      sankalpaTitle,
      sankalpaSubtitle,
      sankalpaInstruction,
      sankalpaText,
      sankalpaMeaning,
      sankalpaExplanation,
      sankalpaDetailsJson,
      sankalpaNoteHeading,
      sankalpaNoteContent,
      sankalpaImage,

      // Vidhi Section
      vidhiDaysJson,
    } = body || {};

    const toStr = (v: any) => (typeof v === 'string' && v.trim() ? v.trim() : null);
    const toInt = (v: any) => (v !== undefined && v !== null && v !== '' && !isNaN(Number(v)) ? Number(v) : null);

    // Derive main title & slug safely with fallbacks
    const guideName = (title && typeof title === 'string' && title.trim()) || (guideTitle && typeof guideTitle === 'string' && guideTitle.trim()) || 'Untitled Guide';
    const slug = rawSlug && typeof rawSlug === 'string' && rawSlug.trim() ? slugify(rawSlug) : (slugify(guideName) || `guide-${Date.now()}`);

    const validStatus = ['DRAFT', 'PUBLISHED'].includes(status) ? status : 'DRAFT';

    const guideData: any = {
      id: `guide-${Date.now()}`,
      title: guideName,
      slug,
      status: validStatus,

      // Banner Content
      sectionLabel: toStr(sectionLabel),
      category: toStr(category),
      rating: toStr(rating),
      classification: toStr(classification),
      guideTitle: toStr(guideTitle),
      guideSubtitle: toStr(guideSubtitle),
      festivalName: toStr(festivalName),
      panchangLocation: toStr(panchangLocation),
      primaryButtonText: toStr(primaryButtonText),
      primaryButtonAction: primaryButtonAction || 'Scroll to Section',
      primaryButtonTarget: toStr(primaryButtonTarget),
      secondaryButtonText: toStr(secondaryButtonText),
      secondaryButtonAction: secondaryButtonAction || 'Download File',
      secondaryButtonTarget: toStr(secondaryButtonTarget),
      thirdButtonText: toStr(thirdButtonText),
      thirdButtonAction: thirdButtonAction || 'Open URL',
      thirdButtonTarget: toStr(thirdButtonTarget),

      // Source of Truth
      sotSectionHeading: toStr(sotSectionHeading),
      sotButtonText: toStr(sotButtonText),
      sotButtonAction: sotButtonAction || 'Open URL',
      sotButtonTarget: toStr(sotButtonTarget),
      sotPracticeLabel: toStr(sotPracticeLabel),
      sotPracticeTitle: toStr(sotPracticeTitle),
      sotPracticeCategory: toStr(sotPracticeCategory),
      sotPracticeRating: toStr(sotPracticeRating),
      sotPracticeClassification: toStr(sotPracticeClassification),
      sotScripturalSource: toStr(sotScripturalSource),
      sotParentScripture: toStr(sotParentScripture),
      sotSourceReference: toStr(sotSourceReference),
      sotSourceUrl: toStr(sotSourceUrl),
      sotSourceNotes: toStr(sotSourceNotes),
      sotSummaryLabel: toStr(sotSummaryLabel),
      sotCorePracticesCount: toInt(sotCorePracticesCount),
      sotScripturalElementsCount: toInt(sotScripturalElementsCount),
      sotRegionalCustomsCount: toInt(sotRegionalCustomsCount),
      sotCorrectionsCount: toInt(sotCorrectionsCount),

      // Story Section
      storyTitle: toStr(storyTitle),
      storyIntroduction: toStr(storyIntroduction),
      storySubsectionTitle: toStr(storySubsectionTitle),
      storyContent: toStr(storyContent),
      storyPracticeCategory: toStr(storyPracticeCategory),
      storyPracticeRating: toStr(storyPracticeRating),
      storyPracticeClassification: toStr(storyPracticeClassification),
      storyScripturalSource: toStr(storyScripturalSource),
      storyContinuation: toStr(storyContinuation),
      storyImage: toStr(storyImage),
      storyImageAltText: toStr(storyImageAltText),
      storyImageCaption: toStr(storyImageCaption),
      storyImageCredit: toStr(storyImageCredit),
      storyImageSource: toStr(storyImageSource),

      // Sankalpa Section
      sankalpaTitle: toStr(sankalpaTitle),
      sankalpaSubtitle: toStr(sankalpaSubtitle),
      sankalpaInstruction: toStr(sankalpaInstruction),
      sankalpaText: toStr(sankalpaText),
      sankalpaMeaning: toStr(sankalpaMeaning),
      sankalpaExplanation: toStr(sankalpaExplanation),
      sankalpaDetailsJson: typeof sankalpaDetailsJson === 'string' ? sankalpaDetailsJson : JSON.stringify(sankalpaDetailsJson || []),
      sankalpaNoteHeading: toStr(sankalpaNoteHeading),
      sankalpaNoteContent: toStr(sankalpaNoteContent),
      sankalpaImage: toStr(sankalpaImage),

      // Vidhi Section
      vidhiDaysJson: typeof vidhiDaysJson === 'string' ? vidhiDaysJson : JSON.stringify(vidhiDaysJson || []),

      // Vrat Katha Section
      kathaTitle: toStr(body.kathaTitle),
      kathaSubtitle: toStr(body.kathaSubtitle),
      kathaScripturalReference: toStr(body.kathaScripturalReference),
      kathaHeadline: toStr(body.kathaHeadline),
      kathaIntroduction: toStr(body.kathaIntroduction),
      kathaCardsJson: typeof body.kathaCardsJson === 'string' ? body.kathaCardsJson : JSON.stringify(body.kathaCardsJson || []),
      kathaSupportingExplanation: toStr(body.kathaSupportingExplanation),
      kathaAudio: toStr(body.kathaAudio),
      kathaAudioButtonText: toStr(body.kathaAudioButtonText),
      kathaAudioDuration: toStr(body.kathaAudioDuration),
      kathaFullKathaButtonText: toStr(body.kathaFullKathaButtonText),
      kathaFullKathaLink: toStr(body.kathaFullKathaLink),
      kathaImage: toStr(body.kathaImage),
      kathaImageAltText: toStr(body.kathaImageAltText),
      kathaImageCaption: toStr(body.kathaImageCaption),

      // Durga Ashtami and Maha Navami Context
      festivalContextTitle: toStr(body.festivalContextTitle),
      festivalContextIntroduction: toStr(body.festivalContextIntroduction),
      festivalContextDetails: toStr(body.festivalContextDetails),
      festivalPracticeCategory: toStr(body.festivalPracticeCategory),
      festivalPracticeRating: toStr(body.festivalPracticeRating),
      festivalClassification: toStr(body.festivalClassification),
      sandhiPujaInformation: toStr(body.sandhiPujaInformation),

      // Samagri Section
      samagriTitle: toStr(body.samagriTitle),
      samagriSubtitle: toStr(body.samagriSubtitle),
      samagriItemsJson: typeof body.samagriItemsJson === 'string' ? body.samagriItemsJson : JSON.stringify(body.samagriItemsJson || []),
      samagriAudio: toStr(body.samagriAudio),
      samagriAudioButtonText: toStr(body.samagriAudioButtonText),
      samagriAudioDuration: toStr(body.samagriAudioDuration),

      // Fasting Section
      fastingTitle: toStr(body.fastingTitle),
      fastingSubtitle: toStr(body.fastingSubtitle),
      fastingOptionsJson: typeof body.fastingOptionsJson === 'string' ? body.fastingOptionsJson : JSON.stringify(body.fastingOptionsJson || []),
      fastingGuidanceHeading: toStr(body.fastingGuidanceHeading),
      fastingGuidanceContent: toStr(body.fastingGuidanceContent),

      // Myths & Corrections Section
      mythsTitle: toStr(body.mythsTitle),
      mythsSubtitle: toStr(body.mythsSubtitle),
      mythsItemsJson: typeof body.mythsItemsJson === 'string' ? body.mythsItemsJson : JSON.stringify(body.mythsItemsJson || []),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let newGuide = null;
    try {
      const existing = await prisma.ritualGuide.findUnique({ where: { slug } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: `A Ritual Guide with slug '${slug}' already exists.` },
          { status: 400 }
        );
      }

      const { id: _ignoreId, createdAt: _ignoreCreatedAt, updatedAt: _ignoreUpdatedAt, ...createPayload } = guideData;
      newGuide = await prisma.ritualGuide.create({
        data: createPayload,
      });
    } catch (dbErr: any) {
      console.warn('[API RitualGuide POST] Database save failed, saving to in-memory store:', dbErr?.message || dbErr);
      newGuide = guideData;
      saveInMemoryGuide(newGuide);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Ritual Guide data saved successfully.',
        data: newGuide,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API RitualGuide POST] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create Ritual Guide.' },
      { status: 400 }
    );
  }
});
