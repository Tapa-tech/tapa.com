import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withEditorAuth } from '@/lib/api-auth';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * GET /api/admin/ritual-guides
 * Listing endpoint with search and status filter (Requires EDITOR or ADMIN)
 */
export const GET = withEditorAuth(async (req) => {
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

  const guides = await prisma.ritualGuide.findMany({
    where: whereClause,
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({
    success: true,
    count: guides.length,
    data: guides,
  });
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

      // Banner Information
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

    // Banner Information Validations
    if (!sectionLabel || !sectionLabel.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Section Label.' }, { status: 400 }); }
    if (!category || !category.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Category.' }, { status: 400 }); }
    if (!rating || !rating.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Rating.' }, { status: 400 }); }
    if (!classification || !classification.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Classification.' }, { status: 400 }); }
    if (!guideTitle || !guideTitle.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Guide Title.' }, { status: 400 }); }
    if (!guideSubtitle || !guideSubtitle.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Guide Subtitle.' }, { status: 400 }); }
    if (!festivalName || !festivalName.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Festival Name.' }, { status: 400 }); }
    if (!panchangLocation || !panchangLocation.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Panchang Location.' }, { status: 400 }); }

    if (!primaryButtonText || !primaryButtonText.trim() || !primaryButtonTarget || !primaryButtonTarget.trim()) {
      return NextResponse.json({ success: false, error: 'Please enter the Primary Button Text and Target.' }, { status: 400 });
    }
    if (!secondaryButtonText || !secondaryButtonText.trim() || !secondaryButtonTarget || !secondaryButtonTarget.trim()) {
      return NextResponse.json({ success: false, error: 'Please enter the Secondary Button Text and Target.' }, { status: 400 });
    }
    if (!thirdButtonText || !thirdButtonText.trim() || !thirdButtonTarget || !thirdButtonTarget.trim()) {
      return NextResponse.json({ success: false, error: 'Please enter the Third Button Text and Target.' }, { status: 400 });
    }

    // Source of Truth Validations
    if (!sotSectionHeading || !sotSectionHeading.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Section Heading.' }, { status: 400 }); }
    if (!sotButtonText || !sotButtonText.trim() || !sotButtonAction || !sotButtonAction.trim() || !sotButtonTarget || !sotButtonTarget.trim()) {
      return NextResponse.json({ success: false, error: 'Please enter the Source Button configuration.' }, { status: 400 });
    }
    if (!sotPracticeLabel || !sotPracticeLabel.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Practice Label.' }, { status: 400 }); }
    if (!sotPracticeTitle || !sotPracticeTitle.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Practice Title.' }, { status: 400 }); }
    if (!sotPracticeCategory || !sotPracticeCategory.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Practice Category.' }, { status: 400 }); }
    if (!sotPracticeRating || !sotPracticeRating.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Practice Rating.' }, { status: 400 }); }
    if (!sotPracticeClassification || !sotPracticeClassification.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Practice Classification.' }, { status: 400 }); }
    if (!sotScripturalSource || !sotScripturalSource.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Scriptural Source.' }, { status: 400 }); }
    if (!sotParentScripture || !sotParentScripture.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Parent Scripture.' }, { status: 400 }); }
    if (!sotSummaryLabel || !sotSummaryLabel.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Summary Label.' }, { status: 400 }); }
    if (sotCorePracticesCount === undefined || sotCorePracticesCount === null || isNaN(Number(sotCorePracticesCount))) { return NextResponse.json({ success: false, error: 'Please enter the number of Core Practices.' }, { status: 400 }); }
    if (sotScripturalElementsCount === undefined || sotScripturalElementsCount === null || isNaN(Number(sotScripturalElementsCount))) { return NextResponse.json({ success: false, error: 'Please enter the number of Scriptural Elements.' }, { status: 400 }); }
    if (sotRegionalCustomsCount === undefined || sotRegionalCustomsCount === null || isNaN(Number(sotRegionalCustomsCount))) { return NextResponse.json({ success: false, error: 'Please enter the number of Regional Customs.' }, { status: 400 }); }
    if (sotCorrectionsCount === undefined || sotCorrectionsCount === null || isNaN(Number(sotCorrectionsCount))) { return NextResponse.json({ success: false, error: 'Please enter the number of Corrections.' }, { status: 400 }); }

    // Story Section Validations
    if (!storyTitle || !storyTitle.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Story Title.' }, { status: 400 }); }
    if (!storyIntroduction || !storyIntroduction.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Story Introduction.' }, { status: 400 }); }
    if (!storySubsectionTitle || !storySubsectionTitle.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Story Subsection Title.' }, { status: 400 }); }
    if (!storyContent || !storyContent.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Story Content.' }, { status: 400 }); }
    if (!storyPracticeCategory || !storyPracticeCategory.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Story Practice Category.' }, { status: 400 }); }
    if (!storyPracticeRating || !storyPracticeRating.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Story Practice Rating.' }, { status: 400 }); }
    if (!storyPracticeClassification || !storyPracticeClassification.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Story Practice Classification.' }, { status: 400 }); }
    if (!storyScripturalSource || !storyScripturalSource.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Story Scriptural Source.' }, { status: 400 }); }
    if (!storyContinuation || !storyContinuation.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Story Continuation.' }, { status: 400 }); }
    if (!storyImage || !storyImage.trim()) { return NextResponse.json({ success: false, error: 'Please upload or enter a Story Image.' }, { status: 400 }); }
    if (!storyImageAltText || !storyImageAltText.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Story Image Alt Text.' }, { status: 400 }); }
    if (!storyImageCaption || !storyImageCaption.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Story Image Caption.' }, { status: 400 }); }

    // Sankalpa Section Validations
    if (!sankalpaTitle || !sankalpaTitle.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Sankalpa Title.' }, { status: 400 }); }
    if (!sankalpaSubtitle || !sankalpaSubtitle.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Sankalpa Subtitle.' }, { status: 400 }); }
    if (!sankalpaInstruction || !sankalpaInstruction.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Sankalpa Instruction.' }, { status: 400 }); }
    if (!sankalpaText || !sankalpaText.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Sankalpa Text.' }, { status: 400 }); }
    if (!sankalpaMeaning || !sankalpaMeaning.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Sankalpa Meaning.' }, { status: 400 }); }
    if (!sankalpaExplanation || !sankalpaExplanation.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Sankalpa Explanation.' }, { status: 400 }); }
    if (!sankalpaNoteHeading || !sankalpaNoteHeading.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Sankalpa Note Heading.' }, { status: 400 }); }
    if (!sankalpaNoteContent || !sankalpaNoteContent.trim()) { return NextResponse.json({ success: false, error: 'Please enter the Sankalpa Note Content.' }, { status: 400 }); }

    // Derive main title & slug
    const guideName = title && title.trim() ? title.trim() : guideTitle.trim();
    const slug = rawSlug && rawSlug.trim() ? slugify(rawSlug) : slugify(guideName);

    const existing = await prisma.ritualGuide.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `A Ritual Guide with slug '${slug}' already exists.` },
        { status: 400 }
      );
    }

    const validStatus = ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status) ? status : 'DRAFT';

    const newGuide = await prisma.ritualGuide.create({
      data: {
        title: guideName,
        slug,
        status: validStatus,

        // Banner Content
        sectionLabel: sectionLabel.trim(),
        category: category.trim(),
        rating: rating.trim(),
        classification: classification.trim(),
        guideTitle: guideTitle.trim(),
        guideSubtitle: guideSubtitle.trim(),
        festivalName: festivalName.trim(),
        panchangLocation: panchangLocation.trim(),
        primaryButtonText: primaryButtonText.trim(),
        primaryButtonAction: primaryButtonAction || 'Scroll to Section',
        primaryButtonTarget: primaryButtonTarget.trim(),
        secondaryButtonText: secondaryButtonText.trim(),
        secondaryButtonAction: secondaryButtonAction || 'Download File',
        secondaryButtonTarget: secondaryButtonTarget.trim(),
        thirdButtonText: thirdButtonText.trim(),
        thirdButtonAction: thirdButtonAction || 'Open URL',
        thirdButtonTarget: thirdButtonTarget.trim(),

        // Source of Truth
        sotSectionHeading: sotSectionHeading.trim(),
        sotButtonText: sotButtonText.trim(),
        sotButtonAction: sotButtonAction || 'Open URL',
        sotButtonTarget: sotButtonTarget.trim(),
        sotPracticeLabel: sotPracticeLabel.trim(),
        sotPracticeTitle: sotPracticeTitle.trim(),
        sotPracticeCategory: sotPracticeCategory.trim(),
        sotPracticeRating: sotPracticeRating.trim(),
        sotPracticeClassification: sotPracticeClassification.trim(),
        sotScripturalSource: sotScripturalSource.trim(),
        sotParentScripture: sotParentScripture.trim(),
        sotSourceReference: sotSourceReference ? sotSourceReference.trim() : null,
        sotSourceUrl: sotSourceUrl ? sotSourceUrl.trim() : null,
        sotSourceNotes: sotSourceNotes ? sotSourceNotes.trim() : null,
        sotSummaryLabel: sotSummaryLabel.trim(),
        sotCorePracticesCount: Number(sotCorePracticesCount),
        sotScripturalElementsCount: Number(sotScripturalElementsCount),
        sotRegionalCustomsCount: Number(sotRegionalCustomsCount),
        sotCorrectionsCount: Number(sotCorrectionsCount),

        // Story Section
        storyTitle: storyTitle.trim(),
        storyIntroduction: storyIntroduction.trim(),
        storySubsectionTitle: storySubsectionTitle.trim(),
        storyContent: storyContent.trim(),
        storyPracticeCategory: storyPracticeCategory.trim(),
        storyPracticeRating: storyPracticeRating.trim(),
        storyPracticeClassification: storyPracticeClassification.trim(),
        storyScripturalSource: storyScripturalSource.trim(),
        storyContinuation: storyContinuation.trim(),
        storyImage: storyImage.trim(),
        storyImageAltText: storyImageAltText.trim(),
        storyImageCaption: storyImageCaption.trim(),
        storyImageCredit: storyImageCredit ? storyImageCredit.trim() : null,
        storyImageSource: storyImageSource ? storyImageSource.trim() : null,

        // Sankalpa Section
        sankalpaTitle: sankalpaTitle.trim(),
        sankalpaSubtitle: sankalpaSubtitle.trim(),
        sankalpaInstruction: sankalpaInstruction.trim(),
        sankalpaText: sankalpaText.trim(),
        sankalpaMeaning: sankalpaMeaning.trim(),
        sankalpaExplanation: sankalpaExplanation.trim(),
        sankalpaDetailsJson: typeof sankalpaDetailsJson === 'string' ? sankalpaDetailsJson : JSON.stringify(sankalpaDetailsJson || []),
        sankalpaNoteHeading: sankalpaNoteHeading.trim(),
        sankalpaNoteContent: sankalpaNoteContent.trim(),
        sankalpaImage: sankalpaImage ? sankalpaImage.trim() : null,

        // Vidhi Section
        vidhiDaysJson: typeof vidhiDaysJson === 'string' ? vidhiDaysJson : JSON.stringify(vidhiDaysJson || []),

        // Vrat Katha Section
        kathaTitle: body.kathaTitle || null,
        kathaSubtitle: body.kathaSubtitle || null,
        kathaScripturalReference: body.kathaScripturalReference || null,
        kathaHeadline: body.kathaHeadline || null,
        kathaIntroduction: body.kathaIntroduction || null,
        kathaCardsJson: typeof body.kathaCardsJson === 'string' ? body.kathaCardsJson : JSON.stringify(body.kathaCardsJson || []),
        kathaSupportingExplanation: body.kathaSupportingExplanation || null,
        kathaAudio: body.kathaAudio || null,
        kathaAudioButtonText: body.kathaAudioButtonText || null,
        kathaAudioDuration: body.kathaAudioDuration || null,
        kathaFullKathaButtonText: body.kathaFullKathaButtonText || null,
        kathaFullKathaLink: body.kathaFullKathaLink || null,
        kathaImage: body.kathaImage || null,
        kathaImageAltText: body.kathaImageAltText || null,
        kathaImageCaption: body.kathaImageCaption || null,

        // Durga Ashtami and Maha Navami Context
        festivalContextTitle: body.festivalContextTitle || null,
        festivalContextIntroduction: body.festivalContextIntroduction || null,
        festivalContextDetails: body.festivalContextDetails || null,
        festivalPracticeCategory: body.festivalPracticeCategory || null,
        festivalPracticeRating: body.festivalPracticeRating || null,
        festivalClassification: body.festivalClassification || null,
        sandhiPujaInformation: body.sandhiPujaInformation || null,

        // Samagri Section
        samagriTitle: body.samagriTitle || null,
        samagriSubtitle: body.samagriSubtitle || null,
        samagriItemsJson: typeof body.samagriItemsJson === 'string' ? body.samagriItemsJson : JSON.stringify(body.samagriItemsJson || []),
        samagriAudio: body.samagriAudio || null,
        samagriAudioButtonText: body.samagriAudioButtonText || null,
        samagriAudioDuration: body.samagriAudioDuration || null,

        // Fasting Section
        fastingTitle: body.fastingTitle || null,
        fastingSubtitle: body.fastingSubtitle || null,
        fastingOptionsJson: typeof body.fastingOptionsJson === 'string' ? body.fastingOptionsJson : JSON.stringify(body.fastingOptionsJson || []),
        fastingGuidanceHeading: body.fastingGuidanceHeading || null,
        fastingGuidanceContent: body.fastingGuidanceContent || null,

        // Myths & Corrections Section
        mythsTitle: body.mythsTitle || null,
        mythsSubtitle: body.mythsSubtitle || null,
        mythsItemsJson: typeof body.mythsItemsJson === 'string' ? body.mythsItemsJson : JSON.stringify(body.mythsItemsJson || []),
      },
    });

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
      { success: false, error: 'Failed to create Ritual Guide.' },
      { status: 500 }
    );
  }
});
