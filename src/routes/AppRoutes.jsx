import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import PetRegistration from '../pages/PetRegistration'
import PetRegistrationSuccess from '../pages/PetRegistrationSuccess'
import HotelBooking from '../pages/HotelBooking'
import HotelBookingSuccess from '../pages/HotelBookingSuccess'
import GuardianPortal from '../pages/GuardianPortal'
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
import HotelBookings from '../admin/pages/HotelBookings'
import HotelBookingDetails from '../admin/pages/HotelBookingDetails'
import Attendance from '../admin/pages/Attendance'

export default function AppRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro-pet" element={<PetRegistration />} />
        <Route path="/cadastro-sucesso" element={<PetRegistrationSuccess />} />
        <Route path="/hotel" element={<HotelBooking />} />
        <Route path="/hotel/solicitacao-enviada" element={<HotelBookingSuccess />} />
        <Route path="/area-do-tutor" element={<GuardianPortal />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="cadastros" element={<Registrations />} />
            <Route path="cadastros/:id" element={<RegistrationDetails />} />
            <Route path="tutores/:id" element={<GuardianDetails />} />
            <Route path="relatorios" element={<AdminReports />} />
            <Route path="notificacoes" element={<AdminNotifications />} />
            <Route path="hotel" element={<HotelBookings />} />
            <Route path="hotel/:id" element={<HotelBookingDetails />} />
            <Route path="frequencia" element={<Attendance />} />
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
