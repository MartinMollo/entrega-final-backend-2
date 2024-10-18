export const isAuthenticated = (req, res, next) => {
    if (req.user) {
      return next();
    } else {
      return res.redirect("/auth/login");
    }
  };
  
  export const isNotAuthenticated = (req, res, next) => {
    if (req.user) {
      return res.redirect("/realtimeproducts");
    } else {
      return next();
    }
  };
  
  export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      return next(); // Si es admin, permitir el acceso
    } else {
      return res
        .status(403)
        .send(
          "Acceso denegado: Solo los administradores pueden acceder a esta sección."
        );
    }
  };
  
  export const isUser = (req, res, next) => {
    if (req.user && req.user.role === "user") {
      return next();
    } else {
      return res
        .status(403)
        .send("Acceso denegado: se requieren privilegios de usuario.");
    }
  };
  