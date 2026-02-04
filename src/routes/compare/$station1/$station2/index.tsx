import { createFileRoute } from '@tanstack/react-router';
import { Compare } from '../../../../components/pages/Compare';

export const Route = createFileRoute('/compare/$station1/$station2/')({
  component: () => {
    const { station1, station2 } = Route.useParams();
    return <Compare station1Id={station1} station2Id={station2} />;
  },
});
