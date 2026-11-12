import { useState } from "react";
import type { FormEvent } from "react";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";
import { createDish, updateDish } from "../../services/dishService";
import type { Dish, ProteinCategory } from "../../types/catalog";
import { errorInfo, errorMessage, statusOf } from "../../utils/http";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import SelectField from "../ui/SelectField";
import TextField from "../ui/TextField";
import DishIngredientsEditor from "./DishIngredientsEditor";
import StepIndicator from "./StepIndicator";

interface DishValues {
  name: string;
  minutes: string;
  proteinCategoryId: string;
}

const validate = ({ name, minutes, proteinCategoryId }: DishValues) => {
  const number = Number(minutes);
  return {
    name: !name.trim() ? "Escribe el nombre del plato." : name.length > 160 ? "Usa 160 caracteres como máximo." : undefined,
    minutes: !minutes ? "Escribe los minutos." : !Number.isInteger(number) || number < 1 || number > 600 ? "Debe ser un número entero entre 1 y 600." : undefined,
    proteinCategoryId: !proteinCategoryId ? "Elige una proteína." : undefined,
  };
};

interface DishFormProps {
  dish: Dish | null;
  proteins: ProteinCategory[];
  onClose: () => void;
}

export default function DishForm({ dish, proteins, onClose }: DishFormProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState<Dish | null>(dish);
  const { values, error, sending, hasVisibleErrors, errorOf, setField, touch, start, fail, done } = useForm<DishValues>({
    name: dish?.name ?? "",
    minutes: dish ? String(dish.totalTimeMinutes) : "",
    proteinCategoryId: dish ? String(dish.proteinCategoryId) : "",
  }, validate);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!start()) return;
    const request = { name: values.name.trim(), totalTimeMinutes: Number(values.minutes), proteinCategoryId: Number(values.proteinCategoryId) };
    try {
      const result = saved ? await updateDish(saved.id, request) : await createDish(request);
      done();
      showToast("success", saved ? `Guardaste los cambios de ${result.name}` : `Creaste ${result.name}`);
      setSaved(result);
      setStep(2);
    } catch (err) {
      if (statusOf(err) === 409) {
        fail("Ya existe un plato con ese nombre.", { name: "Elige otro nombre." });
      } else {
        const fields = errorInfo(err).fieldErrors;
        fail(errorMessage(err, "No se pudo guardar el plato."), { name: fields.name, minutes: fields.totalTimeMinutes, proteinCategoryId: fields.proteinCategoryId });
      }
    }
  };

  const proteinOptions = [{ value: "", label: "Elige una proteína" }, ...proteins.map(p => ({ value: String(p.id), label: p.name }))];

  return (
    <section aria-labelledby="dish-form-title" className="glass glass-dense flex flex-col gap-5 rounded-[38px] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 id="dish-form-title" className="text-title2 font-normal text-title">{dish ? `Editar ${dish.name}` : "Nuevo plato"}</h2>
        <Button size="md" onClick={onClose}>{step === 2 ? "Listo" : "Cancelar"}</Button>
      </div>
      <StepIndicator step={step} steps={["Datos del plato", "Ingredientes"]} />

      {step === 1 ? (
        <form onSubmit={handleSubmit} noValidate className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <TextField
            label="Nombre"
            maxLength={160}
            placeholder="Por ejemplo, Lomo saltado"
            value={values.name}
            error={errorOf("name")}
            help={`Debe ser único. ${values.name.length} de 160 caracteres.`}
            onChange={e => setField("name", e.target.value)}
            onBlur={() => touch("name")}
          />
          <TextField
            label="Minutos"
            type="number"
            inputMode="numeric"
            min={1}
            max={600}
            placeholder="30"
            value={values.minutes}
            error={errorOf("minutes")}
            help="Tiempo total, de 1 a 600."
            onChange={e => setField("minutes", e.target.value)}
            onBlur={() => touch("minutes")}
          />
          <SelectField
            label="Proteína"
            options={proteinOptions}
            value={values.proteinCategoryId}
            error={errorOf("proteinCategoryId")}
            help="Se usa en los filtros del catálogo."
            onChange={e => setField("proteinCategoryId", e.target.value)}
            onBlur={() => touch("proteinCategoryId")}
          />
          {error && <div className="md:col-span-3"><FormAlert message={error} /></div>}
          <div className="flex justify-end md:col-span-3">
            <Button type="submit" kind="primary" disabled={hasVisibleErrors} loading={sending} loadingLabel="Guardando…">
              {saved ? "Guardar y seguir" : "Crear y seguir"}
            </Button>
          </div>
        </form>
      ) : (
        saved && (
          <>
            <DishIngredientsEditor dishId={saved.id} dishName={saved.name} />
            <div className="flex flex-wrap justify-between gap-3">
              <Button size="md" onClick={() => setStep(1)}>Volver a los datos</Button>
              <Button size="md" kind="primary" onClick={onClose}>Listo</Button>
            </div>
          </>
        )
      )}
    </section>
  );
}
