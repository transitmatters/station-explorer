import { createFileRoute } from '@tanstack/react-router';
import { Station } from '../../components/pages/Station';

function StationRoute() {
  const { station } = Route.useParams();
  return <Station stationId={station} />;
}

export const Route = createFileRoute('/$station/')({
  component: StationRoute,
});
