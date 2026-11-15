const ERROR_DICTIONARY = Object.freeze({
  INVALID_MOCK_QTY: Object.freeze({
    statusCode: 400,
    message: "qty debe ser un número entero entre 1 y 100.",
  }),
  INVALID_DATA: Object.freeze({
    statusCode: 400,
    message: "Los datos enviados no son válidos.",
  }),
  USER_NOT_FOUND: Object.freeze({
    statusCode: 404,
    message: "No se encontró el usuario solicitado.",
  }),
  ORDER_NOT_FOUND: Object.freeze({
    statusCode: 404,
    message: "No se encontró el pedido solicitado.",
  }),
  INVALID_ORDER_STATUS: Object.freeze({
    statusCode: 400,
    message: "El estado del pedido no es válido.",
  }),
  INVALID_DELIVERY_STATUS: Object.freeze({
    statusCode: 400,
    message: "El estado de la entrega no es válido.",
  }),
  FILE_REQUIRED: Object.freeze({
    statusCode: 400,
    message: "Debes adjuntar un archivo en el campo requerido.",
  }),
  INVALID_FILE_TYPE: Object.freeze({
    statusCode: 400,
    message: "El formato del archivo no está permitido. Usa PDF, JPG o PNG.",
  }),
  INVALID_FILE_FIELD: Object.freeze({
    statusCode: 400,
    message: "El campo del archivo no coincide con el esperado.",
  }),
  FILE_TOO_LARGE: Object.freeze({
    statusCode: 413,
    message: "El archivo supera el tamaño máximo permitido de 5 MB.",
  }),
  FILE_UPLOAD_FAILED: Object.freeze({
    statusCode: 400,
    message: "No se pudo procesar la carga del archivo.",
  }),
  INVALID_DOCUMENT_TYPE: Object.freeze({
    statusCode: 400,
    message: "El tipo de documento no está permitido.",
  }),
  DELIVERY_NOT_FOUND: Object.freeze({
    statusCode: 404,
    message: "No se encontró la entrega solicitada.",
  }),
  FILE_SAVE_FAILED: Object.freeze({
    statusCode: 500,
    message: "No se pudo guardar el archivo o sus metadatos.",
  }),
  MOCK_GENERATION_FAILED: Object.freeze({
    statusCode: 422,
    message: "No se pudieron generar los datos simulados.",
  }),
  MOCK_PERSISTENCE_FAILED: Object.freeze({
    statusCode: 500,
    message: "No se pudieron guardar los datos simulados.",
  }),
  ROUTE_NOT_FOUND: Object.freeze({
    statusCode: 404,
    message: "La ruta solicitada no existe.",
  }),
  INTERNAL_SERVER_ERROR: Object.freeze({
    statusCode: 500,
    message: "Ocurrió un error interno.",
  }),
});

module.exports = ERROR_DICTIONARY;
