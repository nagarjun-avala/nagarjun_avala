import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema
const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
});

type ContactFormData = z.infer<typeof ContactSchema>;

const ContactMeComponent = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('Message sent successfully!');
        reset();
      } else {
        toast.error('Something went wrong.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto space-y-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl"
      >
        <div>
          <input
            {...register('name')}
            placeholder="Name"
            className="w-full px-5 py-3 rounded-xl bg-white/10 backdrop-blur text-white placeholder-gray-400 text-base"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full px-5 py-3 rounded-xl bg-white/10 backdrop-blur text-white placeholder-gray-400 text-base"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <textarea
            {...register('message')}
            placeholder="Your message..."
            rows={6}
            className="w-full px-5 py-3 rounded-xl bg-white/10 backdrop-blur text-white placeholder-gray-400 text-base"
          />
          {errors.message && (
            <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-base flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactMeComponent;
