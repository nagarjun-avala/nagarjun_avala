// components/DynamicContactMe.tsx
import { Button } from '@/components/ui/button';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Profile } from '../page';

interface DynamicContactMeProps {
  profile: Profile;
}

const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
  honeypot: z.string().optional(),
});

type ContactFormData = z.infer<typeof ContactSchema>;

const DynamicContactMeComponent: React.FC<DynamicContactMeProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

      const result = await res.json();

      if (res.ok) {
        toast.success('Message sent successfully! I\'ll get back to you soon.');
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        toast.error(result.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Let&apos;s Connect!</h3>
            <p className="text-gray-300 leading-relaxed">
              I&apos;m always excited to discuss new opportunities, collaborate on interesting projects,
              or just have a chat about technology and development. Feel free to reach out!
            </p>
          </div>

          <div className="space-y-4">
            <motion.a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur rounded-lg border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group"
              whileHover={{ x: 5 }}
            >
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Send size={20} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-gray-400 text-sm group-hover:text-cyan-400 transition-colors">
                  {profile.email}
                </p>
              </div>
            </motion.a>

            {profile.phone && (
              <motion.a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur rounded-lg border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group"
                whileHover={{ x: 5 }}
              >
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Send size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Phone</p>
                  <p className="text-gray-400 text-sm group-hover:text-cyan-400 transition-colors">
                    {profile.phone}
                  </p>
                </div>
              </motion.a>
            )}
          </div>

          <div className="pt-6">
            <p className="text-gray-400 text-sm">
              Response time: <span className="text-cyan-400 font-medium">Usually within 24 hours</span>
            </p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl hover:border-cyan-500/30 transition-all duration-300"
          >
            {/* Honeypot field for spam protection */}
            <input
              {...register('honeypot')}
              type="text"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="space-y-4">
              <div>
                <input
                  {...register('name')}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur text-white placeholder-gray-400 border border-white/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur text-white placeholder-gray-400 border border-white/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <textarea
                  {...register('message')}
                  placeholder="Tell me about your project or just say hello..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur text-white placeholder-gray-400 border border-white/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={loading || success}
                className={`w-full py-3 text-base flex items-center justify-center gap-2 rounded-xl transition-all duration-300 ${success
                  ? 'bg-green-600 hover:bg-green-600 cursor-default'
                  : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-lg hover:shadow-xl'
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Sending...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle size={18} />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </Button>
            </motion.div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
              >
                <p className="text-green-400 text-sm">
                  Thanks for reaching out! I&apos;ll get back to you as soon as possible.
                </p>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default DynamicContactMeComponent;