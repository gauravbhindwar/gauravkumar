'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ProfilePictureUpdate = ({ currentPicture = '/gaurav.jpg', onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentPicture);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowModal(true);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profilePicture', file);

      // Upload to your API endpoint
      const response = await fetch('/api/profile/upload-picture', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        // Update profile with new picture URL
        if (onUpdate) {
          onUpdate(result.pictureUrl);
        }
        setShowModal(false);
        alert('Profile picture updated successfully!');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(currentPicture);
    setShowModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <div className="avatar">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <Image
                src={currentPicture}
                alt="Profile Picture"
                width={128}
                height={128}
                className="object-cover"
                onError={() => setPreviewUrl('/gaurav.jpg')}
              />
            </div>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <span className="text-white text-sm font-medium">Change Photo</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-primary btn-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Update Picture
        </button>
      </div>

      {/* Upload Confirmation Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Update Profile Picture</h3>
            
            <div className="flex justify-center mb-6">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <p className="text-center text-base-content/70 mb-6">
              Do you want to update your profile picture with this image?
            </p>

            <div className="modal-action">
              <button
                onClick={handleCancel}
                className="btn btn-ghost"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className={`btn btn-primary ${isUploading ? 'loading' : ''}`}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Update Picture'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePictureUpdate;