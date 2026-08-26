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
 * GET /api/admin/beginner-guides/[id]
 */
export const GET = withEditorAuth(async (req, { params }) => {
  const { id } = params;

  const guide = await prisma.beginnerGuide.findUnique({
    where: { id },
  });

  if (!guide) {
    return NextResponse.json(
      { success: false, error: 'Beginner Guide not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: guide,
  });
});

/**
 * PUT /api/admin/beginner-guides/[id]
 */
export const PUT = withEditorAuth(async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();

    const existing = await prisma.beginnerGuide.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Beginner Guide not found.' },
        { status: 404 }
      );
    }

    const {
      title,
      slug,
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

    const updateData: any = {};

    const guideTitle = bannerTitle || title;
    if (guideTitle && typeof guideTitle === 'string') {
      updateData.title = guideTitle.trim();
      updateData.bannerTitle = guideTitle.trim();
    }

    if (category && typeof category === 'string') {
      updateData.category = category.trim();
    }

    if (status && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      updateData.status = status;
    }

    if (bannerEyebrow !== undefined) updateData.bannerEyebrow = bannerEyebrow ? bannerEyebrow.trim() : null;
    if (bannerBadgeText !== undefined) updateData.bannerBadgeText = bannerBadgeText ? bannerBadgeText.trim() : null;
    if (bannerBadgeIcon !== undefined) updateData.bannerBadgeIcon = bannerBadgeIcon ? bannerBadgeIcon.trim() : null;
    if (bannerDescription !== undefined) updateData.bannerDescription = bannerDescription ? bannerDescription.trim() : null;
    if (bannerPrimaryCtaText !== undefined) updateData.bannerPrimaryCtaText = bannerPrimaryCtaText ? bannerPrimaryCtaText.trim() : null;
    if (bannerPrimaryCtaAction !== undefined) updateData.bannerPrimaryCtaAction = bannerPrimaryCtaAction ? bannerPrimaryCtaAction.trim() : null;
    if (bannerPrimaryCtaTarget !== undefined) updateData.bannerPrimaryCtaTarget = bannerPrimaryCtaTarget ? bannerPrimaryCtaTarget.trim() : null;
    if (bannerSecondaryCtaText !== undefined) updateData.bannerSecondaryCtaText = bannerSecondaryCtaText ? bannerSecondaryCtaText.trim() : null;
    if (bannerSecondaryCtaAction !== undefined) updateData.bannerSecondaryCtaAction = bannerSecondaryCtaAction ? bannerSecondaryCtaAction.trim() : null;
    if (bannerSecondaryCtaTarget !== undefined) updateData.bannerSecondaryCtaTarget = bannerSecondaryCtaTarget ? bannerSecondaryCtaTarget.trim() : null;
    if (bannerShareEnabled !== undefined) updateData.bannerShareEnabled = Boolean(bannerShareEnabled);
    if (bannerShareButtonText !== undefined) updateData.bannerShareButtonText = bannerShareButtonText ? bannerShareButtonText.trim() : null;

    if (introHeading !== undefined) updateData.introHeading = introHeading ? introHeading.trim() : null;
    if (introDescription !== undefined) updateData.introDescription = introDescription ? introDescription.trim() : null;
    if (introImage !== undefined) updateData.introImage = introImage ? introImage.trim() : null;
    if (introImageAltText !== undefined) updateData.introImageAltText = introImageAltText ? introImageAltText.trim() : null;
    if (introImageCaption !== undefined) updateData.introImageCaption = introImageCaption ? introImageCaption.trim() : null;

    if (whySectionHeading !== undefined) updateData.whySectionHeading = whySectionHeading ? whySectionHeading.trim() : null;
    if (whySectionSubtitle !== undefined) updateData.whySectionSubtitle = whySectionSubtitle ? whySectionSubtitle.trim() : null;
    if (kandasJson !== undefined) updateData.kandasJson = kandasJson ? (typeof kandasJson === 'string' ? kandasJson : JSON.stringify(kandasJson)) : null;

    if (whereToStartHeading !== undefined) updateData.whereToStartHeading = whereToStartHeading ? whereToStartHeading.trim() : null;
    if (whereToStartIntro !== undefined) updateData.whereToStartIntro = whereToStartIntro ? whereToStartIntro.trim() : null;
    if (whereToStartHighlight !== undefined) updateData.whereToStartHighlight = whereToStartHighlight ? whereToStartHighlight.trim() : null;
    if (whereToStartSupporting !== undefined) updateData.whereToStartSupporting = whereToStartSupporting ? whereToStartSupporting.trim() : null;
    if (whereToStartSubHeading !== undefined) updateData.whereToStartSubHeading = whereToStartSubHeading ? whereToStartSubHeading.trim() : null;
    if (whereToStartSubIntro !== undefined) updateData.whereToStartSubIntro = whereToStartSubIntro ? whereToStartSubIntro.trim() : null;
    if (whereToStartFinalDescription !== undefined) updateData.whereToStartFinalDescription = whereToStartFinalDescription ? whereToStartFinalDescription.trim() : null;

    if (commonWorriesHeading !== undefined) updateData.commonWorriesHeading = commonWorriesHeading ? commonWorriesHeading.trim() : null;
    if (commonWorriesSubtitle !== undefined) updateData.commonWorriesSubtitle = commonWorriesSubtitle ? commonWorriesSubtitle.trim() : null;
    if (commonWorriesJson !== undefined) updateData.commonWorriesJson = commonWorriesJson ? (typeof commonWorriesJson === 'string' ? commonWorriesJson : JSON.stringify(commonWorriesJson)) : null;
    if (commonWorriesClosing !== undefined) updateData.commonWorriesClosing = commonWorriesClosing ? commonWorriesClosing.trim() : null;

    if (whatToReadNextHeading !== undefined) updateData.whatToReadNextHeading = whatToReadNextHeading ? whatToReadNextHeading.trim() : null;
    if (whatToReadNextSubtitle !== undefined) updateData.whatToReadNextSubtitle = whatToReadNextSubtitle ? whatToReadNextSubtitle.trim() : null;
    if (whatToReadNextItemsJson !== undefined) updateData.whatToReadNextItemsJson = whatToReadNextItemsJson ? (typeof whatToReadNextItemsJson === 'string' ? whatToReadNextItemsJson : JSON.stringify(whatToReadNextItemsJson)) : null;

    if (slug && typeof slug === 'string') {
      const formattedSlug = slugify(slug);
      if (formattedSlug !== existing.slug) {
        const slugExists = await prisma.beginnerGuide.findUnique({
          where: { slug: formattedSlug },
        });

        if (slugExists) {
          return NextResponse.json(
            { success: false, error: `Validation Error: A guide with slug '${formattedSlug}' already exists.` },
            { status: 400 }
          );
        }

        updateData.slug = formattedSlug;
      }
    }

    const updatedGuide = await prisma.beginnerGuide.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Beginner Guide updated successfully.',
      data: updatedGuide,
    });
  } catch (error: any) {
    console.error('Error updating Beginner Guide:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/admin/beginner-guides/[id]
 */
export const DELETE = withEditorAuth(async (req, { params }) => {
  try {
    const { id } = params;

    const existing = await prisma.beginnerGuide.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Beginner Guide not found.' },
        { status: 404 }
      );
    }

    await prisma.beginnerGuide.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Beginner Guide deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting Beginner Guide:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
});
