import { lazy } from 'react'

export const LandingPage = lazy(() => import('./pages/public/landing-page'))
export const LoginPage = lazy(() => import('./pages/public/login-page'))
export const CreateListPage = lazy(() => import('./pages/public/create-list-page'))
export const PublicListPage = lazy(() => import('../features/lists/pages/public-list-page'))
export const GiftDetailPage = lazy(() => import('../features/gifts/pages/gift-detail-page'))
export const AdminListPage = lazy(() => import('../features/gifts/pages/admin-list-page'))
export const AdminAddGiftPage = lazy(() => import('../features/gifts/pages/admin-add-gift-page'))
export const AdminEditGiftPage = lazy(() => import('../features/gifts/pages/admin-edit-gift-page'))
export const AdminSettingsPage = lazy(() => import('../features/lists/pages/admin-settings-page'))
