import "../styles/register.css";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

import { loginRequest } from "../services/authservice";
import { createLoginSchema, type LoginForm } from "../schemas/loginSchema";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(createLoginSchema()),
    mode: "onChange",
  });

  async function onSubmit(data: LoginForm) {
    if (loading) return;
    setLoading(true);
    setBackendError("");

    try {
      const response = await loginRequest(data);

      login(response.token, response.user);

      await Swal.fire({
        title: "Inicio de sesión exitoso",
        text: `Bienvenido, ${response.user.username}`,
        icon: "success",
        background: "#16233A",
        color: "#F6F5F1",
        confirmButtonColor: "#FF7A3C",
      });

      navigate("/");

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

            <h2 className="auth-title">INICIAR SESIÓN</h2>

            {backendError && <p className="error">{backendError}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

              <div className="form-group">
                <label>Email</label>
                <input type="email" {...register("email")} disabled={loading} />
                {errors.email && <span className="error">{errors.email.message}</span>}
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

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Iniciando..." : "Iniciar sesión"}
              </button>

              <label className="text-register">
                ¿No tienes cuenta?
              </label>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/register")}
                disabled={loading}
              >
                Crear cuenta
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          {/* Placeholder hasta tener una imagen de marca para esta zona */}
        </div>

      </div>
    </div>
  );
}
