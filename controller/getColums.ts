// Modelo Usuario
export const  UsuarioModel = [
    {
      uid: 'id',
      name: 'ID',
      type: 'Int',
      required: false,
    },
    {
      uid: 'name',
      name: 'Nombre',
      type: 'String',
      required: true,
    },
    {
      uid: 'role',
      name: 'Rol',
      type: 'String',
      required: true,
    },
    {
      uid: 'createdTimestamp',
      name: 'Fecha de Creación',
      type: 'DateTime',
      required: true,
    },
  ];
  
  // Modelo Auditoria
  export const  AuditoriaModel = [
    {
      uid: 'id',
      name: 'ID',
      type: 'Int',
      required: false,
    },
    {
      uid: 'tabla_afectada',
      name: 'Tabla Afectada',
      type: 'String',
      required: true,
    },
    {
      uid: 'tipo_operacion',
      name: 'Tipo de Operación',
      type: 'EnumTipoOperacion?',
      required: false,
    },
    {
      uid: 'fecha_modificacion',
      name: 'Fecha de Modificación',
      type: 'DateTime',
      required: true,
    },
    {
      uid: 'cambios',
      name: 'Cambios',
      type: 'String',
      required: false,
    },
    {
      uid: 'usuario_id',
      name: 'ID de Usuario',
      type: 'Int',
      required: true,
    },
    {
      uid: 'usuario',
      name: 'Usuario',
      type: 'Usuario',
      required: true,
    },
  ];
  
  // Modelo Producto
  export const  ProductoModel = [
    {
      uid: 'id',
      name: 'ID',
      type: 'Int',
      required: false,
    },
    {
      uid: 'serie',
      name: 'Serie',
      type: 'Int',
      required: true,
    },
    {
      uid: 'modelo',
      name: 'Modelo',
      type: 'String',
      required: true,
    },
    {
      uid: 'description',
      name: 'Descripción',
      type: 'String',
      required: true,
    },
    {
      uid: 'frequency',
      name: 'Frecuencia',
      type: 'Float',
      required: true,
    },
    {
      uid: 'velocidad',
      name: 'Velocidad',
      type: 'Float',
      required: true,
    },
    {
      uid: 'poder',
      name: 'Poder',
      type: 'Float',
      required: true,
    },
    {
      uid: 'voltage',
      name: 'Voltaje',
      type: 'Float',
      required: true,
    },
    {
      uid: "stock",
      name: "Cantidad",
      type: "Int",
      required: true,
    },
    {
      uid: "precio_u",
      name: "Precio unitario",
      type: "Float",
      required: true
    }
  ];
  
  // Modelo Cliente
  export const  ClienteModel = [
    {
      uid: 'id',
      name: 'ID',
      type: 'Int',
      required: false,
    },
    {
      uid: 'dni',
      name: 'DNI',
      type: 'String',
      required: true,
    },
    {
      uid: 'nombre',
      name: 'Nombre',
      type: 'String',
      required: true,
    },
    {
      uid: 'direccion',
      name: 'Dirección',
      type: 'String',
      required: false,
    },
    {
      uid: 'telefono',
      name: 'Teléfono',
      type: 'String',
      required: true,
    },
    {
      uid: 'correo',
      name: 'Correo',
      type: 'String',
      required: false,
    },
  ];
  
  // Modelo Compra
  export const  CompraModel = [
    {
      uid: 'compra_id',
      name: 'ID de Compra',
      type: 'Int',
      required: false,
    },
    {
      uid: 'cliente',
      name: 'Cliente',
      type: 'Cliente',
      required: true,
    },
    {
      uid: 'cliente_id',
      name: 'ID de Cliente',
      type: 'Int',
      required: true,
    },
    {
      uid: 'producto_id',
      name: 'ID de Producto',
      type: 'Int',
      required: true,
    },
    {
      uid: 'cantidad_comprada',
      name: 'Cantidad Comprada',
      type: 'Int',
      required: true,
    },
    {
      uid: 'fecha_compra',
      name: 'Fecha de Compra',
      type: 'DateTime',
      required: true,
    },
  ];