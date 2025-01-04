import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { apiCall } from '@/lib/api'
import { Crown, User2, Mail, Phone, MapPin, Shield, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Profile {
  firstName: string
  lastName: string
  phoneNumber: string
  address: string
}

interface UserData {
  id: string
  email: string
  role: string
  isActive: boolean
  profile: Profile
  isPremium?: boolean
  premiumExpiry?: string
}

interface UserForm {
  email: string
  password: string
  confirmPassword: string
  profile: Profile
}

export default function Account() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [formData, setFormData] = useState<UserForm>({
    email: '',
    password: '',
    confirmPassword: '',
    profile: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: ''
    }
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await apiCall('/user/profile/me', {
        method: 'GET'
      })

      if (response.status) {
        const userData: UserData = response.data
        setUserData(userData)
        setFormData({
          email: userData.email,
          password: '',
          confirmPassword: '',
          profile: {
            firstName: userData.profile.firstName,
            lastName: userData.profile.lastName,
            phoneNumber: userData.profile.phoneNumber,
            address: userData.profile.address
          }
        })
      } else {
        toast.error('Gagal memuat profil')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Terjadi kesalahan saat memuat profil')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      if (parent === 'profile') {
        setFormData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            [child]: value
          }
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validasi email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Format email tidak valid')
        return
      }

      // Validasi password jika diisi
      if (formData.password || formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Password dan konfirmasi password tidak cocok')
          return
        }
      }

      // Hapus confirmPassword dari data yang akan dikirim
      const { confirmPassword, ...userData } = formData
      const userDataToSend = {
        ...userData,
        password: userData.password || undefined
      }

      const response = await apiCall('/user/profile/me', {
        method: 'PUT',
        body: JSON.stringify(userDataToSend)
      })

      if (response.status) {
        toast.success('Profil berhasil diperbarui')
        // Reset password fields
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }))
        // Refresh profile data
        fetchProfile()
      } else {
        toast.error(response.message || 'Gagal memperbarui profil')
      }
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan saat memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  const handleUpgradePremium = async () => {
    try {
      const response = await apiCall('/payment/create', {
        method: 'POST',
        body: JSON.stringify({
          duration: 1 // 1 bulan
        })
      });

      if (response.status) {
        // Buka Midtrans Snap untuk pembayaran
        const { snapToken } = response.data;
        
        // @ts-ignore
        window.snap.pay(snapToken, {
          onSuccess: async (result: any) => {
            toast.success('Pembayaran berhasil!');
            // Refresh profile untuk update status premium
            await fetchProfile();
          },
          onPending: (result: any) => {
            toast.info('Menunggu pembayaran...');
          },
          onError: (result: any) => {
            toast.error('Pembayaran gagal');
          },
          onClose: () => {
            toast.info('Pembayaran dibatalkan');
          }
        });
      } else {
        toast.error('Gagal membuat pembayaran');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Terjadi kesalahan saat membuat pembayaran');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <User2 className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {formData.profile.firstName} {formData.profile.lastName}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              {formData.email}
            </div>
          </div>
        </div>
        
        {/* Membership Status */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Status Keanggotaan</h2>
                </div>
                <p className="text-blue-100">
                  {userData?.isPremium ? (
                    <>
                      Anda adalah pengguna Premium
                      <br />
                      <span className="text-sm">
                        Berlaku hingga: {new Date(userData.premiumExpiry || '').toLocaleDateString('id-ID')}
                      </span>
                    </>
                  ) : (
                    'Anda menggunakan versi gratis'
                  )}
                </p>
              </div>
              {!userData?.isPremium && (
                <Button
                  onClick={handleUpgradePremium}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade ke Premium
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User2 className="w-4 h-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Berlangganan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nama */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="profile.firstName">Nama Depan</Label>
                    <Input
                      id="profile.firstName"
                      name="profile.firstName"
                      value={formData.profile.firstName}
                      onChange={handleChange}
                      placeholder="Masukkan nama depan"
                      required
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile.lastName">Nama Belakang</Label>
                    <Input
                      id="profile.lastName"
                      name="profile.lastName"
                      value={formData.profile.lastName}
                      onChange={handleChange}
                      placeholder="Masukkan nama belakang"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan email"
                    required
                    className="border-gray-300"
                  />
                </div>

                {/* Nomor Telepon */}
                <div className="space-y-2">
                  <Label htmlFor="profile.phoneNumber">Nomor Telepon</Label>
                  <Input
                    id="profile.phoneNumber"
                    name="profile.phoneNumber"
                    value={formData.profile.phoneNumber}
                    onChange={handleChange}
                    placeholder="Masukkan nomor telepon"
                    className="border-gray-300"
                  />
                </div>

                {/* Alamat */}
                <div className="space-y-2">
                  <Label htmlFor="profile.address">Alamat</Label>
                  <Textarea
                    id="profile.address"
                    name="profile.address"
                    value={formData.profile.address}
                    onChange={handleChange}
                    placeholder="Masukkan alamat"
                    className="min-h-[100px] border-gray-300"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password Baru</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan password baru"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Konfirmasi password baru"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? 'Menyimpan...' : 'Perbarui Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Status Langganan</h3>
                    <p className="text-gray-600">
                      {userData?.isPremium ? 'Premium' : 'Gratis'}
                    </p>
                  </div>
                  <Badge variant={userData?.isPremium ? "default" : "secondary"}>
                    {userData?.isPremium ? 'AKTIF' : 'GRATIS'}
                  </Badge>
                </div>

                {userData?.isPremium && (
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Masa Berlaku</h3>
                    <p className="text-gray-600">
                      Berlaku hingga {new Date(userData.premiumExpiry || '').toLocaleDateString('id-ID')}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Keuntungan Premium</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-gray-700">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Akses ke semua buku premium
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Unduh buku untuk dibaca offline
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Tidak ada iklan
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Dukungan prioritas
                    </li>
                  </ul>
                </div>

                {!userData?.isPremium && (
                  <Button
                    onClick={handleUpgradePremium}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade ke Premium Sekarang
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
