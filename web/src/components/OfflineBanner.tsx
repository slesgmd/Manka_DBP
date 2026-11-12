import { useOnlineStatus } from "../hooks/useOnlineStatus";
import Icon from "./ui/Icon";

export default function OfflineBanner() {
  const online = useOnlineStatus();

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      {!online && (
        <p className="glass glass-dense flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[14px] font-medium leading-[19px]">
          <Icon name="alert" size={18} strokeWidth={2.2} color="var(--mk-danger)" />
          Sin conexión. Revisa tu red; lo que hagas no se guardará hasta que vuelvas.
        </p>
      )}
    </div>
  );
}
