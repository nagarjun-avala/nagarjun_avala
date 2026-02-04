import { Certification } from '@/lib/types'
import { Award, ExternalLink } from 'lucide-react'
import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

type Props = {
    certifications: Certification[]
}

const CertificationsSection = ({ certifications }: Props) => {
    if (!certifications || certifications.length === 0) return null;
    return (
        <section id="certifications" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
            <h2 className="mb-10 text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">// Certs & Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert) => (
                    <div key={cert.id} className="flex flex-col gap-4 p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 shrink-0">
                                <Award size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight mb-1">{cert.name || cert.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{cert.organization || cert.issuer}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {cert.category && <Badge variant="secondary" className="text-[10px] h-5 px-2">{cert.category}</Badge>}
                                    {cert.issueDate && (
                                        <span className="text-[10px] text-slate-400 flex items-center">
                                            {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {(cert.credentialID || cert.credentialURL) && (
                            <div className="pt-4 mt-auto border-t border-slate-200/50 dark:border-slate-700/50">
                                {cert.credentialID && (
                                    <p className="text-[10px] text-slate-400 font-mono mb-2">ID: {cert.credentialID}</p>
                                )}
                                {cert.credentialURL && (
                                    <Button variant="outline" size="sm" className="w-full h-8 text-xs" asChild>
                                        <a href={cert.credentialURL} target="_blank" rel="noopener noreferrer">
                                            View Credential <ExternalLink size={12} className="ml-2" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CertificationsSection