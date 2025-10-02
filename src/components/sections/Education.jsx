'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaAward, FaBook } from 'react-icons/fa';

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/education');
      const data = await response.json();
      if (data.success) {
        setEducation(data.data);
      }
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-base-100 to-base-200/50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative" id="education">
      <div className="absolute inset-0 bg-gradient-to-b from-base-100 to-base-200/50"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full mb-6">
              <FaGraduationCap className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Academic Journey</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Education
              </span>
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              My academic foundation and continuous learning journey
            </p>
          </motion.div>

          {/* Education Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent hidden md:block"></div>
            
            <div className="space-y-12">
              {education.map((edu, index) => (
                <motion.div
                  key={edu._id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-5 h-5 bg-primary rounded-full border-4 border-base-100 shadow-lg hidden md:block z-10"></div>
                  
                  <div className="md:ml-20">
                    <div className="group bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-sm rounded-3xl p-8 
                                  border border-base-content/5 hover:border-primary/20 transition-all duration-300
                                  hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] hover:-translate-y-2">
                      
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
                        <div className="mb-4 lg:mb-0">
                          <h3 className="text-2xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              {edu.degree}
                            </span>
                            {edu.field && (
                              <span className="text-base-content/80 block text-lg mt-1">
                                in {edu.field}
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-3 text-base-content/70 mb-2">
                            <div className="flex items-center gap-2">
                              <FaGraduationCap className="w-4 h-4 text-primary" />
                              <span className="font-semibold">{edu.institution}</span>
                            </div>
                          </div>
                          {edu.location && (
                            <div className="flex items-center gap-2 text-base-content/60">
                              <FaMapMarkerAlt className="w-3 h-3" />
                              <span className="text-sm">{edu.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="lg:text-right">
                          <div className="flex items-center gap-2 text-primary font-medium mb-2">
                            <FaCalendarAlt className="w-4 h-4" />
                            <span>
                              {formatDate(edu.startDate)} - {edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate)}
                            </span>
                          </div>
                          {edu.grade && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full">
                              <FaAward className="w-3 h-3" />
                              <span className="text-sm font-semibold">
                                {edu.gradeType}: {edu.grade}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {edu.description && (
                        <p className="text-base-content/80 mb-6 leading-relaxed">{edu.description}</p>
                      )}

                      {/* Coursework */}
                      {edu.coursework && edu.coursework.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-4">
                            <FaBook className="w-4 h-4 text-secondary" />
                            <h4 className="font-semibold text-base-content">Key Coursework</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {edu.coursework.slice(0, 8).map((course, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 bg-primary/10 text-primary text-sm rounded-full 
                                         border border-primary/20 hover:bg-primary/20 transition-colors"
                              >
                                {course}
                              </span>
                            ))}
                            {edu.coursework.length > 8 && (
                              <span className="px-4 py-2 bg-base-300/50 text-base-content/60 text-sm rounded-full border border-base-content/10">
                                +{edu.coursework.length - 8} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Achievements */}
                      {edu.achievements && edu.achievements.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <FaAward className="w-4 h-4 text-warning" />
                            <h4 className="font-semibold text-base-content">Achievements</h4>
                          </div>
                          <div className="space-y-2">
                            {edu.achievements.map((achievement, idx) => (
                              <div key={idx} className="flex items-start gap-3 p-3 bg-base-200/30 rounded-xl">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-base-content/80">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;