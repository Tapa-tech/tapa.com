import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withEditorAuth } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';
import { findInMemoryGuide, saveInMemoryGuide, deleteInMemoryGuide } from '@/lib/ritual-guides-store';

/**
 * GET /api/admin/ritual-guides/[id]
 * Fetch single Ritual Guide by ID (Requires EDITOR or ADMIN)
 */
export const GET = withEditorAuth(async (req, { params }) => {
  try {
    const { id } = params;

    let guide = null;
    try {
      guide = await prisma.ritualGuide.findUnique({
        where: { id },
      });
    } catch (dbErr: any) {
      console.warn('[API Admin Ritual Guide ID GET] DB fetch warning:', dbErr?.message || dbErr);
    }

    if (!guide) {
      guide = findInMemoryGuide(id);
    }

    if (!guide) {
      return NextResponse.json(
        { success: false, error: 'Ritual Guide not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: guide,
    });
  } catch (err: any) {
    console.error('[API Admin Ritual Guide ID GET] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Database error' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/admin/ritual-guides/[id]
 * Update Ritual Guide data (Requires EDITOR or ADMIN)
 */
export const PUT = withEditorAuth(async (req, { params }) => {
  try {
    const { id } = params;
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

    const guideName = (title && typeof title === 'string' && title.trim()) || (guideTitle && typeof guideTitle === 'string' && guideTitle.trim()) || 'Untitled Guide';
    const slug = rawSlug && typeof rawSlug === 'string' && rawSlug.trim() ? slugify(rawSlug) : (slugify(guideName) || `guide-${Date.now()}`);

    const validStatus = ['DRAFT', 'PUBLISHED'].includes(status) ? status : 'DRAFT';

    const updatePayload: any = {
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
    };

    let updatedGuide = null;
    try {
      const existingGuide = await prisma.ritualGuide.findUnique({
        where: { id },
      });

      if (rawSlug && typeof rawSlug === 'string' && rawSlug.trim() && existingGuide && rawSlug.trim() !== existingGuide.slug) {
        const slugCheck = slugify(rawSlug);
        const slugConflict = await prisma.ritualGuide.findFirst({
          where: { slug: slugCheck, id: { not: id } },
        });
        if (slugConflict) {
          return NextResponse.json(
            { success: false, error: `Slug '${slugCheck}' is already in use.` },
            { status: 400 }
          );
        }
      }

      updatedGuide = await prisma.ritualGuide.update({
        where: { id },
        data: updatePayload,
      });
    } catch (dbErr: any) {
      console.warn('[API RitualGuide PUT] DB update failed, using fallback:', dbErr?.message || dbErr);
      updatedGuide = { id, ...updatePayload };
    }

    saveInMemoryGuide(updatedGuide || { id, ...updatePayload });

    return NextResponse.json({
      success: true,
      message: 'Ritual Guide updated successfully.',
      data: updatedGuide || { id, ...updatePayload },
    });
  } catch (err: any) {
    console.error('[API RitualGuide PUT] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update Ritual Guide.' },
      { status: 400 }
    );
  }
});

/**
 * DELETE /api/admin/ritual-guides/[id]
 * Delete a Ritual Guide entry (Requires EDITOR or ADMIN)
 */
export const DELETE = withEditorAuth(async (req, { params }) => {
  try {
    const { id } = params;

    try {
      await prisma.ritualGuide.delete({
        where: { id },
      });
    } catch (dbErr: any) {
      console.warn('[API RitualGuide DELETE] DB delete failed, using fallback:', dbErr?.message || dbErr);
    }

    deleteInMemoryGuide(id);

    return NextResponse.json({
      success: true,
      message: 'Ritual Guide deleted successfully.',
    });
  } catch (err: any) {
    console.error('[API RitualGuide DELETE] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to delete Ritual Guide.' },
      { status: 400 }
    );
  }
});
