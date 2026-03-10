export type SectionContent = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type SitePath = '/' | '/privacy/' | '/terms/' | '/support/' | '/data-deletion/';

export const siteConfig = {
  appName: 'SnapFresh',
  legalName: 'SnapFresh',
  contactEmail: 'support@snapfresh.app',
  supportWindow: 'We aim to reply within 3 business days.',
  effectiveDate: 'March 10, 2026',
  lastUpdated: 'March 10, 2026'
};

export function toPageHref(currentPath: SitePath, targetPath: SitePath): string {
  if (currentPath === '/') {
    return targetPath === '/' ? './' : targetPath.slice(1);
  }

  return targetPath === '/' ? '../' : `../${targetPath.slice(1)}`;
}

export function toAssetHref(currentPath: SitePath, assetName: string): string {
  return currentPath === '/' ? `./${assetName}` : `../${assetName}`;
}

export const supportedLanguages = [
  'English',
  'Punjabi',
  'Chinese',
  'Hindi',
  'Spanish',
  'French',
  'German',
  'Russian',
  'Portuguese',
  'Italian',
  'Romanian',
  'Azerbaijani',
  'Dutch'
];

export const homeHighlights = [
  {
    title: 'Photo-first meal analysis',
    body:
      'SnapFresh uses camera or photo library input to identify meal components, estimate nutrition, and generate a simple quality score.'
  },
  {
    title: 'History, goals, and hydration',
    body:
      'The app stores scan history, personal nutrition goals, and optional water logs so people can review patterns instead of single meals.'
  },
  {
    title: 'Built for international users',
    body: `The current app includes ${supportedLanguages.length} interface languages and a settings area for theme, language, and premium-gated layouts.`
  }
];

export const trustSignals = [
  'Email and Google sign-in are handled through Clerk.',
  'Basic profile records are synced to Supabase when a signed-in user enters the app.',
  'Meal images and notes are sent to an analysis endpoint to produce AI-generated food insights.',
  'Scan history, profile goals, water logs, language, and theme settings are also stored locally on the device.',
  'AI results are presented as estimates and are not medical advice.'
];

export const privacySections: SectionContent[] = [
  {
    title: '1. Scope',
    paragraphs: [
      'This Privacy Policy explains how SnapFresh collects, uses, stores, and shares information when you use the SnapFresh mobile app, this website, and related support pages.',
      'It is written to reflect the current app build, which includes account sign-in, meal photo analysis, scan history, hydration tracking, and personalized nutrition settings.'
    ]
  },
  {
    title: '2. Information We Collect',
    bullets: [
      'Account information such as email address, name, profile image, and account identifiers when you sign in or create an account.',
      'Meal analysis inputs such as photos you capture or choose from your library, optional notes you provide, and the resulting detected items, scores, captions, and nutrition estimates.',
      'Profile and goal information such as height, weight, date of birth, gender, calorie goals, macro goals, and related preference data if you enter it.',
      'Usage and settings information such as language, theme, water logging preferences, subscription state flags, and interaction history stored in the app.',
      'Support communications you send to us, including the email address and message content you use when requesting help or data deletion.'
    ]
  },
  {
    title: '3. Permissions and Device Access',
    bullets: [
      'Camera access is requested so you can scan food items.',
      'Photo library access is requested so you can upload existing food images.',
      'Secure local storage may be used for authentication tokens and app preferences.',
      'These permissions are optional, but some app features will not work without them.'
    ]
  },
  {
    title: '4. How We Use Information',
    bullets: [
      'To authenticate users and maintain accounts.',
      'To analyze meal images and generate estimated nutrition and quality insights.',
      'To store scan history, hydration logs, and personalized goal settings.',
      'To improve reliability, troubleshoot support requests, and protect the service from misuse.',
      'To prepare, offer, or support premium features if those features are enabled in the app.'
    ]
  },
  {
    title: '5. Service Providers and Infrastructure',
    paragraphs: [
      'SnapFresh currently relies on third-party infrastructure for core functions. Based on the current mobile app code, account services are handled through Clerk and data services are handled through Supabase.',
      'Meal analysis requests may include meal photos or photo-derived content sent to backend services that return structured food insights and nutrition estimates.'
    ]
  },
  {
    title: '6. Local and Cloud Storage',
    bullets: [
      'On-device storage can include scan history, hydration logs, goals, theme, language, and premium-related settings.',
      'Cloud-linked storage can include account profile records and nutrition lookup or analysis-related service records needed to run the app experience.',
      'Retention periods may vary depending on operational, legal, security, and support requirements.'
    ]
  },
  {
    title: '7. Sharing',
    paragraphs: [
      'We do not sell personal information. We may share information with vendors or service providers that help us operate authentication, storage, analytics, support, or meal analysis features.',
      'We may also disclose information if required by law, to enforce our terms, or to protect users, the public, or the service.'
    ]
  },
  {
    title: '8. Your Choices',
    bullets: [
      'You can choose not to submit optional profile, goal, or hydration data.',
      'You can stop using camera or photo upload permissions through your device settings.',
      'You can request deletion of your account-linked data using the process on the data deletion page.',
      'Removing the app from your device may delete local data from that device, but it does not automatically remove account-linked cloud records.'
    ]
  },
  {
    title: '9. Children',
    paragraphs: [
      'SnapFresh is not intended for children under 13, and we do not knowingly collect personal information from children under 13.'
    ]
  },
  {
    title: '10. Changes and Contact',
    paragraphs: [
      `We may update this Privacy Policy from time to time. Material changes will be reflected by updating the last updated date on this page.`,
      `For privacy questions, contact ${siteConfig.contactEmail}.`
    ]
  }
];

export const termsSections: SectionContent[] = [
  {
    title: '1. Acceptance of Terms',
    paragraphs: [
      'By accessing or using SnapFresh, you agree to these Terms of Use. If you do not agree, do not use the app or related web pages.'
    ]
  },
  {
    title: '2. What SnapFresh Provides',
    paragraphs: [
      'SnapFresh is a nutrition and meal-insight product that allows users to sign in, scan meals, review AI-generated food estimates, track hydration, and manage personal goals and settings.'
    ]
  },
  {
    title: '3. AI and Health Disclaimer',
    bullets: [
      'Meal analysis results are generated with automated systems and should be treated as estimates.',
      'Nutrition labels, calorie values, macros, and quality scores may be incomplete, inaccurate, or unsuitable for your specific condition.',
      'SnapFresh is not a medical device and does not provide medical diagnosis, treatment, or personalized clinical advice.',
      'You should use licensed healthcare professionals for medical, dietary, or allergy-related decisions.'
    ]
  },
  {
    title: '4. Accounts and Security',
    bullets: [
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You must provide accurate information when creating an account and keep it reasonably current.',
      'We may suspend or terminate access if we believe an account is being used fraudulently, unlawfully, or in violation of these terms.'
    ]
  },
  {
    title: '5. Acceptable Use',
    bullets: [
      'Do not attempt to interfere with the service, scrape private data, reverse engineer protected systems, or misuse the app in a way that harms others.',
      'Do not upload content you do not have the right to use or share.',
      'Do not rely on SnapFresh for emergencies or time-sensitive clinical decision making.'
    ]
  },
  {
    title: '6. Premium Features',
    paragraphs: [
      'The current app includes premium-gated experiences such as enhanced dashboards, share templates, and extended analysis views. If paid subscriptions or in-app purchases are enabled, pricing and billing terms will be presented at the time of purchase.'
    ]
  },
  {
    title: '7. Intellectual Property',
    paragraphs: [
      'SnapFresh and its related branding, software, layout, and content are owned by SnapFresh or its licensors and are protected by applicable intellectual property laws.'
    ]
  },
  {
    title: '8. Disclaimer of Warranties',
    paragraphs: [
      'SnapFresh is provided on an as-is and as-available basis. To the maximum extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, non-infringement, and uninterrupted availability.'
    ]
  },
  {
    title: '9. Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by law, SnapFresh will not be liable for indirect, incidental, special, consequential, or punitive damages, or for losses resulting from reliance on meal analysis estimates or service interruptions.'
    ]
  },
  {
    title: '10. Changes and Contact',
    paragraphs: [
      'We may update these terms from time to time. Continued use after changes become effective means you accept the updated terms.',
      `Questions about these terms can be sent to ${siteConfig.contactEmail}.`
    ]
  }
];

export const supportTopics = [
  {
    title: 'Sign-in and account access',
    body:
      'SnapFresh currently supports email/password sign-in and Google OAuth through Clerk. If sign-in fails, include the email address tied to the account and any error message you saw.'
  },
  {
    title: 'Meal scans and AI estimates',
    body:
      'If a meal scan looks wrong, send the meal type, what the photo contained, and a screenshot if possible. The app uses AI-based detection and nutrition matching, so examples help us improve misclassifications.'
  },
  {
    title: 'Profile, dashboard, and water logs',
    body:
      'Settings, water tracking, and nutrition goals are stored locally on the device in the current app build. Let us know whether the issue happened after reinstalling, updating, or switching devices.'
  },
  {
    title: 'Premium-gated views',
    body:
      'The app includes premium-ready screens such as advanced dashboard and richer share cards. If a premium screen behaves unexpectedly, describe the screen and the steps that led to it.'
  }
];

export const deletionSections: SectionContent[] = [
  {
    title: 'What can be deleted',
    bullets: [
      'Account-linked profile records associated with your signed-in SnapFresh account.',
      'Support communications that are no longer required for legal, security, or operational purposes.',
      'Locally stored app data such as scan history, water logs, and saved settings when removed from your device or cleared by app-specific controls.'
    ]
  },
  {
    title: 'How to request deletion',
    bullets: [
      `Email ${siteConfig.contactEmail} from the address associated with your SnapFresh account.`,
      'Use the subject line "SnapFresh Data Deletion Request".',
      'Include enough information for us to identify the account, such as the email address you used to sign in and whether you want account deletion, data deletion, or both.'
    ]
  },
  {
    title: 'What happens next',
    bullets: [
      'We may need to verify your identity before acting on the request.',
      `Our target response window is ${siteConfig.supportWindow.toLowerCase()}`,
      'Once verified, we aim to complete eligible deletion requests within 30 days unless a longer period is required by law or security obligations.'
    ]
  },
  {
    title: 'Important note about local storage',
    paragraphs: [
      'Deleting your cloud-linked account does not always immediately remove data stored only on your device. To remove device-only data, uninstall the app or clear any local records available through the app experience on that device.'
    ]
  }
];
