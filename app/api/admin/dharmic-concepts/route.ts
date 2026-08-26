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
 * GET /api/admin/dharmic-concepts
 * Listing endpoint with search and filtering (Requires EDITOR or ADMIN)
 */
export const GET = withEditorAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.trim() || '';
  const category = searchParams.get('category')?.trim() || '';
  const status = searchParams.get('status')?.trim() || '';

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { slug: { contains: search } },
      { body: { contains: search } },
      { summary: { contains: search } },
    ];
  }

  if (category && category !== 'ALL') {
    whereClause.category = category;
  }

  if (status && status !== 'ALL') {
    whereClause.status = status;
  }

  const concepts = await prisma.dharmicConcept.findMany({
    where: whereClause,
    orderBy: { updatedAt: 'desc' },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  return NextResponse.json({
    success: true,
    count: concepts.length,
    data: concepts,
  });
});

/**
 * POST /api/admin/dharmic-concepts
 * Create new Dharmic Concept (Requires EDITOR or ADMIN)
 */
export const POST = withEditorAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const {
      title,
      category,
      summary,
      body: contentBody,
      status,
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
    let { slug } = body || {};

    // Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Validation Error: Title is required.' },
        { status: 400 }
      );
    }

    if (!contentBody || typeof contentBody !== 'string' || !contentBody.trim()) {
      return NextResponse.json(
        { success: false, error: 'Validation Error: Content body is required.' },
        { status: 400 }
      );
    }

    // Auto-generate slug if missing
    slug = slug && typeof slug === 'string' && slug.trim() ? slugify(slug) : slugify(title);

    // Check slug uniqueness
    const existing = await prisma.dharmicConcept.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Validation Error: A concept with slug '${slug}' already exists.` },
        { status: 400 }
      );
    }

    const validStatus = ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status) ? status : 'DRAFT';
    const validCategory = category && typeof category === 'string' ? category.trim() : 'General';

    const newConcept = await prisma.dharmicConcept.create({
      data: {
        title: title.trim(),
        slug,
        category: validCategory,
        summary: summary ? summary.trim() : null,
        body: contentBody.trim(),
        status: validStatus,
        bannerEyebrow: bannerEyebrow ? bannerEyebrow.trim() : null,
        bannerRating: bannerRating ? bannerRating.trim() : null,
        bannerClassification: bannerClassification ? bannerClassification.trim() : null,
        bannerTitle: bannerTitle ? bannerTitle.trim() : null,
        bannerDescription: bannerDescription ? bannerDescription.trim() : null,
        bannerPrimaryCtaText: bannerPrimaryCtaText ? bannerPrimaryCtaText.trim() : null,
        bannerPrimaryCtaLink: bannerPrimaryCtaLink ? bannerPrimaryCtaLink.trim() : null,
        bannerSecondaryCtaText: bannerSecondaryCtaText ? bannerSecondaryCtaText.trim() : null,
        bannerSecondaryCtaLink: bannerSecondaryCtaLink ? bannerSecondaryCtaLink.trim() : null,
        bannerShareButtonText: bannerShareButtonText ? bannerShareButtonText.trim() : null,
        threeStoriesTitle: threeStoriesTitle ? threeStoriesTitle.trim() : null,
        threeStoriesIntro: threeStoriesIntro ? threeStoriesIntro.trim() : null,
        threeStoriesSupportingText: threeStoriesSupportingText ? threeStoriesSupportingText.trim() : null,
        storiesItemsJson: storiesItemsJson ? (typeof storiesItemsJson === 'string' ? storiesItemsJson : JSON.stringify(storiesItemsJson)) : null,
        threeStoriesGalleryJson: threeStoriesGalleryJson ? (typeof threeStoriesGalleryJson === 'string' ? threeStoriesGalleryJson : JSON.stringify(threeStoriesGalleryJson)) : null,
        threeStoriesCaption: threeStoriesCaption ? threeStoriesCaption.trim() : null,
        shareSectionHeading: shareSectionHeading ? shareSectionHeading.trim() : null,
        shareSharedContent: shareSharedContent ? shareSharedContent.trim() : null,
        shareNotSharedContent: shareNotSharedContent ? shareNotSharedContent.trim() : null,
        shareHighlightStatement: shareHighlightStatement ? shareHighlightStatement.trim() : null,
        shareSupportingDescription: shareSupportingDescription ? shareSupportingDescription.trim() : null,
        shareTraditionTag: shareTraditionTag ? shareTraditionTag.trim() : null,
        mythsSectionHeading: mythsSectionHeading ? mythsSectionHeading.trim() : null,
        mythsItemsJson: mythsItemsJson ? (typeof mythsItemsJson === 'string' ? mythsItemsJson : JSON.stringify(mythsItemsJson)) : null,
        reframeLabel: reframeLabel ? reframeLabel.trim() : null,
        reframeContent: reframeContent ? reframeContent.trim() : null,
        relatedRitualGuidesJson: relatedRitualGuidesJson ? (typeof relatedRitualGuidesJson === 'string' ? relatedRitualGuidesJson : JSON.stringify(relatedRitualGuidesJson)) : null,
        relatedPujansJson: relatedPujansJson ? (typeof relatedPujansJson === 'string' ? relatedPujansJson : JSON.stringify(relatedPujansJson)) : null,
        relatedConceptsJson: relatedConceptsJson ? (typeof relatedConceptsJson === 'string' ? relatedConceptsJson : JSON.stringify(relatedConceptsJson)) : null,
        relatedDatesJson: relatedDatesJson ? (typeof relatedDatesJson === 'string' ? relatedDatesJson : JSON.stringify(relatedDatesJson)) : null,
        authorId: user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Dharmic Concept created successfully.',
        data: newConcept,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API DharmicConcept POST] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create Dharmic Concept.' },
      { status: 500 }
    );
  }
});
