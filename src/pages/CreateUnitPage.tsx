import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTeachingUnitSchema } from "../schemas/createTeachingUnitSchema";
import { editTeachingUnitSchema } from "../schemas/editTeachingUnitSchema";
import { createTeachingUnitRequest, updateTeachingUnitRequest, getTeachingUnitsRequest } from "../services/teachingservice";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import "../styles/teachingPanel.css";
import "../styles/register.css";

export default function CreateUnitPage() {
  const { courseId, unitId } = useParams<{ courseId?: string; unitId?: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isEditMode = Boolean(unitId);
  const [loading, setLoading] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(isEditMode ? editTeachingUnitSchema : createTeachingUnitSchema) as any,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!isEditMode) return;

    getTeachingUnitsRequest()
      .then((data) => {
        const unit = data.teachingUnits.find((u) => u.id === Number(unitId));
        if (unit) {
          reset({
            title: unit.title,
            description: unit.description ?? "",
            schedule: unit.schedule ?? "",
            notes: unit.notes ?? "",
          });
        }
      })
      .catch((err: Error) => {
        Swal.fire({
          title: "Error",
          text: err.message || "Error al cargar la unidad didáctica",
          icon: "error",
          confirmButtonColor: "#FF7A3C",
          background: "#16233A",
          color: "#F6F5F1",
        });
      })
      .finally(() => setLoading(false));
  }, [isEditMode, unitId, reset]);

  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: any) => {
    try {
      if (isEditMode) {
        await updateTeachingUnitRequest(Number(unitId), {
          title: data.title,
          description: data.description,
          schedule: data.schedule,
          notes: data.notes,
        });

        await Swal.fire({
          title: "Unidad didáctica actualizada",
          text: "Se ha actualizado correctamente la unidad didáctica.",
          icon: "success",
          confirmButtonColor: "#FF7A3C",
          background: "#16233A",
          color: "#F6F5F1",
        });
      } else {
        await createTeachingUnitRequest({
          courseId: Number(courseId!),
          title: data.title,
          description: data.description,
          schedule: data.schedule,
          notes: data.notes,
        });

        await Swal.fire({
          title: "Unidad didáctica creada",
          text: "Se ha creado correctamente la unidad didáctica.",
          icon: "success",
          confirmButtonColor: "#FF7A3C",
          background: "#16233A",
          color: "#F6F5F1",
        });
      }

      navigate(-1);

    } catch (err: any) {
      await Swal.fire({
        title: "Error",
        text: err.message || "Error al guardar la unidad didáctica",
        icon: "error",
        confirmButtonColor: "#FF7A3C",
        background: "#16233A",
        color: "#F6F5F1",
      });
    }
  };

  const handleCancel = async () => {
    if (isDirty) {
      const result = await Swal.fire({
        title: "¿Descartar cambios?",
        text: "Tienes cambios sin guardar. ¿Descartarlos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#FF7A3C",
        confirmButtonText: "Sí, descartar",
        cancelButtonText: "Seguir editando",
        background: "#16233A",
        color: "#F6F5F1",
      });
      if (!result.isConfirmed) return;
    }
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <p style={{ textAlign: "center", color: "#F6F5F1" }}>Cargando unidad didáctica...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">{isEditMode ? "Editar unidad didáctica" : "Crear unidad didáctica"}</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

            <div className="form-section">
              <h3 className="form-section-title">Información general</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    {...register("title")}
                    required={!isEditMode}
                  />
                  {errors.title && <span className="error">{String(errors.title.message)}</span>}
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    required={!isEditMode}
                  />
                  {errors.description && <span className="error">{String(errors.description.message)}</span>}
                </div>

                <div className="form-group">
                  <label>Temporalización</label>
                  <input
                    type="text"
                    {...register("schedule")}
                    required={!isEditMode}
                  />
                  {errors.schedule && <span className="error">{String(errors.schedule.message)}</span>}
                </div>

                <div className="form-group">
                  <label>Notas</label>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    required={!isEditMode}
                  />
                  {errors.notes && <span className="error">{String(errors.notes.message)}</span>}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <button type="submit" className="btn-login">
                {isEditMode ? "Guardar cambios" : "Crear unidad didáctica"}
              </button>
              <button type="button" className="btn-login" style={{ backgroundColor: "#666" }} onClick={handleCancel}>
                Cancelar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
