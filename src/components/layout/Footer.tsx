import "../../styles/footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <p className="footer-text">
                © {new Date().getFullYear()} ProFE — Herramienta para docentes de Educación Física
            </p>
        </footer>
    );
}