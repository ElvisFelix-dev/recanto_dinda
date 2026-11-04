import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import PetRegistration from '../pages/PetRegistration'
import PetRegistrationSuccess from '../pages/PetRegistrationSuccess'
import { AdminAuthProvider } from '../admin/contexts/AdminAuthContext'
import ProtectedAdminRoute from '../admin/components/ProtectedAdminRoute'
import AdminLayout from '../admin/components/AdminLayout'
import AdminLogin from '../admin/pages/AdminLogin'
import AdminDashboard from '../admin/pages/AdminDashboard'
import Registrations from '../admin/pages/Registrations'
import RegistrationDetails from '../admin/pages/RegistrationDetails'
import GuardianDetails from '../admin/pages/GuardianDetails'
import AdminUsers from '../admin/pages/AdminUsers'
import AdminActivity from '../admin/pages/AdminActivity'
import AdminReports from '../admin/pages/AdminReports'
import AdminNotifications from '../admin/pages/AdminNotifications'

export default function AppRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro-pet" element={<PetRegistration />} />
        <Route path="/cadastro-sucesso" element={<PetRegistrationSuccess />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="cadastros" element={<Registrations />} />
            <Route path="cadastros/:id" element={<RegistrationDetails />} />
            <Route path="tutores/:id" element={<GuardianDetails />} />
            <Route path="relatorios" element={<AdminReports />} />
            <Route path="notificacoes" element={<AdminNotifications />} />
            <Route element={<ProtectedAdminRoute roles={['admin']} />}>
              <Route path="equipe" element={<AdminUsers />} />
              <Route path="atividades" element={<AdminActivity />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </AdminAuthProvider>
  )
}
