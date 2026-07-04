import { Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ROUTES } from './routes'
import { AdminLayout } from './shared/layouts/admin-layout'
import { AuthGuard } from './shared/layouts/auth-guard'
import { PublicLayout } from './shared/layouts/public-layout'
import { RouteFallback } from './shared/components/route-fallback'
import {
  AdminAddGiftPage,
  AdminEditGiftPage,
  AdminListPage,
  AdminSettingsPage,
  CreateListPage,
  GiftDetailPage,
  ImportVisitorPage,
  LandingPage,
  LoginPage,
  PublicListPage,
} from './pages'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.landing,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.login,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.importVisitor,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <ImportVisitorPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.publicList,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <PublicListPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.giftDetail,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <GiftDetailPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: ROUTES.createList,
    element: (
      <Suspense fallback={<RouteFallback />}>
        <CreateListPage />
      </Suspense>
    ),
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: ROUTES.admin,
            element: (
              <Suspense fallback={<RouteFallback />}>
                <AdminListPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.adminAdd,
            element: (
              <Suspense fallback={<RouteFallback />}>
                <AdminAddGiftPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.adminEdit,
            element: (
              <Suspense fallback={<RouteFallback />}>
                <AdminEditGiftPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.adminSettings,
            element: (
              <Suspense fallback={<RouteFallback />}>
                <AdminSettingsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to={ROUTES.landing} />,
  },
])
