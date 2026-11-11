import { useParams } from "react-router-dom";

export default function DishDetailPage() {
  const { id } = useParams();

  return <h1 className="text-2xl font-bold">Plato {id}</h1>;
}
