import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSessionSchema, type CreateSessionFormValues } from "../schemas/createSessionSchema";
import { editSessionSchema } from "../schemas/editSessionSchema";
import { createSessionRequest, updateSessionRequest, getSessionsRequest } from "../services/teachingservice";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import "../styles/teachingPanel.css";
import "../styles/register.css";

export default function CreateSessionPage() {
  const { teachingUnitId, sessionId } = useParams<{ teachingUnitId?: string; sessionId?: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isEditMode = Boolean(sessionId);
  const [loading, setLoading] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CreateSessionFormValues>({
    resolver: zodResolver(isEditMode ? editSessionSchema : createSessionSchema) as any,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!isEditMode) return;

    getSessionsRequest()
      .then((data) => {
        const session = data.sessions.find((s) => s.id === Number(sessionId));
        if (session) {
          reset({
            title: session.title ?? undefined,
            description: session.description ?? undefined,
            materials: session.materials ?? undefined,
            totalDuration: session.totalDuration ?? undefined,
            date: session.date ?? undefined,
            warmUpTime: session.warmUpTime ?? undefined,
            warmUpDescription: session.warmUpDescription ?? undefined,
            warmUpObservations: session.warmUpObservations ?? undefined,
            mainPartTime: session.mainPartTime ?? undefined,
            mainPartDescription: session.mainPartDescription ?? undefined,
            mainPartObservations: session.mainPartObservations ?? undefined,
            coolDownTime: session.coolDownTime ?? undefined,
            coolDownDescription: session.coolDownDescription ?? undefined,
            coolDownObservations: session.coolDownObservations ?? undefined,
          });
        }
      })
      .catch((err: Error) => {
        Swal.fire({
          title: "Error",
          text: err.message || "Error al cargar la sesión",
          icon: "error",
          confirmButtonColor: "#FF7A3C",
          background: "#16233A",
          color: "#F6F5F1",
        });
      })
      .finally(() => setLoading(false));
  }, [isEditMode, sessionId, reset]);

  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: any) => {
    try {
      if (isEditMode) {
        await updateSessionRequest(Number(sessionId), {
          title: data.title,
          description: data.description,
          materials: data.materials,
          totalDuration: data.totalDuration,
          date: data.date,
          warmUpTime: data.warmUpTime,
          warmUpDescription: data.warmUpDescription,
          warmUpObservations: data.warmUpObservations,
          mainPartTime: data.mainPartTime,
          mainPartDescription: data.mainPartDescription,
          mainPartObservations: data.mainPartObservations,
          coolDownTime: data.coolDownTime,
          coolDownDescription: data.coolDownDescription,
          coolDownObservations: data.coolDownObservations,
        });

        await Swal.fire({
          title: "Sesión actualizada",
          text: "Se ha actualizado correctamente la sesión.",
          icon: "success",
          confirmButtonColor: "#FF7A3C",
          background: "#16233A",
          color: "#F6F5F1",
        });
      } else {
        const unidadId = Number(teachingUnitId);

        // Defensa: si la URL no lleva una unidad válida, no se manda null al backend
        if (!Number.isInteger(unidadId) || unidadId <= 0) {
          await Swal.fire({
            title: "Error",
            text: "No se ha podido identificar la unidad didáctica. Vuelve al panel e inténtalo de nuevo.",
            icon: "error",
            confirmButtonColor: "#FF7A3C",
            background: "#16233A",
            color: "#F6F5F1",
          });
          return;
        }

        await createSessionRequest({
          teachingUnitId: unidadId,
          title: data.title,
          description: data.description,
          materials: data.materials,
          totalDuration: data.totalDuration,
          date: data.date,
          warmUpTime: data.warmUpTime,
          warmUpDescription: data.warmUpDescription,
          warmUpObservations: data.warmUpObservations,
          mainPartTime: data.mainPartTime,
          mainPartDescription: data.mainPartDescription,
          mainPartObservations: data.mainPartObservations,
          coolDownTime: data.coolDownTime,
          coolDownDescription: data.coolDownDescription,
          coolDownObservations: data.coolDownObservations,
        });

        await Swal.fire({
          title: "Sesión creada",
          text: "Se ha creado correctamente la sesión.",
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
        text: err.message || "Error al guardar la sesión",
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
            <p style={{ textAlign: "center", color: "#F6F5F1" }}>Cargando sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">{isEditMode ? "Editar sesión" : "Crear sesión"}</h2>

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
                  <label>Materiales</label>
                  <input
                    type="text"
                    {...register("materials")}
                    required={!isEditMode}
                  />
                  {errors.materials && <span className="error">{String(errors.materials.message)}</span>}
                </div>
                <div className="form-group">
                  <label>Duración total</label>
                  <input
                    type="text"
                    {...register("totalDuration")}
                    required={!isEditMode}
                  />
                  {errors.totalDuration && <span className="error">{String(errors.totalDuration.message)}</span>}
                </div>
                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    {...register("date")}
                    required={!isEditMode}
                  />
                  {errors.date && <span className="error">{String(errors.date.message)}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Calentamiento</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Tiempo de calentamiento</label>
                  <input
                    type="text"
                    {...register("warmUpTime")}
                    required={!isEditMode}
                  />
                  {errors.warmUpTime && <span className="error">{String(errors.warmUpTime.message)}</span>}
                </div>
                <div className="form-group">
                  <label>Descripción del calentamiento</label>
                  <textarea
                    {...register("warmUpDescription")}
                    rows={3}
                    required={!isEditMode}
                  />
                  {errors.warmUpDescription && <span className="error">{String(errors.warmUpDescription.message)}</span>}
                </div>
                <div className="form-group">
                  <label>Observaciones del calentamiento</label>
                  <textarea
                    {...register("warmUpObservations")}
                    rows={3}
                    required={!isEditMode}
                  />
                  {errors.warmUpObservations && <span className="error">{String(errors.warmUpObservations.message)}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Parte principal</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Tiempo de parte principal</label>
                  <input
                    type="text"
                    {...register("mainPartTime")}
                    required={!isEditMode}
                  />
                  {errors.mainPartTime && <span className="error">{String(errors.mainPartTime.message)}</span>}
                </div>
                <div className="form-group">
                  <label>Descripción de parte principal</label>
                  <textarea
                    {...register("mainPartDescription")}
                    rows={3}
                    required={!isEditMode}
                  />
                  {errors.mainPartDescription && <span className="error">{String(errors.mainPartDescription.message)}</span>}
                </div>
                <div className="form-group">
                  <label>Observaciones de parte principal</label>
                  <textarea
                    {...register("mainPartObservations")}
                    rows={3}
                    required={!isEditMode}
                  />
                  {errors.mainPartObservations && <span className="error">{String(errors.mainPartObservations.message)}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Vuelta a la calma</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Tiempo de vuelta a la calma</label>
                  <input
                    type="text"
                    {...register("coolDownTime")}
                    required={!isEditMode}
                  />
                  {errors.coolDownTime && <span className="error">{String(errors.coolDownTime.message)}</span>}
                </div>
                <div className="form-group">
                  <label>Descripción de vuelta a la calma</label>
                  <textarea
                    {...register("coolDownDescription")}
                    rows={3}
                    required={!isEditMode}
                  />
                  {errors.coolDownDescription && <span className="error">{String(errors.coolDownDescription.message)}</span>}
                </div>
                <div className="form-group">
                  <label>Observaciones de vuelta a la calma</label>
                  <textarea
                    {...register("coolDownObservations")}
                    rows={3}
                    required={!isEditMode}
                  />
                  {errors.coolDownObservations && <span className="error">{String(errors.coolDownObservations.message)}</span>}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <button type="submit" className="btn-login" disabled={isSubmitting}>
                {isEditMode ? "Guardar cambios" : "Crear sesión"}
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
