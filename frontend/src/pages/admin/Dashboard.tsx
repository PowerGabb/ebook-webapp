import { useEffect, useState } from "react"
import { useAuth } from "../../../provider/authProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardData } from "./services/dashboard/apiDashboard"
import { toast } from "sonner"

export default function Dashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<any>(null)


  useEffect(() => {
    const fetchDashboardData = async () => {
      const response = await getDashboardData()
      if (response.status) {
        setDashboardData(response.data)
      } else {
        toast.error(response.message)
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <div>
      <h1 className="text-xl mb-5 font-bold">Selamat Datang di Dashboard {user?.firstName} {user?.lastName}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Buku</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalBook}</div>
            <p className="text-xs text-gray-500">+5 buku baru bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalUser}</div>
            <p className="text-xs text-gray-500">+28 pengguna baru bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalCategory}</div>
            <p className="text-xs text-gray-500">+2 kategori baru bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Buku Di Baca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">867</div>
            <p className="text-xs text-gray-500">+124 peminjaman bulan ini</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
