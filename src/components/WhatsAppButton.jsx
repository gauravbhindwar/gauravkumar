'use client'

import { usePathname } from 'next/navigation'
import { FaWhatsapp } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'

// Converts a display phone number like "+91 9006045930" into the
// digits-only format wa.me requires (country code + number, no symbols).
function toWhatsAppDigits(phone) {
  if (!phone) return null
  const digits = phone.replace(/[^\d]/g, '')
  return digits.length >= 8 ? digits : null
}

export default function WhatsAppButton() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const { data: contactData } = useFetch('/api/contact', { revalidate: 3600000 })

  // Reuses the phone number managed in Admin > Contact — no separate
  // WhatsApp field, so keeping that number current is what drives this.
  const digits = toWhatsAppDigits(contactData?.phone)

  if (isAdminRoute || !digits) {
    return null
  }

  const message = encodeURIComponent("Hi Gaurav! I found your portfolio and I'd like to connect.")

  return (
    <a
      href={`https://wa.me/${digits}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 animate-[pulse_2.5s_ease-in-out_infinite]"
    >
      <FaWhatsapp className="w-7 h-7" />
    </a>
  )
}
