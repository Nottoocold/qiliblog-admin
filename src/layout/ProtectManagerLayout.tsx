import RouteGuard from '@/components/access/RouteGuard';
import ManagerLayout from './managerLayout';

const ProtectManagerLayout = () => {
  return (
    <RouteGuard>
      <ManagerLayout />
    </RouteGuard>
  );
};

export default ProtectManagerLayout;
