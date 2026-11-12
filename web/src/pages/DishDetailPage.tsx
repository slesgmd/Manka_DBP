import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function DishDetailPage() {
  const { id } = useParams();

  return <PageHeader title={`Plato ${id}`} />;
}
