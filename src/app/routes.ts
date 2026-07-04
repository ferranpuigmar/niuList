export const ROUTES = {
  landing: '/',
  login: '/login',
  createList: '/crear',
  importVisitor: '/importar',
  publicList: '/:listId',
  giftDetail: '/:listId/regalo/:giftId',
  admin: '/:listId/admin',
  adminAdd: '/:listId/admin/anadir',
  adminEdit: '/:listId/admin/editar/:giftId',
  adminSettings: '/:listId/admin/configuracion',
} as const
