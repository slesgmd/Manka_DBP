import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { useToast } from "../../hooks/useToast";
import { getUsers, updateUserRoles } from "../../services/userService";
import type { RoleName, User } from "../../types/auth";
import { errorMessage } from "../../utils/http";
import { formatShortDate, plural } from "../../utils/format";
import { initials, mainRoleLabel, ROLE_LABELS } from "../../utils/user";
import ErrorState from "../ui/ErrorState";
import SearchField from "../ui/SearchField";
import SelectField from "../ui/SelectField";
import SkeletonBlock from "../ui/SkeletonBlock";
import Spinner from "../ui/Spinner";

const ROLE_OPTIONS = (["USER", "MANAGER", "ADMIN"] as RoleName[]).map(role => ({ value: role, label: ROLE_LABELS[role] }));

const mainRole = (user: User): RoleName => {
  if (user.roles.includes("ADMIN")) return "ADMIN";
  if (user.roles.includes("MANAGER")) return "MANAGER";
  return "USER";
};

export default function UsersSection() {
  const { user: me } = useAuth();
  const { showToast } = useToast();
  const { data, loading, error, retry } = useFetch(getUsers);
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter(user => `${user.name} ${user.email}`.toLowerCase().includes(q));
  }, [data, query]);

  const changeRole = async (user: User, role: RoleName) => {
    setSavingId(user.id);
    try {
      await updateUserRoles(user.id, { roles: [role] });
      showToast("success", `Rol de ${user.name} actualizado a ${ROLE_LABELS[role].toLowerCase()}`);
      retry();
    } catch (err) {
      showToast("error", errorMessage(err, `No pudimos cambiar el rol de ${user.name}.`));
    }
    setSavingId(null);
  };

  if (error && !data) {
    return <ErrorState title="No pudimos cargar los usuarios" error={error} onRetry={retry} />;
  }

  if (!data) {
    return (
      <div role="status" aria-label="Cargando usuarios" className="glass glass-dense flex flex-col gap-3 rounded-[38px] p-4">
        {[0, 1, 2, 3, 4].map(i => <SkeletonBlock key={i} className="h-14 rounded-[22px]" />)}
      </div>
    );
  }

  return (
    <section aria-busy={loading} className="glass glass-dense flex flex-col gap-2 rounded-[38px] px-2.5 pb-3.5 pt-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-2">
        <h2 className="text-title2 font-normal text-title">Usuarios · {plural(data.length, "cuenta", "cuentas")}</h2>
        <SearchField label="Buscar usuario" placeholder="Buscar por nombre o correo" value={query} onChange={e => setQuery(e.target.value)} className="h-[46px] w-full sm:w-[320px]" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-[15px]">
          <caption className="sr-only">Usuarios de Manka con su rol</caption>
          <thead>
            <tr className="text-left text-footnote font-medium text-ink-2">
              <th className="px-4 pb-2.5 pt-3.5 font-medium">Usuario</th>
              <th className="px-4 pb-2.5 pt-3.5 font-medium">Correo</th>
              <th className="px-4 pb-2.5 pt-3.5 font-medium">Alta</th>
              <th className="px-4 pb-2.5 pt-3.5 font-medium">Estado</th>
              <th className="w-[250px] px-4 pb-2.5 pt-3.5 font-medium">Rol</th>
            </tr>
          </thead>
          <tbody>
            {shown.map(user => {
              const isMe = user.id === me?.id;
              return (
                <tr key={user.id} className="border-t border-sep">
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-3">
                      <span aria-hidden="true" className="glass glass-thin flex size-[42px] shrink-0 items-center justify-center rounded-full text-sm font-medium">{initials(user.name)}</span>
                      <span className="flex flex-col">
                        <span className="text-[16px] font-medium">{user.name}</span>
                        <span className="text-footnote text-ink-2">{isMe ? "Tú" : mainRoleLabel(user)}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-ink-2">{user.email}</td>
                  <td className="px-4 py-2.5 tabular-nums text-ink-2">{formatShortDate(user.createdAt)}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <span className={user.enabled ? "size-2 rounded-full bg-ok" : "size-2 rounded-full bg-ink-2"} />
                      {user.enabled ? "Activa" : "Desactivada"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2.5">
                      <SelectField
                        label={isMe ? "Tu rol (no puedes cambiarlo)" : `Rol de ${user.name}`}
                        hideLabel
                        options={ROLE_OPTIONS}
                        value={mainRole(user)}
                        disabled={isMe || savingId !== null}
                        onChange={e => changeRole(user, e.target.value as RoleName)}
                        className="w-[190px]"
                      />
                      {savingId === user.id && <span role="status" aria-label="Guardando"><Spinner /></span>}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {shown.length === 0 && <p className="border-t border-sep px-4 py-6 text-subhead text-ink-2">Ningún usuario coincide con «{query}».</p>}
      <p className="border-t border-sep px-4 pt-3.5 text-footnote text-ink-2">
        Usuario: cocina y guarda. Gestor: además edita platos, ingredientes y categorías. Administrador: además cambia roles. No puedes cambiar tu propio rol.
      </p>
    </section>
  );
}
