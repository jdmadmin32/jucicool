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
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', contact: '', subject: 'General Enquiry', message: '' });
    }, 4000);
  };

  return (
    <section id="contact-section" className="py-20 bg-[#FFFEF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#138443]/10 text-[#138443] text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" /> Reach Out
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#183D2B] font-poppins">
            Contact JDM Fruit Products
          </h2>
          <p className="text-sm text-[#68756B] mt-2">
            Have a question about our drinks, factory supply, retail orders, or distribution? Our Hyderabad team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#138443] text-white flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#8CC63E]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#183D2B]">Corporate Office & Bottling Plant</h4>
                <p className="text-xs text-[#68756B] mt-1 leading-relaxed">
                  JDM Fruit Products Pvt. Ltd.<br />
                  Industrial Area, Hyderabad, Telangana — 500037, India
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#138443] text-white flex-shrink-0">
                <Phone className="w-6 h-6 text-[#8CC63E]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#183D2B]">Phone & WhatsApp Helpline</h4>
                <p className="text-xs text-[#68756B] mt-1">
                  General Enquiries: <a href="tel:+919849012345" className="font-semibold text-[#138443] hover:underline">+91 98490 12345</a><br />
                  Wholesale Desk: <a href="tel:+919849012346" className="font-semibold text-[#138443] hover:underline">+91 98490 12346</a>
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#138443] text-white flex-shrink-0">
                <Mail className="w-6 h-6 text-[#8CC63E]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#183D2B]">Email Addresses</h4>
                <p className="text-xs text-[#68756B] mt-1">
                  Customer Support: <a href="mailto:info@jucicool.com" className="font-semibold text-[#138443] hover:underline">info@jucicool.com</a><br />
                  Trade Enquiries: <a href="mailto:sales@jucicool.com" className="font-semibold text-[#138443] hover:underline">sales@jucicool.com</a>
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E6EBDD] shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#138443] text-white flex-shrink-0">
                <Clock className="w-6 h-6 text-[#8CC63E]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#183D2B]">Factory & Office Working Hours</h4>
                <p className="text-xs text-[#68756B] mt-1">
                  Monday to Saturday: 9:00 AM – 7:00 PM IST<br />
                  Sunday: Closed (Dispatch lines active)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E6EBDD] shadow-card">
            <h3 className="text-lg font-bold text-[#183D2B] font-poppins mb-1">
              Send us a Message
            </h3>
            <p className="text-xs text-[#68756B] mb-6">
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Rao"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                      Phone Number / Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98000 00000 or email"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Subject / Enquiry Type
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6EBDD] bg-white focus:outline-none focus:border-[#138443]"
                  >
                    <option value="General Enquiry">General Product Enquiry</option>
                    <option value="Retail Order Question">Retail Order Assistance</option>
                    <option value="Dealership Interest">Dealership / Distribution Interest</option>
                    <option value="Feedback">Product Quality Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#183D2B] mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you today?..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-[#138443] hover:bg-[#0d6131] text-white shadow-md transition-colors flex items-center justify-center gap-2"
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
