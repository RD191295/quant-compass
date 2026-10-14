import { createFileRoute } from '@tanstack/react-router';
import { ProsePage, marketingHead } from '@/components/marketing/layout';

export const Route = createFileRoute('/methodology')({
  head: () => marketingHead('Methodology', 'How Quant Compass builds factor scores, rankings and research outputs for Indian equities.'),
  component: MethodologyPage,
});

function MethodologyPage() {
  return <ProsePage
    title={'Methodology'}
    intro={'How Quant Compass builds factor scores, rankings and research outputs for Indian equities.'}
    sections={[
      { heading: 'Factor scores', body: 'Each stock receives precomputed scores for quality, value, momentum and growth. Scores are computed on the server by research models, never in your browser.' },
      { heading: 'Composite score', body: 'The composite score combines individual factors with documented weights so you can see what drives a ranking.' },
      { heading: 'Data sources', body: 'The workspace currently uses labelled demonstration data. When a licensed provider is connected, its name and update time will appear next to every figure.' },
      { heading: 'Limitations', body: 'Models are simplifications. Past factor behaviour does not guarantee future results.' },
    ]}
  />;
}
