import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Menu, Settings, List, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { getBookById } from '../admin/services/books/apiBook'
import { ReactReader } from 'react-reader'

// Custom styles untuk reader


// Custom styles untuk EPUB content
const readerTheme = {
  '*': {
    padding: '0 16px',
    margin: '0 auto',
    maxWidth: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  'p, div': {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '1em'
  },
  'h1, h2, h3, h4, h5, h6': {
    marginTop: '1.5em',
    marginBottom: '0.5em'
  },
  img: {
    maxWidth: '100%',
    height: 'auto'
  },
  '.arrow': {
    display: 'none !important'
  },
  '.epub-view': {
    padding: '20px 0 !important',
    maxWidth: '800px',
    margin: '0 auto'
  },
  '.epub-container': {
    background: '#fff !important',
    '& > div:first-child': {
      padding: '0 !important'
    }
  },
  // Menghilangkan tombol navigasi dan padding yang tidak perlu
  '.epub-view > div:first-child': {
    padding: '0 !important'
  },
  '.epub-view > div:first-child > div': {
    padding: '0 !important'
  },
  // Menghilangkan tombol prev/next
  'button.arrow': {
    display: 'none !important',
    opacity: '0 !important',
    visibility: 'hidden !important',
    width: '0 !important',
    height: '0 !important',
    padding: '0 !important',
    margin: '0 !important'
  }
}

interface Book {
  id: string
  title: string
  author: string
  fileBook: string | null
}

export default function ReadBook() {
  const { id } = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<string>('0')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const renditionRef = useRef<any>(null)
  const tocRef = useRef<any>(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (!id) throw new Error('ID buku tidak ditemukan')
        const response = await getBookById(id)
        if (response.status) {
          setBook(response.data)
        } else {
          throw new Error('Gagal memuat data buku')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  const locationChanged = (epubcifi: string) => {
    setLocation(epubcifi)
  }

  const changeFontSize = (newSize: number) => {
    setFontSize(newSize)
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${newSize}%`)
    }
  }

  const getRendition = (rendition: any) => {
    renditionRef.current = rendition
    rendition.themes.fontSize(`${fontSize}%`)
    
    // Register custom theme
    rendition.themes.register('custom', readerTheme)
    rendition.themes.select('custom')

    // Tambahan konfigurasi untuk menghilangkan tombol navigasi
    rendition.on('rendered', () => {
      const arrows = document.querySelectorAll('.arrow')
      arrows.forEach(arrow => {
        if (arrow instanceof HTMLElement) {
          arrow.style.display = 'none'
        }
      })
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat buku...</p>
        </div>
      </div>
    )
  }

  if (error || !book || !book.fileBook) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {error || 'Buku tidak dapat dibaca'}
        </h2>
        <Link to={`/books/${id}`} className="text-blue-600 hover:text-blue-700">
          Kembali ke detail buku
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={`/books/${id}`}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-lg font-medium text-gray-900 line-clamp-1">
              {book.title}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        {isMenuOpen && (
          <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-6">
            {/* Font Size Control */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Ukuran Font
              </h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm">A</span>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value: number[]) => changeFontSize(value[0])}
                  min={50}
                  max={200}
                  step={10}
                  className="flex-1"
                />
                <span className="text-lg">A</span>
              </div>
            </div>

            {/* Table of Contents */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <List className="w-4 h-4 mr-2" />
                Daftar Isi
              </h3>
              <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                {tocRef.current?.map((chapter: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      renditionRef.current?.display(chapter.href)
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left py-2 px-3 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {chapter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reader */}
        <div className="flex-1 h-[calc(100vh-64px)]">
          <ReactReader
            url={`http://localhost:3000/public/${book.fileBook}`}
            title={book.title}
            location={location}
            locationChanged={locationChanged}
            getRendition={getRendition}
            tocChanged={(toc) => {
              tocRef.current = toc
            }}
            epubOptions={{
              flow: 'scrolled-doc',
              manager: 'continuous',
              spread: 'none',
              width: '100%'
            }}
            
            swipeable={false}
            showToc={false}
            loadingView={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
} 