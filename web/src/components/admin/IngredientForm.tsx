import type { FormEvent } from "react";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";
import { createIngredient, updateIngredient } from "../../services/ingredientService";
import type { Ingredient } from "../../types/catalog";
import { statusOf } from "../../utils/http";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import TextField from "../ui/TextField";

export default function IngredientForm({ ingredient, onClose }: { ingredient: Ingredient | null; onClose: (saved: boolean) => void }) {
  const { showToast } = useToast();
  const { values, error, sending, setField, start, fail, done } = useForm({ name: ingredient?.name ?? "" });
  const name = values.name.trim();
  const valid = name.length > 0 && name.length <= 120;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid || sending) return;
    start();
    try {
      const result = ingredient
        ? await updateIngredient(ingredient.id, { name, parentIngredientId: ingredient.parentIngredientId })
        : await createIngredient({ name });
      done();
      showToast("success", ingredient ? `Guardaste ${result.name}` : `Creaste ${result.name}`);
      onClose(true);
    } catch (err) {
      fail(statusOf(err) === 409 ? "Ya existe un ingrediente con ese nombre." : "No pudimos guardar el ingrediente. Inténtalo otra vez.");
    }
  };

  return (
    <section aria-labelledby="ingredient-form-title" className="glass glass-dense flex flex-col gap-4 rounded-[38px] p-6">
      <h2 id="ingredient-form-title" className="text-title2 font-normal text-title">{ingredient ? `Editar ${ingredient.name}` : "Nuevo ingrediente"}</h2>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          label="Nombre"
          maxLength={120}
          placeholder="Por ejemplo, Ají amarillo"
          value={values.name}
          onChange={e => setField("name", e.target.value)}
          hint={<span className="font-normal text-ink-2">{values.name.length} de 120 caracteres</span>}
        />
        {error && <FormAlert message={error} />}
        <div className="flex flex-wrap justify-end gap-2.5">
          <Button size="md" onClick={() => onClose(false)} disabled={sending}>Cancelar</Button>
          <Button size="md" type="submit" kind="primary" disabled={!valid} loading={sending} loadingLabel="Guardando…">
            {ingredient ? "Guardar cambios" : "Crear ingrediente"}
          </Button>
        </div>
      </form>
    </section>
  );
}
