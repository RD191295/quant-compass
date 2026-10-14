import { createFileRoute } from '@tanstack/react-router';
import { ProsePage, marketingHead } from '@/components/marketing/layout';

export const Route = createFileRoute('/contact')({
  head: () => marketingHead('Contact', 'Get in touch with the Quant Compass team.'),
  component: ContactPage,
});

function ContactPage() {
  return <ProsePage
    title={'Contact'}
    intro={'Get in touch with the Quant Compass team.'}
    sections={[
      { heading: 'Support', body: 'For account help or feedback, write to us at the support address we will publish here soon.' },
      { heading: 'Data partnerships', body: 'We welcome conversations with licensed Indian market data providers.' },
    ]}
  />;
}
