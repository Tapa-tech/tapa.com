import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withEditorAuth } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';
import {
  findInMemoryDharmicConcept,
  saveInMemoryDharmicConcept,
  deleteInMemoryDharmicConcept,
} from '@/lib/ritual-guides-store';

/**
 * GET /api/admin/dharmic-concepts/[id]
 * Fetch single concept details (Requires EDITOR or ADMIN)
 */
export const GET = withEditorAuth(async (req, { params }) => {
  try {
    const { id } = params || {};

    let concept: any = null;
    try {
      concept = await prisma.dharmicConcept.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      });
    } catch (dbErr: any) {
      console.warn('[API DharmicConcept GET single] DB error, using in-memory store:', dbErr?.message || dbErr);
      concept = findInMemoryDharmicConcept(id);
    }

    if (!concept) {
      concept = findInMemoryDharmicConcept(id);
    }

    if (!concept) {
      return NextResponse.json(
        { success: false, error: 'Dharmic Concept not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: concept });
  } catch (err: any) {
    console.error('[API DharmicConcept GET single] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Dharmic Concept.' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/admin/dharmic-concepts/[id]
 * Update concept (Requires EDITOR or ADMIN)
 */
export const PUT = withEditorAuth(async (req, { params }) => {
  try {
    const { id } = params || {};
    let existing: any = null;
    try {
      existing = await prisma.dharmicConcept.findUnique({ where: { id } });
    } catch (dbErr: any) {
      console.warn('[API DharmicConcept PUT] DB existing check warning:', dbErr?.message || dbErr);
    }

    if (!existing) {
      existing = findInMemoryDharmicConcept(id);
    }

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Dharmic Concept not found.' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      title,
      category,
      summary,
      body: contentBody,
      status,
      slug,
      bannerEyebrow,
      bannerRating,
      bannerClassification,
      bannerTitle,
      bannerDescription,
      bannerPrimaryCtaText,
      bannerPrimaryCtaLink,
      bannerSecondaryCtaText,
      bannerSecondaryCtaLink,
      bannerShareButtonText,
      threeStoriesTitle,
      threeStoriesIntro,
      threeStoriesSupportingText,
      storiesItemsJson,
      threeStoriesGalleryJson,
      threeStoriesCaption,
      shareSectionHeading,
      shareSharedContent,
      shareNotSharedContent,
      shareHighlightStatement,
      shareSupportingDescription,
      shareTraditionTag,
      mythsSectionHeading,
      mythsItemsJson,
      reframeLabel,
      reframeContent,
      relatedRitualGuidesJson,
      relatedPujansJson,
      relatedConceptsJson,
      relatedDatesJson,
    } = body || {};

    const updateData: any = {};

    if (title && typeof title === 'string') {
      updateData.title = title.trim();
    }

    if (contentBody && typeof contentBody === 'string') {
      updateData.body = contentBody.trim();
    }

    if (category && typeof category === 'string') {
      updateData.category = category.trim();
    }

    if (summary !== undefined) {
      updateData.summary = summary ? summary.trim() : null;
    }

    if (status && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      updateData.status = status;
    }

    if (bannerEyebrow !== undefined) updateData.bannerEyebrow = bannerEyebrow ? bannerEyebrow.trim() : null;
    if (bannerRating !== undefined) updateData.bannerRating = bannerRating ? bannerRating.trim() : null;
    if (bannerClassification !== undefined) updateData.bannerClassification = bannerClassification ? bannerClassification.trim() : null;
    if (bannerTitle !== undefined) updateData.bannerTitle = bannerTitle ? bannerTitle.trim() : null;
    if (bannerDescription !== undefined) updateData.bannerDescription = bannerDescription ? bannerDescription.trim() : null;
    if (bannerPrimaryCtaText !== undefined) updateData.bannerPrimaryCtaText = bannerPrimaryCtaText ? bannerPrimaryCtaText.trim() : null;
    if (bannerPrimaryCtaLink !== undefined) updateData.bannerPrimaryCtaLink = bannerPrimaryCtaLink ? bannerPrimaryCtaLink.trim() : null;
    if (bannerSecondaryCtaText !== undefined) updateData.bannerSecondaryCtaText = bannerSecondaryCtaText ? bannerSecondaryCtaText.trim() : null;
    if (bannerSecondaryCtaLink !== undefined) updateData.bannerSecondaryCtaLink = bannerSecondaryCtaLink ? bannerSecondaryCtaLink.trim() : null;
    if (bannerShareButtonText !== undefined) updateData.bannerShareButtonText = bannerShareButtonText ? bannerShareButtonText.trim() : null;

    if (threeStoriesTitle !== undefined) updateData.threeStoriesTitle = threeStoriesTitle ? threeStoriesTitle.trim() : null;
    if (threeStoriesIntro !== undefined) updateData.threeStoriesIntro = threeStoriesIntro ? threeStoriesIntro.trim() : null;
    if (threeStoriesSupportingText !== undefined) updateData.threeStoriesSupportingText = threeStoriesSupportingText ? threeStoriesSupportingText.trim() : null;
    if (storiesItemsJson !== undefined) updateData.storiesItemsJson = storiesItemsJson ? (typeof storiesItemsJson === 'string' ? storiesItemsJson : JSON.stringify(storiesItemsJson)) : null;
    if (threeStoriesGalleryJson !== undefined) updateData.threeStoriesGalleryJson = threeStoriesGalleryJson ? (typeof threeStoriesGalleryJson === 'string' ? threeStoriesGalleryJson : JSON.stringify(threeStoriesGalleryJson)) : null;
    if (threeStoriesCaption !== undefined) updateData.threeStoriesCaption = threeStoriesCaption ? threeStoriesCaption.trim() : null;

    if (shareSectionHeading !== undefined) updateData.shareSectionHeading = shareSectionHeading ? shareSectionHeading.trim() : null;
    if (shareSharedContent !== undefined) updateData.shareSharedContent = shareSharedContent ? shareSharedContent.trim() : null;
    if (shareNotSharedContent !== undefined) updateData.shareNotSharedContent = shareNotSharedContent ? shareNotSharedContent.trim() : null;
    if (shareHighlightStatement !== undefined) updateData.shareHighlightStatement = shareHighlightStatement ? shareHighlightStatement.trim() : null;
    if (shareSupportingDescription !== undefined) updateData.shareSupportingDescription = shareSupportingDescription ? shareSupportingDescription.trim() : null;
    if (shareTraditionTag !== undefined) updateData.shareTraditionTag = shareTraditionTag ? shareTraditionTag.trim() : null;

    if (mythsSectionHeading !== undefined) updateData.mythsSectionHeading = mythsSectionHeading ? mythsSectionHeading.trim() : null;
    if (mythsItemsJson !== undefined) updateData.mythsItemsJson = mythsItemsJson ? (typeof mythsItemsJson === 'string' ? mythsItemsJson : JSON.stringify(mythsItemsJson)) : null;
    if (reframeLabel !== undefined) updateData.reframeLabel = reframeLabel ? reframeLabel.trim() : null;
    if (reframeContent !== undefined) updateData.reframeContent = reframeContent ? reframeContent.trim() : null;

    if (relatedRitualGuidesJson !== undefined) updateData.relatedRitualGuidesJson = relatedRitualGuidesJson ? (typeof relatedRitualGuidesJson === 'string' ? relatedRitualGuidesJson : JSON.stringify(relatedRitualGuidesJson)) : null;
    if (relatedPujansJson !== undefined) updateData.relatedPujansJson = relatedPujansJson ? (typeof relatedPujansJson === 'string' ? relatedPujansJson : JSON.stringify(relatedPujansJson)) : null;
    if (relatedConceptsJson !== undefined) updateData.relatedConceptsJson = relatedConceptsJson ? (typeof relatedConceptsJson === 'string' ? relatedConceptsJson : JSON.stringify(relatedConceptsJson)) : null;
    if (relatedDatesJson !== undefined) updateData.relatedDatesJson = relatedDatesJson ? (typeof relatedDatesJson === 'string' ? relatedDatesJson : JSON.stringify(relatedDatesJson)) : null;

    if (slug && typeof slug === 'string') {
      const formattedSlug = slugify(slug);
      if (formattedSlug !== existing.slug) {
        try {
          const slugExists = await prisma.dharmicConcept.findUnique({
            where: { slug: formattedSlug },
          });
          if (slugExists) {
            return NextResponse.json(
              { success: false, error: `Slug '${formattedSlug}' is already in use by another concept.` },
              { status: 400 }
            );
          }
        } catch (slugErr: any) {
          console.warn('[API DharmicConcept PUT] Slug check warning:', slugErr?.message || slugErr);
        }
        updateData.slug = formattedSlug;
      }
    }

    let updatedConcept: any = null;
    try {
      updatedConcept = await prisma.dharmicConcept.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      });
    } catch (dbErr: any) {
      console.warn('[API DharmicConcept PUT] DB update warning, using in-memory store:', dbErr?.message || dbErr);
      updatedConcept = {
        ...existing,
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      saveInMemoryDharmicConcept(updatedConcept);
    }

    return NextResponse.json({
      success: true,
      message: 'Dharmic Concept updated successfully.',
      data: updatedConcept,
    });
  } catch (err: any) {
    console.error('[API DharmicConcept PUT] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update Dharmic Concept.' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/admin/dharmic-concepts/[id]
 * Delete concept (Requires EDITOR or ADMIN)
 */
export const DELETE = withEditorAuth(async (req, { params }) => {
  try {
    const { id } = params || {};
    let existing: any = null;
    try {
      existing = await prisma.dharmicConcept.findUnique({ where: { id } });
    } catch (dbErr: any) {
      console.warn('[API DharmicConcept DELETE] DB check warning:', dbErr?.message || dbErr);
    }

    if (!existing) {
      existing = findInMemoryDharmicConcept(id);
    }

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Dharmic Concept not found.' },
        { status: 404 }
      );
    }

    try {
      await prisma.dharmicConcept.delete({ where: { id } });
    } catch (dbErr: any) {
      console.warn('[API DharmicConcept DELETE] DB delete warning, removing from in-memory:', dbErr?.message || dbErr);
      deleteInMemoryDharmicConcept(id);
    }

    return NextResponse.json({
      success: true,
      message: `Dharmic Concept '${existing.title}' deleted successfully.`,
    });
  } catch (err: any) {
    console.error('[API DharmicConcept DELETE] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete Dharmic Concept.' },
      { status: 500 }
    );
  }
});
