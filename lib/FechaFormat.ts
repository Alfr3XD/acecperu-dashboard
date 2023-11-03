export function formatoFechaModificacion(fechaModificacion: Date, mostrarDiferencia: boolean = true) {
    const fechaActual = new Date();
    const diferenciaEnMilisegundos = fechaActual.getTime() - fechaModificacion.getTime();
    const minutos = Math.floor(diferenciaEnMilisegundos / (1000 * 60));
    const horas = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60));
    const dias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
    const semanas = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24 * 7));
  
    const formatoFecha = fechaModificacion.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    let mensaje = formatoFecha;
  
    if (mostrarDiferencia) {
      mensaje += ' - ';
  
      if (semanas > 0) {
        mensaje += `Hace ${semanas} semana${semanas > 1 ? 's' : ''}`;
      } else if (dias > 0) {
        mensaje += `Hace ${dias} día${dias > 1 ? 's' : ''}`;
      } else if (horas > 0) {
        mensaje += `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
      } else {
        mensaje += `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
      }
    }
  
    return mensaje;
}