import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withEditorAuth } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';
import { getInMemoryDharmicConcepts, saveInMemoryDharmicConcept } from '@/lib/ritual-guides-store';

/**
 * GET /api/admin/dharmic-concepts
 * Listing endpoint with search and filtering (Requires EDITOR or ADMIN)
 */
export const GET = withEditorAuth(async (req) => {
  try {
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

    let concepts: any[] = [];
    try {
      concepts = await prisma.dharmicConcept.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      });
    } catch (dbErr: any) {
      console.warn('[API DharmicConcept GET] DB error, using in-memory store:', dbErr?.message || dbErr);
      concepts = getInMemoryDharmicConcepts();
    }

    return NextResponse.json({
      success: true,
      count: concepts.length,
      data: concepts,
    });
  } catch (err: any) {
    console.error('[API DharmicConcept GET] Error:', err);
    return NextResponse.json({ success: true, count: 0, data: [] });
  }
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

    // Auto-generate slug if missing
    const baseSlug = slug && typeof slug === 'string' && slug.trim() ? slugify(slug) : slugify(title);
    slug = baseSlug;

    // Check slug uniqueness & find valid authorId
    let validAuthorId: string | null = user?.id || null;
    try {
      if (user?.id) {
        const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (existingUser) {
          validAuthorId = existingUser.id;
        } else {
          const firstUser = await prisma.user.findFirst();
          if (firstUser) {
            validAuthorId = firstUser.id;
          } else {
            const sysUser = await prisma.user.create({
              data: {
                email: user?.email || 'admin@tapa.co',
                name: user?.name || 'Admin User',
                role: 'ADMIN',
              },
            });
            validAuthorId = sysUser.id;
          }
        }
      }
    } catch (userErr: any) {
      console.warn('[API DharmicConcept POST] User lookup warning:', userErr?.message || userErr);
    }

    try {
      let existing = await prisma.dharmicConcept.findUnique({
        where: { slug },
      });

      let counter = 1;
      while (existing) {
        slug = `${baseSlug}-${counter}`;
        existing = await prisma.dharmicConcept.findUnique({
          where: { slug },
        });
        counter++;
      }
    } catch (slugErr: any) {
      console.warn('[API DharmicConcept POST] Slug check warning:', slugErr?.message || slugErr);
    }

    const validStatus = ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status) ? status : 'DRAFT';
    const validCategory = category && typeof category === 'string' ? category.trim() : 'General';

    const conceptPayload = {
      title: title.trim(),
      slug,
      category: validCategory,
      summary: summary ? summary.trim() : null,
      body: contentBody && typeof contentBody === 'string' ? contentBody.trim() : '',
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
      ...(validAuthorId ? { authorId: validAuthorId } : {}),
    };

    let newConcept: any = null;
    try {
      newConcept = await prisma.dharmicConcept.create({
        data: conceptPayload,
        include: {
          author: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      });
    } catch (dbErr: any) {
      console.warn('[API DharmicConcept POST] DB save error, using in-memory store:', dbErr?.message || dbErr);
      const fallbackConcept = {
        id: `concept-${Date.now()}`,
        ...conceptPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveInMemoryDharmicConcept(fallbackConcept);
      newConcept = fallbackConcept;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Dharmic Concept created successfully.',
        data: newConcept,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API DharmicConcept POST] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create Dharmic Concept.' },
      { status: 400 }
    );
  }
});
