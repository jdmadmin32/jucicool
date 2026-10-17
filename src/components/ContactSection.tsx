import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: 'General Enquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.message) return;

    // Send customer enquiry directly to WhatsApp
    const waText = [
      '💬 *CUSTOMER ENQUIRY - JUCI COOL* 💬',
      '━━━━━━━━━━━━━━━━━━━━━',
      `👤 *Name:* ${formData.name.trim()}`,
      `📞 *Contact:* ${formData.contact.trim()}`,
      `🏷️ *Subject:* ${formData.subject}`,
      '',
      '📝 *MESSAGE:*',
      formData.message.trim(),
      '━━━━━━━━━━━━━━━━━━━━━',
    ].join('\n');

    const waUrl = `https://api.whatsapp.com/send?phone=919393122122&text=${encodeURIComponent(waText)}`;
    try {
      window.open(waUrl, '_blank');
    } catch {
      window.location.href = waUrl;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', contact: '', subject: 'General Enquiry', message: '' });
    }, 4000);
  };

  return (
    <section id="contact-section" className="py-10 sm:py-20 bg-[#FFFEF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#138443]/10 text-[#138443] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" /> Reach Out
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#183D2B] font-poppins leading-tight">
            Contact JDM Fruit Products
          </h2>
          <p className="text-xs sm:text-sm text-[#68756B] mt-2">
            Have a question about our drinks, factory supply, retail orders, or distribution? Our team is available directly on WhatsApp and phone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10">
          {/* Contact Details Cards — horizontal scroll on mobile */}
          <div className="lg:col-span-5">
            {/* Mobile: 2-column compact info tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
              {/* Address */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-3 active:scale-[0.98] transition-transform"
              >
                <div className="p-2.5 rounded-xl bg-[#138443] text-white flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#8CC63E]" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-[#183D2B]">Office & Factory</h4>
                  <p className="text-[11px] sm:text-xs text-[#68756B] mt-0.5 leading-relaxed">
                    JDM Fruit Products Pvt. Ltd.<br />
                    Industrial Area, Hyderabad — 500037
                  </p>
                </div>
              </a>

              {/* Phone / WhatsApp */}
              <a
                href="https://api.whatsapp.com/send?phone=919393122122"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-3 active:scale-[0.98] transition-transform hover:border-[#138443]"
              >
                <div className="p-2.5 rounded-xl bg-[#25D366] text-white flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-[#183D2B]">Call / WhatsApp</h4>
                  <p className="text-[11px] sm:text-xs text-[#68756B] mt-0.5">
                    Orders & WhatsApp: <span className="font-bold text-[#138443]">+91 9393122122</span><br />
                    Direct Contact: <span className="font-semibold text-[#138443]">9393122122</span>
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@jucicool.com"
                className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-3 active:scale-[0.98] transition-transform"
              >
                <div className="p-2.5 rounded-xl bg-[#138443] text-white flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#8CC63E]" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-[#183D2B]">Email Us</h4>
                  <p className="text-[11px] sm:text-xs text-[#68756B] mt-0.5">
                    <span className="font-semibold text-[#138443]">info@jucicool.com</span><br />
                    <span className="font-semibold text-[#138443]">sales@jucicool.com</span>
                  </p>
                </div>
              </a>

              {/* Hours */}
              <div className="p-4 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#138443] text-white flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#8CC63E]" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-[#183D2B]">Working Hours</h4>
                  <p className="text-[11px] sm:text-xs text-[#68756B] mt-0.5">
                    Mon–Sat: 9 AM – 7 PM IST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-8 rounded-3xl border border-[#E6EBDD] shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-[#183D2B] font-poppins mb-1">
              Send us a Message
            </h3>
            <p className="text-[11px] sm:text-xs text-[#68756B] mb-5">
              Fill in your details and our customer care team will get back to you promptly.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-emerald-800">Message Received!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you for writing to Juci Cool. Our representative will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-[#183D2B] mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Rao"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-3 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:ring-2 focus:ring-[#138443]/30 focus:border-[#138443] bg-[#FFFEF7]"
                      style={{ minHeight: '44px' }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-[#183D2B] mb-1">
                      Phone / Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98000 00000 or email"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-3 py-3 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:ring-2 focus:ring-[#138443]/30 focus:border-[#138443] bg-[#FFFEF7]"
                      style={{ minHeight: '44px' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-[#183D2B] mb-1">
                    Enquiry Type
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-3 text-xs rounded-xl border border-[#E6EBDD] bg-[#FFFEF7] focus:outline-none focus:ring-2 focus:ring-[#138443]/30 focus:border-[#138443]"
                    style={{ minHeight: '44px' }}
                  >
                    <option value="General Enquiry">General Product Enquiry</option>
                    <option value="Retail Order Question">Retail Order Assistance</option>
                    <option value="Dealership Interest">Dealership / Distribution Interest</option>
                    <option value="Feedback">Product Quality Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-[#183D2B] mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you today?..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-3 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:ring-2 focus:ring-[#138443]/30 focus:border-[#138443] bg-[#FFFEF7] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#138443] hover:bg-[#0d6131] active:scale-[0.98] text-white shadow-md transition-all flex items-center justify-center gap-2"
                  style={{ minHeight: '48px' }}
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
