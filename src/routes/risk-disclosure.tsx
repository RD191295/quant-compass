import { createFileRoute } from '@tanstack/react-router';
import { ProsePage, marketingHead } from '@/components/marketing/layout';

export const Route = createFileRoute('/risk-disclosure')({
  head: () => marketingHead('Risk Disclosure', 'Important information about the risks of investing in securities.'),
  component: RiskDisclosurePage,
});

function RiskDisclosurePage() {
  return <ProsePage
    title={'Risk Disclosure'}
    intro={'Important information about the risks of investing in securities.'}
    sections={[
      { heading: 'Market risk', body: 'Investments in securities are subject to market risks. Read all related documents carefully before investing.' },
      { heading: 'Not a SEBI-registered advisor', body: 'Quant Compass is not registered with SEBI as an investment advisor or research analyst. Nothing on this site is a recommendation.' },
      { heading: 'Demonstration data', body: 'Current figures in the workspace are sample data and must not be used for trading decisions.' },
      { heading: 'Derivatives', body: 'Options and futures carry high risk and may result in losses greater than the amount invested.' },
    ]}
  />;
}
