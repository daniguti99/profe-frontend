import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTeachingUnitSchema, type CreateTeachingUnitFormValues } from "../schemas/createTeachingUnitSchema";
import { createTeachingUnitRequest } from "../services/teachingservice";
import Swal from "sweetalert2";
import "../styles/teachingPanel.css";
import "../styles/register.css";

export default function CreateUnitPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Hook useForm debe llamarse siempre en el mismo orden
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTeachingUnitFormValues>({
    resolver: zodResolver(createTeachingUnitSchema),
    mode: "onSubmit",
  });

  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: CreateTeachingUnitFormValues) => {
    try {
      // courseId viene de la URL (ruta /teachingpanel/crear-unidad/:courseId)
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

      navigate(-1);

    } catch (err: any) {
      await Swal.fire({
        title: "Error",
        text: err.message || "Error al crear la unidad didáctica",
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
          <h2 className="auth-title">Crear unidad didáctica</h2>

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
                  <label>Temporalización</label>
                  <input
                    type="text"
                    {...register("schedule")}
                    required
                  />
                  {errors.schedule && <span className="error">{errors.schedule.message}</span>}
                </div>

                <div className="form-group">
                  <label>Notas</label>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    required
                  />
                  {errors.notes && <span className="error">{errors.notes.message}</span>}
                </div>
              </div>
            </div>

            <button type="submit" className="btn-login">
              Crear unidad didáctica
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}