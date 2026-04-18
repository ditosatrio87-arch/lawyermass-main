import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

export function Kontak() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-6">

        {/* HERO */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Butuh Bantuan Hukum?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Konsultasi GRATIS sekarang, respon cepat dalam hitungan menit ⚡
          </p>

          {/* CTA UTAMA */}
          <a
            href="https://wa.me/6289530407021"
            target="_blank"
            className="inline-block mt-6 bg-[#25D366] text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition"
          >
            Chat WhatsApp Sekarang 🚀
          </a>

          <p className="text-red-400 text-sm mt-3">
            🔥 Respon rata-rata {"<"} 5 menit
          </p>
        </div>

        {/* CONTACT CARDS */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

          {/* PHONE */}
          <a href="tel:6289530407021">
            <Card className="bg-[#1a1a1a] border border-[#AE8737] hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(174,135,55,0.4)] transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#AE8737]/10 flex items-center justify-center group-hover:scale-110 transition">
                  <Phone className="w-8 h-8 text-[#AE8737]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#AE8737]">
                  Telepon
                </h3>
                <p className="text-gray-400">+62 895 3040 7021</p>
              </CardContent>
            </Card>
          </a>

          {/* EMAIL */}
          <a href="mailto:kantorpengacaramas@gmail.com">
            <Card className="bg-[#1a1a1a] border border-[#AE8737] hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(174,135,55,0.4)] transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#AE8737]/10 flex items-center justify-center group-hover:scale-110 transition">
                  <Mail className="w-8 h-8 text-[#AE8737]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#AE8737]">
                  Email
                </h3>
                <p className="text-gray-400 break-all">
                  kantorpengacaramas@gmail.com
                </p>
              </CardContent>
            </Card>
          </a>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/6289530407021"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="bg-[#1a1a1a] border border-[#25D366] hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:scale-110 transition">
                  <MessageCircle className="w-8 h-8 text-[#25D366]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#25D366]">
                  WhatsApp
                </h3>
                <p className="text-gray-400">
                  Chat langsung sekarang
                </p>
              </CardContent>
            </Card>
          </a>

        </div>

        {/* INFO */}
        <div className="mt-16 max-w-5xl mx-auto">
          <Card className="bg-[#111] border border-[#AE8737] overflow-hidden">
            <CardContent className="p-8 grid md:grid-cols-2 gap-10">

              {/* ADDRESS */}
              <div className="flex gap-4">
                <MapPin className="text-[#AE8737] w-6 h-6 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Alamat Kantor
                  </h3>
                  <p className="text-gray-400">
                    Ruko Estrela, Banjar Wijaya No.6<br />
                    Cipete, Pinang, Tangerang<br />
                    Banten 15142
                  </p>
                </div>
              </div>

              {/* HOURS */}
              <div className="flex gap-4">
                <Clock className="text-[#AE8737] w-6 h-6 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Jam Operasional
                  </h3>
                  <p className="text-gray-400">
                    Senin - Jumat: 09.00 - 17.00<br />
                    Sabtu: 09.00 - 14.00<br />
                    <span className="text-red-400">Minggu: Tutup</span>
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* TRUST */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Dipercaya oleh klien UMKM & perusahaan di Indonesia
          </p>
        </div>

      </div>
    </section>
  );
}