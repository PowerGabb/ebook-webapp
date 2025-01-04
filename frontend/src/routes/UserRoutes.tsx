import { Routes, Route } from 'react-router-dom'
import Home from '../pages/user/Home'
import Favorites from '../pages/user/Favorites'
import Latest from '../pages/user/Latest'
import SearchBook from '../pages/user/SearchBook'
import BookDetail from '../pages/user/BookDetail'
import ReadBook from '../pages/user/ReadBook'
import Account from '@/pages/user/Account'

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/latest" element={<Latest />} />
      <Route path="/search" element={<SearchBook />} />
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/books/:id/read" element={<ReadBook />} />
      <Route path="/account" element={<Account/>} />
    </Routes>
  )
}

export default UserRoutes