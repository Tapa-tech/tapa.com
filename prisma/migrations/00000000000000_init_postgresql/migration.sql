-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN', 'SUPER_USER');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PLACED', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLATION_REQUESTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'RAZORPAY');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('BY_FESTIVAL', 'BY_RITUAL', 'GRIHA_LIFE_EVENTS', 'DAILY_PUJA_ESSENTIALS');

-- CreateTable
CREATE TABLE "RitualGuide" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sectionLabel" TEXT,
    "category" TEXT,
    "rating" TEXT,
    "classification" TEXT,
    "guideTitle" TEXT,
    "guideSubtitle" TEXT,
    "festivalName" TEXT,
    "panchangLocation" TEXT,
    "primaryButtonText" TEXT,
    "primaryButtonAction" TEXT,
    "primaryButtonTarget" TEXT,
    "secondaryButtonText" TEXT,
    "secondaryButtonAction" TEXT,
    "secondaryButtonTarget" TEXT,
    "thirdButtonText" TEXT,
    "thirdButtonAction" TEXT,
    "thirdButtonTarget" TEXT,
    "sotSectionHeading" TEXT,
    "sotButtonText" TEXT,
    "sotButtonAction" TEXT,
    "sotButtonTarget" TEXT,
    "sotPracticeLabel" TEXT,
    "sotPracticeTitle" TEXT,
    "sotPracticeCategory" TEXT,
    "sotPracticeRating" TEXT,
    "sotPracticeClassification" TEXT,
    "sotScripturalSource" TEXT,
    "sotParentScripture" TEXT,
    "sotSourceReference" TEXT,
    "sotSourceUrl" TEXT,
    "sotSourceNotes" TEXT,
    "sotSummaryLabel" TEXT,
    "sotCorePracticesCount" INTEGER,
    "sotScripturalElementsCount" INTEGER,
    "sotRegionalCustomsCount" INTEGER,
    "sotCorrectionsCount" INTEGER,
    "storyTitle" TEXT,
    "storyIntroduction" TEXT,
    "storySubsectionTitle" TEXT,
    "storyContent" TEXT,
    "storyPracticeCategory" TEXT,
    "storyPracticeRating" TEXT,
    "storyPracticeClassification" TEXT,
    "storyScripturalSource" TEXT,
    "storyContinuation" TEXT,
    "storyImage" TEXT,
    "storyImageAltText" TEXT,
    "storyImageCaption" TEXT,
    "storyImageCredit" TEXT,
    "storyImageSource" TEXT,
    "sankalpaTitle" TEXT,
    "sankalpaSubtitle" TEXT,
    "sankalpaInstruction" TEXT,
    "sankalpaText" TEXT,
    "sankalpaMeaning" TEXT,
    "sankalpaExplanation" TEXT,
    "sankalpaDetailsJson" TEXT,
    "sankalpaNoteHeading" TEXT,
    "sankalpaNoteContent" TEXT,
    "sankalpaImage" TEXT,
    "vidhiDaysJson" TEXT,
    "kathaTitle" TEXT,
    "kathaSubtitle" TEXT,
    "kathaScripturalReference" TEXT,
    "kathaHeadline" TEXT,
    "kathaIntroduction" TEXT,
    "kathaCardsJson" TEXT,
    "kathaSupportingExplanation" TEXT,
    "kathaAudio" TEXT,
    "kathaAudioButtonText" TEXT,
    "kathaAudioDuration" TEXT,
    "kathaFullKathaButtonText" TEXT,
    "kathaFullKathaLink" TEXT,
    "kathaImage" TEXT,
    "kathaImageAltText" TEXT,
    "kathaImageCaption" TEXT,
    "festivalContextTitle" TEXT,
    "festivalContextIntroduction" TEXT,
    "festivalContextDetails" TEXT,
    "festivalPracticeCategory" TEXT,
    "festivalPracticeRating" TEXT,
    "festivalClassification" TEXT,
    "sandhiPujaInformation" TEXT,
    "samagriTitle" TEXT,
    "samagriSubtitle" TEXT,
    "samagriItemsJson" TEXT,
    "samagriAudio" TEXT,
    "samagriAudioButtonText" TEXT,
    "samagriAudioDuration" TEXT,
    "fastingTitle" TEXT,
    "fastingSubtitle" TEXT,
    "fastingOptionsJson" TEXT,
    "fastingGuidanceHeading" TEXT,
    "fastingGuidanceContent" TEXT,
    "mythsTitle" TEXT,
    "mythsSubtitle" TEXT,
    "mythsItemsJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RitualGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DharmicConcept" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "summary" TEXT,
    "body" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "bannerEyebrow" TEXT,
    "bannerRating" TEXT,
    "bannerClassification" TEXT,
    "bannerTitle" TEXT,
    "bannerDescription" TEXT,
    "bannerPrimaryCtaText" TEXT,
    "bannerPrimaryCtaLink" TEXT,
    "bannerSecondaryCtaText" TEXT,
    "bannerSecondaryCtaLink" TEXT,
    "bannerShareButtonText" TEXT,
    "threeStoriesTitle" TEXT,
    "threeStoriesIntro" TEXT,
    "threeStoriesSupportingText" TEXT,
    "storiesItemsJson" TEXT,
    "threeStoriesGalleryJson" TEXT,
    "threeStoriesCaption" TEXT,
    "shareSectionHeading" TEXT,
    "shareSharedContent" TEXT,
    "shareNotSharedContent" TEXT,
    "shareHighlightStatement" TEXT,
    "shareSupportingDescription" TEXT,
    "shareTraditionTag" TEXT,
    "mythsSectionHeading" TEXT,
    "mythsItemsJson" TEXT,
    "reframeLabel" TEXT,
    "reframeContent" TEXT,
    "relatedRitualGuidesJson" TEXT,
    "relatedPujansJson" TEXT,
    "relatedConceptsJson" TEXT,
    "relatedDatesJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "DharmicConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "phone" TEXT,
    "phoneVerified" TIMESTAMP(3),
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "activeSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "OtpVerification" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "hashedOtp" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtpVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeginnerGuide" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "bannerEyebrow" TEXT,
    "bannerBadgeText" TEXT,
    "bannerBadgeIcon" TEXT,
    "bannerTitle" TEXT,
    "bannerDescription" TEXT,
    "bannerPrimaryCtaText" TEXT,
    "bannerPrimaryCtaAction" TEXT,
    "bannerPrimaryCtaTarget" TEXT,
    "bannerSecondaryCtaText" TEXT,
    "bannerSecondaryCtaAction" TEXT,
    "bannerSecondaryCtaTarget" TEXT,
    "bannerShareEnabled" BOOLEAN NOT NULL DEFAULT true,
    "bannerShareButtonText" TEXT DEFAULT 'Share',
    "introHeading" TEXT,
    "introDescription" TEXT,
    "introImage" TEXT,
    "introImageAltText" TEXT,
    "introImageCaption" TEXT,
    "whySectionHeading" TEXT,
    "whySectionSubtitle" TEXT,
    "kandasJson" TEXT,
    "whereToStartHeading" TEXT,
    "whereToStartIntro" TEXT,
    "whereToStartHighlight" TEXT,
    "whereToStartSupporting" TEXT,
    "whereToStartSubHeading" TEXT,
    "whereToStartSubIntro" TEXT,
    "whereToStartFinalDescription" TEXT,
    "commonWorriesHeading" TEXT,
    "commonWorriesSubtitle" TEXT,
    "commonWorriesJson" TEXT,
    "commonWorriesClosing" TEXT,
    "whatToReadNextHeading" TEXT,
    "whatToReadNextSubtitle" TEXT,
    "whatToReadNextItemsJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeginnerGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanchangEntry" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "dateObj" TIMESTAMP(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "tithiName" TEXT NOT NULL,
    "tithiDetail" TEXT NOT NULL,
    "paksha" TEXT NOT NULL,
    "pakshaDetail" TEXT NOT NULL,
    "nakshatra" TEXT NOT NULL,
    "isAuspicious" BOOLEAN NOT NULL DEFAULT false,
    "sunrise" TEXT NOT NULL,
    "sunset" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'New Delhi, India',
    "source" TEXT NOT NULL DEFAULT 'AUTO SYNCED',
    "lastSynced" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PanchangEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerMobile" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "subtotal" INTEGER NOT NULL,
    "deliveryCharge" INTEGER NOT NULL DEFAULT 0,
    "grandTotal" INTEGER NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'PLACED',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "lineTotal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" "ProductCategory" NOT NULL DEFAULT 'BY_FESTIVAL',
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "featuredImage" TEXT,
    "imagesJson" TEXT,
    "samagriItemsJson" TEXT,
    "significanceLabel" TEXT,
    "significanceHeading" TEXT,
    "significanceDescription" TEXT,
    "whatsInsideLabel" TEXT,
    "whatsInsideHeading" TEXT,
    "whatsInsideDescription" TEXT,
    "howToUseLabel" TEXT,
    "howToUseHeading" TEXT,
    "howToUseStepsJson" TEXT,
    "supportingText" TEXT,
    "dispatchInfo" TEXT,
    "expectedDelivery" TEXT,
    "serviceableAreas" TEXT,
    "courierInfo" TEXT,
    "cancellationInfo" TEXT,
    "cancellationPolicyText" TEXT,
    "cancellationPolicyUrl" TEXT,
    "returnsInfo" TEXT,
    "returnsPolicyText" TEXT,
    "returnsPolicyUrl" TEXT,
    "damageInTransitInfo" TEXT,
    "damageClaimText" TEXT,
    "damageClaimUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sanskritTitle" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Purana',
    "citationsCount" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "helpfulVotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnouncementBar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Header Banner',
    "targetUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnnouncementBar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpcomingFeature" (
    "id" TEXT NOT NULL,
    "key" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "status" TEXT NOT NULL DEFAULT 'In Planning',
    "targetRelease" TEXT,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "requests" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpcomingFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "optInDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consentGiven" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "actor" TEXT NOT NULL DEFAULT 'system@tapa.co',
    "role" TEXT NOT NULL DEFAULT 'SYSTEM',
    "target" TEXT,
    "ipAddress" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "details" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "resourceId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DownloadLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderCategory" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "columnsJson" TEXT NOT NULL,
    "featuredJson" TEXT NOT NULL,
    "footerJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeaderCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "brandJson" TEXT NOT NULL,
    "utilityJson" TEXT NOT NULL,
    "sitemapJson" TEXT NOT NULL,
    "columnsJson" TEXT NOT NULL,
    "correctionsJson" TEXT NOT NULL,
    "legalJson" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTerm" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'SANSKRIT',
    "devanagari" TEXT,
    "pronunciation" TEXT,
    "category" TEXT NOT NULL DEFAULT 'PRACTICE',
    "definition" TEXT NOT NULL,
    "appearsInJson" TEXT,
    "relatedConceptTitle" TEXT,
    "relatedConceptSlug" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPage" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'default',
    "heroEyebrow" TEXT,
    "heroTitle" TEXT,
    "heroStandfirst" TEXT,
    "heroParagraph1" TEXT,
    "heroParagraph2" TEXT,
    "heroPullQuote" TEXT,
    "filmLogo" TEXT,
    "filmSpec" TEXT,
    "whySectionNumber" TEXT,
    "whyTitleDevanagari" TEXT,
    "whyDevanagariDesc" TEXT,
    "whyParagraph2" TEXT,
    "founderTrayTitle" TEXT,
    "founderName" TEXT,
    "founderDesignation" TEXT,
    "founderLetterTitle" TEXT,
    "founderLetterP1" TEXT,
    "founderLetterP2" TEXT,
    "founderLetterP3" TEXT,
    "founderLetterP4" TEXT,
    "founderLetterP5" TEXT,
    "founderFamilyImage" TEXT,
    "founderFamilyCaption" TEXT,
    "founderPullQuote1" TEXT,
    "founderLetterP6" TEXT,
    "founderLetterP7" TEXT,
    "founderLetterP8" TEXT,
    "founderSignatureName" TEXT,
    "founderSignatureTitle" TEXT,
    "founderSignatureCompany" TEXT,
    "founderPullQuote2" TEXT,
    "founderLetterP9" TEXT,
    "founderLetterP10" TEXT,
    "founderAvatar" TEXT,
    "coreValuesHeading" TEXT,
    "coreValuesSubtitle" TEXT,
    "coreValuesIntro" TEXT,
    "editorialSectionNumber" TEXT,
    "editorialTitle" TEXT,
    "editorialStandfirst" TEXT,
    "editorialDharmaTitle" TEXT,
    "editorialDharmaSub" TEXT,
    "editorialDharmaDesc" TEXT,
    "editorialPrathaTitle" TEXT,
    "editorialPrathaSub" TEXT,
    "editorialPrathaDesc" TEXT,
    "editorialBhrantiTitle" TEXT,
    "editorialBhrantiSub" TEXT,
    "editorialBhrantiDesc" TEXT,
    "editorialRuleText" TEXT,
    "editorialConsensusText" TEXT,
    "editorialSeparatedText" TEXT,
    "editorialWeighTitle" TEXT,
    "editorialWeighP1" TEXT,
    "editorialWeighP2" TEXT,
    "editorialCtaText" TEXT,
    "editorialCtaUrl" TEXT,
    "glossarySectionNumber" TEXT,
    "glossaryTitle" TEXT,
    "glossaryStandfirst" TEXT,
    "glossaryParagraph1" TEXT,
    "glossaryParagraph2" TEXT,
    "glossaryCtaText" TEXT,
    "glossaryCtaUrl" TEXT,
    "kitsSectionNumber" TEXT,
    "kitsTitle" TEXT,
    "kitsStandfirst" TEXT,
    "kitsParagraph1" TEXT,
    "kitsParagraph2" TEXT,
    "kitsHeading" TEXT,
    "kitsNote" TEXT,
    "kitsCtaText" TEXT,
    "kitsCtaUrl" TEXT,
    "purohitSectionNumber" TEXT,
    "purohitTitle" TEXT,
    "purohitChipText" TEXT,
    "purohitParagraph" TEXT,
    "purohitBookingHeading" TEXT,
    "purohitArrangeHeading" TEXT,
    "purohitNotHappenHeading" TEXT,
    "purohitNotHappenDesc" TEXT,
    "purohitNotifyCtaText" TEXT,
    "circleSectionNumber" TEXT,
    "circleTitle" TEXT,
    "circlePriceChip" TEXT,
    "circleStandfirst" TEXT,
    "circleParagraph1" TEXT,
    "circleParagraph2" TEXT,
    "circleTrayTitle" TEXT,
    "circleLeavingNote" TEXT,
    "circleJoinCtaText" TEXT,
    "closingLabel" TEXT,
    "closingPreText" TEXT,
    "closingText" TEXT,
    "closingLogo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutCoreValue" (
    "id" TEXT NOT NULL,
    "aboutPageId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutCoreValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutEditorialSource" (
    "id" TEXT NOT NULL,
    "aboutPageId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutEditorialSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutRitualKitPoint" (
    "id" TEXT NOT NULL,
    "aboutPageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutRitualKitPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPurohitBookingPoint" (
    "id" TEXT NOT NULL,
    "aboutPageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutPurohitBookingPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPurohitArrangementPoint" (
    "id" TEXT NOT NULL,
    "aboutPageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutPurohitArrangementPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutCircleStep" (
    "id" TEXT NOT NULL,
    "aboutPageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutCircleStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RitualGuide_slug_key" ON "RitualGuide"("slug");

-- CreateIndex
CREATE INDEX "RitualGuide_slug_idx" ON "RitualGuide"("slug");

-- CreateIndex
CREATE INDEX "RitualGuide_status_idx" ON "RitualGuide"("status");

-- CreateIndex
CREATE INDEX "RitualGuide_status_category_idx" ON "RitualGuide"("status", "category");

-- CreateIndex
CREATE UNIQUE INDEX "DharmicConcept_slug_key" ON "DharmicConcept"("slug");

-- CreateIndex
CREATE INDEX "DharmicConcept_slug_idx" ON "DharmicConcept"("slug");

-- CreateIndex
CREATE INDEX "DharmicConcept_status_idx" ON "DharmicConcept"("status");

-- CreateIndex
CREATE INDEX "DharmicConcept_category_idx" ON "DharmicConcept"("category");

-- CreateIndex
CREATE INDEX "DharmicConcept_authorId_idx" ON "DharmicConcept"("authorId");

-- CreateIndex
CREATE INDEX "DharmicConcept_status_category_idx" ON "DharmicConcept"("status", "category");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_role_createdAt_idx" ON "User"("role", "createdAt");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "OtpVerification_phone_key" ON "OtpVerification"("phone");

-- CreateIndex
CREATE INDEX "OtpVerification_phone_idx" ON "OtpVerification"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "BeginnerGuide_slug_key" ON "BeginnerGuide"("slug");

-- CreateIndex
CREATE INDEX "BeginnerGuide_slug_idx" ON "BeginnerGuide"("slug");

-- CreateIndex
CREATE INDEX "BeginnerGuide_status_idx" ON "BeginnerGuide"("status");

-- CreateIndex
CREATE INDEX "BeginnerGuide_status_category_idx" ON "BeginnerGuide"("status", "category");

-- CreateIndex
CREATE UNIQUE INDEX "PanchangEntry_dateObj_key" ON "PanchangEntry"("dateObj");

-- CreateIndex
CREATE INDEX "PanchangEntry_year_idx" ON "PanchangEntry"("year");

-- CreateIndex
CREATE INDEX "PanchangEntry_date_idx" ON "PanchangEntry"("date");

-- CreateIndex
CREATE INDEX "PanchangEntry_isAuspicious_dateObj_idx" ON "PanchangEntry"("isAuspicious", "dateObj");

-- CreateIndex
CREATE INDEX "PanchangEntry_year_paksha_tithiName_idx" ON "PanchangEntry"("year", "paksha", "tithiName");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_customerMobile_idx" ON "Order"("customerMobile");

-- CreateIndex
CREATE INDEX "Order_customerEmail_idx" ON "Order"("customerEmail");

-- CreateIndex
CREATE INDEX "Order_orderStatus_idx" ON "Order"("orderStatus");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_status_category_idx" ON "Product"("status", "category");

-- CreateIndex
CREATE INDEX "Product_status_createdAt_idx" ON "Product"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Source_category_idx" ON "Source"("category");

-- CreateIndex
CREATE INDEX "Faq_category_idx" ON "Faq"("category");

-- CreateIndex
CREATE INDEX "AnnouncementBar_isActive_idx" ON "AnnouncementBar"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UpcomingFeature_key_key" ON "UpcomingFeature"("key");

-- CreateIndex
CREATE INDEX "UpcomingFeature_status_idx" ON "UpcomingFeature"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_whatsappNumber_key" ON "Subscriber"("whatsappNumber");

-- CreateIndex
CREATE INDEX "Subscriber_whatsappNumber_idx" ON "Subscriber"("whatsappNumber");

-- CreateIndex
CREATE INDEX "Subscriber_status_idx" ON "Subscriber"("status");

-- CreateIndex
CREATE INDEX "AuditLog_event_idx" ON "AuditLog"("event");

-- CreateIndex
CREATE INDEX "AuditLog_severity_idx" ON "AuditLog"("severity");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "ConsentLog_email_idx" ON "ConsentLog"("email");

-- CreateIndex
CREATE INDEX "ConsentLog_userId_idx" ON "ConsentLog"("userId");

-- CreateIndex
CREATE INDEX "DownloadLog_resourceId_idx" ON "DownloadLog"("resourceId");

-- CreateIndex
CREATE INDEX "DownloadLog_userId_idx" ON "DownloadLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HeaderCategory_key_key" ON "HeaderCategory"("key");

-- CreateIndex
CREATE INDEX "HeaderCategory_key_idx" ON "HeaderCategory"("key");

-- CreateIndex
CREATE INDEX "HeaderCategory_status_idx" ON "HeaderCategory"("status");

-- CreateIndex
CREATE INDEX "HeaderCategory_displayOrder_idx" ON "HeaderCategory"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "FooterConfig_key_key" ON "FooterConfig"("key");

-- CreateIndex
CREATE INDEX "FooterConfig_key_idx" ON "FooterConfig"("key");

-- CreateIndex
CREATE INDEX "FooterConfig_status_idx" ON "FooterConfig"("status");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryTerm_slug_key" ON "GlossaryTerm"("slug");

-- CreateIndex
CREATE INDEX "GlossaryTerm_slug_idx" ON "GlossaryTerm"("slug");

-- CreateIndex
CREATE INDEX "GlossaryTerm_status_idx" ON "GlossaryTerm"("status");

-- CreateIndex
CREATE INDEX "GlossaryTerm_category_idx" ON "GlossaryTerm"("category");

-- CreateIndex
CREATE INDEX "GlossaryTerm_language_idx" ON "GlossaryTerm"("language");

-- CreateIndex
CREATE UNIQUE INDEX "AboutPage_key_key" ON "AboutPage"("key");

-- CreateIndex
CREATE INDEX "AboutCoreValue_aboutPageId_idx" ON "AboutCoreValue"("aboutPageId");

-- CreateIndex
CREATE INDEX "AboutCoreValue_sortOrder_idx" ON "AboutCoreValue"("sortOrder");

-- CreateIndex
CREATE INDEX "AboutEditorialSource_aboutPageId_idx" ON "AboutEditorialSource"("aboutPageId");

-- CreateIndex
CREATE INDEX "AboutEditorialSource_sortOrder_idx" ON "AboutEditorialSource"("sortOrder");

-- CreateIndex
CREATE INDEX "AboutRitualKitPoint_aboutPageId_idx" ON "AboutRitualKitPoint"("aboutPageId");

-- CreateIndex
CREATE INDEX "AboutRitualKitPoint_sortOrder_idx" ON "AboutRitualKitPoint"("sortOrder");

-- CreateIndex
CREATE INDEX "AboutPurohitBookingPoint_aboutPageId_idx" ON "AboutPurohitBookingPoint"("aboutPageId");

-- CreateIndex
CREATE INDEX "AboutPurohitBookingPoint_sortOrder_idx" ON "AboutPurohitBookingPoint"("sortOrder");

-- CreateIndex
CREATE INDEX "AboutPurohitArrangementPoint_aboutPageId_idx" ON "AboutPurohitArrangementPoint"("aboutPageId");

-- CreateIndex
CREATE INDEX "AboutPurohitArrangementPoint_sortOrder_idx" ON "AboutPurohitArrangementPoint"("sortOrder");

-- CreateIndex
CREATE INDEX "AboutCircleStep_aboutPageId_idx" ON "AboutCircleStep"("aboutPageId");

-- CreateIndex
CREATE INDEX "AboutCircleStep_sortOrder_idx" ON "AboutCircleStep"("sortOrder");

-- AddForeignKey
ALTER TABLE "DharmicConcept" ADD CONSTRAINT "DharmicConcept_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutCoreValue" ADD CONSTRAINT "AboutCoreValue_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutEditorialSource" ADD CONSTRAINT "AboutEditorialSource_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutRitualKitPoint" ADD CONSTRAINT "AboutRitualKitPoint_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutPurohitBookingPoint" ADD CONSTRAINT "AboutPurohitBookingPoint_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutPurohitArrangementPoint" ADD CONSTRAINT "AboutPurohitArrangementPoint_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutCircleStep" ADD CONSTRAINT "AboutCircleStep_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

