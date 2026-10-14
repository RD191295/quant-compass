import { createFileRoute } from '@tanstack/react-router';
import { ProsePage, marketingHead } from '@/components/marketing/layout';

export const Route = createFileRoute('/terms')({
  head: () => marketingHead('Terms of Service', 'The terms that apply when you use Quant Compass.'),
  component: TermsPage,
});

function TermsPage() {
  return <ProsePage
    title={'Terms of Service'}
    intro={'The terms that apply when you use Quant Compass.'}
    sections={[
      { heading: 'Use of the service', body: 'Quant Compass is a research tool for personal and professional study of Indian equities.' },
      { heading: 'No advice', body: 'Content is for information only and is not investment, tax or legal advice.' },
      { heading: 'Accounts', body: 'Keep your sign-in details secure. You are responsible for activity on your account.' },
      { heading: 'Changes', body: 'We may update these terms and will note the date of changes on this page.' },
    ]}
  />;
}
