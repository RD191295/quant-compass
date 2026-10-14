import { createFileRoute } from '@tanstack/react-router';
import { ProsePage, marketingHead } from '@/components/marketing/layout';

export const Route = createFileRoute('/privacy')({
  head: () => marketingHead('Privacy Policy', 'How Quant Compass collects and protects your information.'),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <ProsePage
    title={'Privacy Policy'}
    intro={'How Quant Compass collects and protects your information.'}
    sections={[
      { heading: 'What we collect', body: 'Your name, email address, preferences, watchlists and saved research.' },
      { heading: 'How we use it', body: 'Only to run your account and workspace. We do not sell personal data.' },
      { heading: 'Isolation', body: 'Your watchlists and notes are visible only to you.' },
      { heading: 'Your choices', body: 'You can update your profile at any time from Settings, or contact us to delete your account.' },
    ]}
  />;
}
