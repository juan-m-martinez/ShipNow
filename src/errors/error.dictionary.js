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
