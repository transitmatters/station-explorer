import { createFileRoute } from '@tanstack/react-router';
import { Station } from '../../components/pages/Station';

export const Route = createFileRoute('/$station/')({
  component: () => {
    const { station } = Route.useParams();
    return <Station stationId={station} />;
  },
});
