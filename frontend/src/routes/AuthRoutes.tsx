import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import React from 'react'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}
