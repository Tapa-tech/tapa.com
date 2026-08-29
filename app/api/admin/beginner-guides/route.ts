import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withEditorAuth } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';

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
      { bannerTitle: { contains: search } },
      { bannerDescription: { contains: search } },
    ];
  }

  if (category && category !== 'ALL') {
    whereClause.category = category;
  }

  if (status && status !== 'ALL') {
    whereClause.status = status;
  }

  const guides = await prisma.beginnerGuide.findMany({
    where: whereClause,
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({
    success: true,
    count: guides.length,
    data: guides,
  });
});

export const POST = withEditorAuth(async (req) => {
  try {
    const body = await req.json();
    const {
      title,
      category,
      status,
      bannerEyebrow,
      bannerBadgeText,
      bannerBadgeIcon,
      bannerTitle,
      bannerDescription,
      bannerPrimaryCtaText,
      bannerPrimaryCtaAction,
      bannerPrimaryCtaTarget,
      bannerSecondaryCtaText,
      bannerSecondaryCtaAction,
      bannerSecondaryCtaTarget,
      bannerShareEnabled,
      bannerShareButtonText,
      introHeading,
      introDescription,
      introImage,
      introImageAltText,
      introImageCaption,
      whySectionHeading,
      whySectionSubtitle,
      kandasJson,
      whereToStartHeading,
      whereToStartIntro,
      whereToStartHighlight,
      whereToStartSupporting,
      whereToStartSubHeading,
      whereToStartSubIntro,
      whereToStartFinalDescription,
      commonWorriesHeading,
      commonWorriesSubtitle,
      commonWorriesJson,
      commonWorriesClosing,
      whatToReadNextHeading,
      whatToReadNextSubtitle,
      whatToReadNextItemsJson,
    } = body || {};
    let { slug } = body || {};

    const guideTitle = bannerTitle || title;
    if (!guideTitle || typeof guideTitle !== 'string' || !guideTitle.trim()) {
      return NextResponse.json(
        { success: false, error: 'Validation Error: Title is required.' },
        { status: 400 }
      );
    }

    const baseSlug = slug && typeof slug === 'string' && slug.trim() ? slugify(slug) : slugify(guideTitle);
    slug = baseSlug;
    let existing = await prisma.beginnerGuide.findUnique({
      where: { slug },
    });

    let counter = 1;
    while (existing) {
      slug = `${baseSlug}-${counter}`;
      existing = await prisma.beginnerGuide.findUnique({
        where: { slug },
      });
      counter++;
    }

    const validStatus = ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status) ? status : 'DRAFT';
    const validCategory = category && typeof category === 'string' ? category.trim() : 'General';

    const newGuide = await prisma.beginnerGuide.create({
      data: {
        title: guideTitle.trim(),
        slug,
        category: validCategory,
        status: validStatus,
        bannerEyebrow: bannerEyebrow ? bannerEyebrow.trim() : null,
        bannerBadgeText: bannerBadgeText ? bannerBadgeText.trim() : null,
        bannerBadgeIcon: bannerBadgeIcon ? bannerBadgeIcon.trim() : null,
        bannerTitle: bannerTitle ? bannerTitle.trim() : guideTitle.trim(),
        bannerDescription: bannerDescription ? bannerDescription.trim() : null,
        bannerPrimaryCtaText: bannerPrimaryCtaText ? bannerPrimaryCtaText.trim() : null,
        bannerPrimaryCtaAction: bannerPrimaryCtaAction ? bannerPrimaryCtaAction.trim() : null,
        bannerPrimaryCtaTarget: bannerPrimaryCtaTarget ? bannerPrimaryCtaTarget.trim() : null,
        bannerSecondaryCtaText: bannerSecondaryCtaText ? bannerSecondaryCtaText.trim() : null,
        bannerSecondaryCtaAction: bannerSecondaryCtaAction ? bannerSecondaryCtaAction.trim() : null,
        bannerSecondaryCtaTarget: bannerSecondaryCtaTarget ? bannerSecondaryCtaTarget.trim() : null,
        bannerShareEnabled: typeof bannerShareEnabled === 'boolean' ? bannerShareEnabled : true,
        bannerShareButtonText: bannerShareButtonText ? bannerShareButtonText.trim() : 'Share',
        introHeading: introHeading ? introHeading.trim() : null,
        introDescription: introDescription ? introDescription.trim() : null,
        introImage: introImage ? introImage.trim() : null,
        introImageAltText: introImageAltText ? introImageAltText.trim() : null,
        introImageCaption: introImageCaption ? introImageCaption.trim() : null,
        whySectionHeading: whySectionHeading ? whySectionHeading.trim() : null,
        whySectionSubtitle: whySectionSubtitle ? whySectionSubtitle.trim() : null,
        kandasJson: kandasJson ? (typeof kandasJson === 'string' ? kandasJson : JSON.stringify(kandasJson)) : null,
        whereToStartHeading: whereToStartHeading ? whereToStartHeading.trim() : null,
        whereToStartIntro: whereToStartIntro ? whereToStartIntro.trim() : null,
        whereToStartHighlight: whereToStartHighlight ? whereToStartHighlight.trim() : null,
        whereToStartSupporting: whereToStartSupporting ? whereToStartSupporting.trim() : null,
        whereToStartSubHeading: whereToStartSubHeading ? whereToStartSubHeading.trim() : null,
        whereToStartSubIntro: whereToStartSubIntro ? whereToStartSubIntro.trim() : null,
        whereToStartFinalDescription: whereToStartFinalDescription ? whereToStartFinalDescription.trim() : null,
        commonWorriesHeading: commonWorriesHeading ? commonWorriesHeading.trim() : null,
        commonWorriesSubtitle: commonWorriesSubtitle ? commonWorriesSubtitle.trim() : null,
        commonWorriesJson: commonWorriesJson ? (typeof commonWorriesJson === 'string' ? commonWorriesJson : JSON.stringify(commonWorriesJson)) : null,
        commonWorriesClosing: commonWorriesClosing ? commonWorriesClosing.trim() : null,
        whatToReadNextHeading: whatToReadNextHeading ? whatToReadNextHeading.trim() : null,
        whatToReadNextSubtitle: whatToReadNextSubtitle ? whatToReadNextSubtitle.trim() : null,
        whatToReadNextItemsJson: whatToReadNextItemsJson ? (typeof whatToReadNextItemsJson === 'string' ? whatToReadNextItemsJson : JSON.stringify(whatToReadNextItemsJson)) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Beginner Guide created successfully.',
      data: newGuide,
    });
  } catch (error: any) {
    console.error('Error creating Beginner Guide:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
});
