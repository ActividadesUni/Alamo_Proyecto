package com.alamo.alquiler.controller;

import com.alamo.alquiler.model.Notificacion;
import com.alamo.alquiler.model.Usuario;
import com.alamo.alquiler.repository.NotificacionRepository;
import com.alamo.alquiler.repository.UsuarioRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController extends AbstractCrudController<Usuario, Integer> {

    private final UsuarioRepository repo;
    private final NotificacionRepository notificacionRepo;

    public UsuarioController(UsuarioRepository repo, NotificacionRepository notificacionRepo) {
        this.repo = repo;
        this.notificacionRepo = notificacionRepo;
    }

    @Override
    protected JpaRepository<Usuario, Integer> repo() {
        return repo;
    }

    @Override
    public Usuario crear(Usuario entidad) {
        Usuario guardado = super.crear(entidad);
        try {
            Notificacion notif = Notificacion.builder()
                    .titulo("Nuevo Colaborador")
                    .mensaje(guardado.getNombres() + " registrado con rol: " + (guardado.getRol() != null ? guardado.getRol().getNombre() : "SIN ROL"))
                    .tipo("USUARIO")
                    .build();
            notificacionRepo.save(notif);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return guardado;
    }
}

