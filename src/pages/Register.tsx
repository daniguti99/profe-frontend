import "../styles/register.css";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { Camera, Eye, EyeOff, ImagePlus, Trash2 } from "lucide-react";

import { registerRequest } from "../services/authservice";
import { createRegisterSchema, type RegisterForm } from "../schemas/registerSchema";

export default function Register() {
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Vista previa de la foto elegida. La URL del objeto se crea y se revoca en
  // el propio evento de selección, sin efectos: solo cambia al elegir o quitar.
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(createRegisterSchema()),
    mode: "onChange",
  });

  function actualizarPreview(file?: File) {
    setPreview((anterior) => {
      if (anterior) {
        URL.revokeObjectURL(anterior.url);
      }
      return file ? { file, url: URL.createObjectURL(file) } : null;
    });
  }

  async function onSubmit(data: RegisterForm) {
    if (loading) return;
    setLoading(true);
    setBackendError("");

    // La foto no viaja en el JSON: el servicio la manda como parte del multipart
    const { photo: foto, ...datos } = data;

    try {
      await registerRequest(datos, foto);

      await Swal.fire({
        title: "Registro exitoso",
        text: "Usuario registrado correctamente",
        icon: "success",
        background: "#16233A",
        color: "#F6F5F1",
        confirmButtonColor: "#FF7A3C",
      });

      navigate("/login");

    } catch (err: any) {
      setBackendError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-left">
          <div className="auth-card">
            <div className="auth-brand-mark">P</div>

            <h2 className="auth-title">REGISTRO</h2>

            {backendError && <p className="error">{backendError}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

              <div className="form-group">
                <label>Nombre de usuario</label>
                <input type="text" {...register("username")} disabled={loading} />
                {errors.username && <span className="error">{errors.username.message}</span>}
              </div>

              <div className="form-group">
                <label>Nombre</label>
                <input type="text" {...register("firstName")} disabled={loading} />
                {errors.firstName && <span className="error">{errors.firstName.message}</span>}
              </div>

              <div className="form-group">
                <label>Apellidos</label>
                <input type="text" {...register("lastName")} disabled={loading} />
                {errors.lastName && <span className="error">{errors.lastName.message}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" {...register("email")} disabled={loading} />
                {errors.email && <span className="error">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label>Confirmar email</label>
                <input type="email" {...register("confirmEmail")} disabled={loading} />
                {errors.confirmEmail && <span className="error">{errors.confirmEmail.message}</span>}
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="error">{errors.password.message}</span>}
              </div>

              <div className="form-group">
                <label>Confirmar contraseña</label>
                <div className="password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error">{errors.confirmPassword.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Provincia</label>
                <input type="text" {...register("province")} disabled={loading} />
                {errors.province && <span className="error">{errors.province.message}</span>}
              </div>

              <div className="form-group">
                <label>Localidad</label>
                <input type="text" {...register("locality")} disabled={loading} />
                {errors.locality && <span className="error">{errors.locality.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="photo-input">Foto de perfil (opcional)</label>

                <div className="photo-field">
                  {preview ? (
                    <img
                      className="photo-preview"
                      src={preview.url}
                      alt="Vista previa de la foto de perfil"
                    />
                  ) : (
                    <span className="photo-preview photo-preview-empty" aria-hidden="true">
                      <Camera size={26} />
                    </span>
                  )}

                  <div className="photo-actions">
                    <label className="btn-secondary photo-upload" htmlFor="photo-input">
                      <ImagePlus size={16} />
                      {preview ? "Cambiar foto" : "Elegir foto"}
                    </label>

                    <input
                      id="photo-input"
                      className="photo-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={loading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setValue("photo", file, { shouldValidate: true, shouldDirty: true });
                        actualizarPreview(file);
                        // Se vacía el input para permitir volver a elegir el mismo archivo
                        event.target.value = "";
                      }}
                    />

                    {preview && (
                      <button
                        type="button"
                        className="btn-secondary photo-remove"
                        onClick={() => {
                          setValue("photo", undefined, { shouldValidate: true, shouldDirty: true });
                          actualizarPreview(undefined);
                        }}
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                        Quitar foto
                      </button>
                    )}
                  </div>
                </div>

                {errors.photo && <span className="error">{errors.photo.message}</span>}
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Creando..." : "Crear cuenta"}
              </button>

              <label className="text-register">
                ¿Ya tienes cuenta?
              </label>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                Iniciar sesión
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="auth-right-pattern" />
          <div className="auth-right-content">
            <div className="auth-right-brand">ProFE</div>
            <p className="auth-right-tagline">
              Únete a una comunidad de estudiantes y docentes que aprenden juntos.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
