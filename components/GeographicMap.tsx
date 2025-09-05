// components/GeographicMap.tsx - Simple geographic visualization
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe } from 'lucide-react';

interface CountryData {
    country: string;
    count: number;
    totalViews: number;
}

interface GeographicMapProps {
    data: CountryData[];
    totalVisitors: number;
}

export const GeographicMap: React.FC<GeographicMapProps> = ({ data, totalVisitors }) => {
    const maxCount = Math.max(...data.map(d => d.count));

    return (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6" >
            <div className="flex items-center gap-2 mb-6" >
                <Globe className="text-cyan-400" size={20} />
                <h3 className="text-lg font-semibold" > Geographic Distribution </h3>
            </div>

            < div className="space-y-3" >
                {
                    data.map((country, index) => {
                        const percentage = (country.count / totalVisitors * 100).toFixed(1);
                        const barWidth = (country.count / maxCount * 100);

                        return (
                            <motion.div
                                key={country.country}
                                initial={{ opacity: 0, x: -20 }
                                }
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }
                                }
                                className="group"
                            >
                                <div className="flex items-center justify-between mb-2" >
                                    <div className="flex items-center gap-2" >
                                        <MapPin size={14} className="text-gray-400" />
                                        <span className="text-white font-medium" > {country.country} </span>
                                    </div>
                                    < div className="text-right" >
                                        <span className="text-cyan-400 font-mono text-sm" > {country.count} </span>
                                        < span className="text-gray-400 text-xs ml-2" > ({percentage} %) </span>
                                    </div>
                                </div>

                                < div className="w-full bg-gray-700/50 rounded-full h-2 relative overflow-hidden" >
                                    <motion.div
                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full relative"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${barWidth}%` }}
                                        transition={{ duration: 1, delay: index * 0.2 }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                                    </motion.div>
                                </div>

                                < div className="mt-1 text-xs text-gray-500" >
                                    {country.totalViews} total views
                                </div>
                            </motion.div>
                        );
                    })}
            </div>

            {
                data.length === 0 && (
                    <div className="text-center py-8" >
                        <Globe className="mx-auto text-gray-500 mb-2" size={32} />
                        <p className="text-gray-400" > No geographic data available </p>
                    </div>
                )
            }
        </div>
    );
};