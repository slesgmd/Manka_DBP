import { useSearchParams } from "react-router-dom";
import DishesSection from "../components/admin/DishesSection";
import IngredientsSection from "../components/admin/IngredientsSection";
import UsersSection from "../components/admin/UsersSection";
import PageHeader from "../components/PageHeader";
import SegmentedControl from "../components/ui/SegmentedControl";

type Section = "usuarios" | "platos" | "ingredientes";

const SECTIONS: { value: Section; label: string }[] = [
  { value: "usuarios", label: "Usuarios" },
  { value: "platos", label: "Platos" },
  { value: "ingredientes", label: "Ingredientes" },
];

const SUBTITLES: Record<Section, string> = {
  usuarios: "Cambia el rol de cada persona. El tuyo no se puede cambiar.",
  platos: "Crea, edita y borra platos del catálogo con sus ingredientes.",
  ingredientes: "Crea, edita y borra ingredientes del catálogo.",
};

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("seccion");
  const section: Section = SECTIONS.some(s => s.value === param) ? (param as Section) : "usuarios";

  return (
    <>
      <PageHeader title="Administración" subtitle={SUBTITLES[section]}>
        <div className="w-full sm:w-[420px]">
          <SegmentedControl label="Sección de administración" options={SECTIONS} value={section} onChange={value => setSearchParams({ seccion: value })} />
        </div>
      </PageHeader>
      {section === "usuarios" && <UsersSection />}
      {section === "platos" && <DishesSection />}
      {section === "ingredientes" && <IngredientsSection />}
    </>
  );
}
