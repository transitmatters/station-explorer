import { createFileRoute } from '@tanstack/react-router';
import { Station } from '../../components/pages/Station';

function StationRouteComponent() {
  const { station } = Route.useParams();
  return <Station stationId={station} />;
}

export const Route = createFileRoute('/$station/')({
  component: StationRouteComponent,
});
