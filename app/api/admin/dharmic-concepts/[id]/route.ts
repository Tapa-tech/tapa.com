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
 * GET /api/admin/dharmic-concepts/[id]
 * Fetch single concept details (Requires EDITOR or ADMIN)
 */
export const GET = withEditorAuth(async (req, { params }) => {
  const { id } = params || {};

  const concept = await prisma.dharmicConcept.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  if (!concept) {
    return NextResponse.json(
      { success: false, error: 'Dharmic Concept not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: concept });
});

/**
 * PUT /api/admin/dharmic-concepts/[id]
 * Update concept (Requires EDITOR or ADMIN)
 */
export const PUT = withEditorAuth(async (req, { params }) => {
  try {
    const { id } = params || {};
    const existing = await prisma.dharmicConcept.findUnique({ where: { id } });

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
        const slugExists = await prisma.dharmicConcept.findUnique({
          where: { slug: formattedSlug },
        });
        if (slugExists) {
          return NextResponse.json(
            { success: false, error: `Slug '${formattedSlug}' is already in use by another concept.` },
            { status: 400 }
          );
        }
        updateData.slug = formattedSlug;
      }
    }

    const updatedConcept = await prisma.dharmicConcept.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

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
    const existing = await prisma.dharmicConcept.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Dharmic Concept not found.' },
        { status: 404 }
      );
    }

    await prisma.dharmicConcept.delete({ where: { id } });

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
