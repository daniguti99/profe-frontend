import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSessionSchema, type CreateSessionFormValues } from "../schemas/createSessionSchema";
import { createSessionRequest } from "../services/teachingservice";
import Swal from "sweetalert2";
import "../styles/teachingPanel.css";
import "../styles/register.css";

export default function CreateSessionPage() {
  const { teachingUnitId } = useParams<{ teachingUnitId: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Hook useForm debe llamarse siempre en el mismo orden
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSessionFormValues>({
    resolver: zodResolver(createSessionSchema),
    mode: "onSubmit",
  });

  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: CreateSessionFormValues) => {
    try {
      await createSessionRequest({
        teachingUnitId: Number(teachingUnitId),
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
        // Campos opcionales de gráficos: enviar null si no tienen valor
        warmUpGraphicUrl: data.warmUpGraphicUrl ?? null,
        mainPartGraphicUrl: data.mainPartGraphicUrl ?? null,
        coolDownGraphicUrl: data.coolDownGraphicUrl ?? null,
      });

      await Swal.fire({
        title: "Sesión creada",
        text: "Se ha creado correctamente la sesión.",
        icon: "success",
        confirmButtonColor: "#FF7A3C",
        background: "#16233A",
        color: "#F6F5F1",
      });

      navigate(-1);

    } catch (err: any) {
      await Swal.fire({
        title: "Error",
        text: err.message || "Error al crear la sesión",
        icon: "error",
        confirmButtonColor: "#FF7A3C",
        background: "#16233A",
        color: "#F6F5F1",
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Crear sesión</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

            <div className="form-section">
              <h3 className="form-section-title">Información general</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    {...register("title")}
                    required
                  />
                  {errors.title && <span className="error">{errors.title.message}</span>}
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    required
                  />
                  {errors.description && <span className="error">{errors.description.message}</span>}
                </div>
                <div className="form-group">
                  <label>Materiales</label>
                  <input
                    type="text"
                    {...register("materials")}
                    required
                  />
                  {errors.materials && <span className="error">{errors.materials.message}</span>}
                </div>
                <div className="form-group">
                  <label>Duración total</label>
                  <input
                    type="text"
                    {...register("totalDuration")}
                    required
                  />
                  {errors.totalDuration && <span className="error">{errors.totalDuration.message}</span>}
                </div>
                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    {...register("date")}
                    required
                  />
                  {errors.date && <span className="error">{errors.date.message}</span>}
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
                    required
                  />
                  {errors.warmUpTime && <span className="error">{errors.warmUpTime.message}</span>}
                </div>
                <div className="form-group">
                  <label>Descripción del calentamiento</label>
                  <textarea
                    {...register("warmUpDescription")}
                    rows={3}
                    required
                  />
                  {errors.warmUpDescription && <span className="error">{errors.warmUpDescription.message}</span>}
                </div>
                <div className="form-group">
                  <label>Observaciones del calentamiento</label>
                  <textarea
                    {...register("warmUpObservations")}
                    rows={3}
                    required
                  />
                  {errors.warmUpObservations && <span className="error">{errors.warmUpObservations.message}</span>}
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
                    required
                  />
                  {errors.mainPartTime && <span className="error">{errors.mainPartTime.message}</span>}
                </div>
                <div className="form-group">
                  <label>Descripción de parte principal</label>
                  <textarea
                    {...register("mainPartDescription")}
                    rows={3}
                    required
                  />
                  {errors.mainPartDescription && <span className="error">{errors.mainPartDescription.message}</span>}
                </div>
                <div className="form-group">
                  <label>Observaciones de parte principal</label>
                  <textarea
                    {...register("mainPartObservations")}
                    rows={3}
                    required
                  />
                  {errors.mainPartObservations && <span className="error">{errors.mainPartObservations.message}</span>}
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
                    required
                  />
                  {errors.coolDownTime && <span className="error">{errors.coolDownTime.message}</span>}
                </div>
                <div className="form-group">
                  <label>Descripción de vuelta a la calma</label>
                  <textarea
                    {...register("coolDownDescription")}
                    rows={3}
                    required
                  />
                  {errors.coolDownDescription && <span className="error">{errors.coolDownDescription.message}</span>}
                </div>
                <div className="form-group">
                  <label>Observaciones de vuelta a la calma</label>
                  <textarea
                    {...register("coolDownObservations")}
                    rows={3}
                    required
                  />
                  {errors.coolDownObservations && <span className="error">{errors.coolDownObservations.message}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Vuelta a la calma (gráficos opcionales)</h3>
              <p className="form-hint">Los campos de gráfico son opcionales y se pueden dejar en blanco.</p>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Gráfico calentamiento</label>
                  <input
                    type="text"
                    {...register("warmUpGraphicUrl")}
                  />
                </div>
                <div className="form-group">
                  <label>Gráfico parte principal</label>
                  <input
                    type="text"
                    {...register("mainPartGraphicUrl")}
                  />
                </div>
                <div className="form-group">
                  <label>Gráfico vuelta a la calma</label>
                  <input
                    type="text"
                    {...register("coolDownGraphicUrl")}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={isSubmitting}>
              {isSubmitting ? "Creando sesión..." : "Crear sesión"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}