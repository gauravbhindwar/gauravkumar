'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AchievementsAwards = () => {
  const [achievements, setAchievements] = useState([]);
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Combine and sort data when achievements or awards change
    const combined = [
      ...achievements.map(item => ({ ...item, type: 'achievement' })),
      ...awards.map(item => ({ ...item, type: 'award' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setCombinedData(combined);
  }, [achievements, awards]);

  const fetchData = async () => {
    try {
      const [achievementsRes, awardsRes] = await Promise.all([
        fetch('/api/achievements'),
        fetch('/api/awards')
      ]);
      
      const achievementsData = await achievementsRes.json();
      const awardsData = await awardsRes.json();
      
      if (achievementsData.success) {
        setAchievements(achievementsData.data);
      }
      
      if (awardsData.success) {
        setAwards(awardsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getFilteredData = () => {
    switch (activeTab) {
      case 'achievements':
        return combinedData.filter(item => item.type === 'achievement');
      case 'awards':
        return combinedData.filter(item => item.type === 'award');
      case 'featured':
        return combinedData.filter(item => item.isFeatured);
      default:
        return combinedData;
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'achievement') {
      return '🏆';
    }
    return '🥇';
  };

  const getTypeColor = (type) => {
    if (type === 'achievement') {
      return 'bg-success/10 text-success border-success/20';
    }
    return 'bg-warning/10 text-warning border-warning/20';
  };

  if (loading) {
    return (
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </section>
    );
  }

  const filteredData = getFilteredData();

  return (
    <section className="py-20 bg-base-200" id="achievements-awards">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Achievements & Awards
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Recognition, accomplishments, and certifications that highlight my journey
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="tabs tabs-boxed bg-base-100 shadow-lg">
            {[
              { key: 'all', label: 'All', count: combinedData.length },
              { key: 'achievements', label: 'Achievements', count: achievements.length },
              { key: 'awards', label: 'Awards & Certifications', count: awards.length },
              { key: 'featured', label: 'Featured', count: combinedData.filter(item => item.isFeatured).length }
            ].map((tab) => (
              <button
                key={tab.key}
                className={`tab tab-lg ${activeTab === tab.key ? 'tab-active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className="ml-2 badge badge-sm">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((item, index) => (
            <motion.div
              key={`${item.type}-${item._id}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className={`badge ${getTypeColor(item.type)} border`}>
                    {getTypeIcon(item.type)} {item.type === 'achievement' ? 'Achievement' : 'Award'}
                  </div>
                  
                  {item.isFeatured && (
                    <div className="badge badge-primary">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                <h3 className="card-title text-lg mb-2 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-sm text-primary font-medium mb-2">
                  {item.organization || item.awardedBy} • {formatDate(item.date)}
                </p>

                {item.level && (
                  <div className="badge badge-outline badge-sm mb-3">
                    {item.level} Level
                  </div>
                )}

                <p className="text-base-content/80 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>

                {item.impact && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-success mb-1">Impact:</p>
                    <p className="text-xs text-base-content/70">{item.impact}</p>
                  </div>
                )}

                {item.metrics && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-info mb-1">Metrics:</p>
                    <p className="text-xs text-base-content/70">{item.metrics}</p>
                  </div>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="badge badge-ghost badge-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="badge badge-ghost badge-xs">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="card-actions justify-end">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      View Project
                    </a>
                  )}
                  
                  {item.certificateUrl && (
                    <a
                      href={item.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      Certificate
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <p className="text-base-content/60 text-lg">
              No items found for the selected filter.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AchievementsAwards;