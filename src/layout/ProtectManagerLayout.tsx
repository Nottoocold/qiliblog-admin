import RouteGuard from '@/components/Access/RouteGuard';
import ManagerLayout from './ManagerLayout';

const ProtectManagerLayout = () => {
  return (
    <RouteGuard>
      <ManagerLayout />
    </RouteGuard>
  );
};

export default ProtectManagerLayout;
