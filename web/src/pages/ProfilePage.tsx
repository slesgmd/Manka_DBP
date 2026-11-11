import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      <p>{user?.roles.join(", ")}</p>
    </section>
  );
}
