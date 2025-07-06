import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import React, { useState } from 'react'

const ContactMeComponent = () => {

    const [form, setForm] = useState({ name: "", email: "", message: "" });
  

     const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
          if (res.ok) alert("Message sent successfully!");
        } catch {
          alert("Something went wrong.");
        }
      };
  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <input
          name="name"
          required
          placeholder="Name"
          value={form.name}
          onChange={handleFormChange}
          className="w-full px-4 py-2 rounded bg-white/10 backdrop-blur text-white placeholder-gray-400"
        />
        <input
          name="email"
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleFormChange}
          className="w-full px-4 py-2 rounded bg-white/10 backdrop-blur text-white placeholder-gray-400"
        />
        <textarea
          name="message"
          required
          placeholder="Your message..."
          value={form.message}
          onChange={handleFormChange}
          rows={4}
          className="w-full px-4 py-2 rounded bg-white/10 backdrop-blur text-white placeholder-gray-400"
        />
        <Button
          type="submit"
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500"
        >
          <Send size={16} /> Send
        </Button>
      </form>
    </div>
  );
}

export default ContactMeComponent