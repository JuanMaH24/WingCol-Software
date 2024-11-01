import BasicMenu from "./menu-desplegable";
import logo_wingcol from "../imagenes/WingcolName.png";

export default function Navbar() {
  return (
    <div className="barra-navegacion">
        <div className="contenedor-logo">
          <a href="/"><img src={logo_wingcol} alt="logo" /></a>
        </div>
        <div className="menu-desplegable">
          <BasicMenu />
        </div>
      </div>
  );
}
