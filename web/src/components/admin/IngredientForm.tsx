import type { FormEvent } from "react";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";
import { createIngredient, updateIngredient } from "../../services/ingredientService";
import type { Ingredient } from "../../types/catalog";
import { errorInfo, errorMessage, statusOf } from "../../utils/http";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import TextField from "../ui/TextField";

const validate = ({ name }: { name: string }) => ({
  name: !name.trim() ? "Escribe el nombre del ingrediente." : name.length > 120 ? "Usa 120 caracteres como máximo." : undefined,
});

export default function IngredientForm({ ingredient, onClose }: { ingredient: Ingredient | null; onClose: (saved: boolean) => void }) {
  const { showToast } = useToast();
  const { values, error, sending, hasVisibleErrors, errorOf, setField, touch, start, fail, done } = useForm({ name: ingredient?.name ?? "" }, validate);
  const name = values.name.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!start()) return;
    try {
      const result = ingredient
        ? await updateIngredient(ingredient.id, { name, parentIngredientId: ingredient.parentIngredientId })
        : await createIngredient({ name });
      done();
      showToast("success", ingredient ? `Guardaste ${result.name}` : `Creaste ${result.name}`);
      onClose(true);
    } catch (err) {
      if (statusOf(err) === 409) {
        fail("Ya existe un ingrediente con ese nombre.", { name: "Elige otro nombre." });
      } else {
        fail(errorMessage(err, "No se pudo guardar el ingrediente."), errorInfo(err).fieldErrors);
      }
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
          error={errorOf("name")}
          help={`Debe ser único. ${values.name.length} de 120 caracteres.`}
          onChange={e => setField("name", e.target.value)}
          onBlur={() => touch("name")}
        />
        {error && <FormAlert message={error} />}
        <div className="flex flex-wrap justify-end gap-2.5">
          <Button size="md" onClick={() => onClose(false)} disabled={sending}>Cancelar</Button>
          <Button size="md" type="submit" kind="primary" disabled={hasVisibleErrors} loading={sending} loadingLabel="Guardando…">
            {ingredient ? "Guardar cambios" : "Crear ingrediente"}
          </Button>
        </div>
      </form>
    </section>
  );
}
