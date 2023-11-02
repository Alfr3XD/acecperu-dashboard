type AuditoriaProps = {
    user_id: number,
    table: {
        title: string,
        content: string
    }
    operation: "INSERT" | "UPDATE" | "DELETE"
}
export const createAuditoria = async (props: AuditoriaProps) => {
    const body = {
        tabla_afectada: props.table.title,
        tipo_operacion: props.operation,
        cambios: props.table.content,
        usuario_id: Number(props.user_id)
    }

    const res = await fetch('/api/db/auditoria/create', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
}