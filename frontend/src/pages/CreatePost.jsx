import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const categories = ['ID Card', 'Mobile Phone', 'Laptop', 'Bag', 'Books', 'Keys', 'Wallet', 'Headphones', 'Other'];

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lost',
    category: '',
    location: '',
    date: '',
    contactInfo: '',
    imageURL: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState('');
  const navigate = useNavigate();
  const maxDate = new Date().toLocaleDateString('en-CA');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('Image must be less than 3MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPG, PNG, and WEBP images are allowed');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageURL = formData.imageURL;

      if (imageFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);

        const uploadResponse = await axios.post('https://lostify-4z5d.onrender.com/api/upload', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageURL = uploadResponse.data.imageUrl;
        setUploading(false);
      }

      await axios.post('https://lostify-4z5d.onrender.com/api/posts/create', { ...formData, imageURL });
      toast.success('Post created successfully!');
      navigate('/my-posts');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create post';
      setError(errorMsg);
      toast.error(errorMsg);
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'date') {
      if (value && value > maxDate) {
        setDateError('Please select a valid date — future dates are not allowed.');
        return;
      } else {
        setDateError('');
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-white mb-8">Post an Item</h1>
      
      {error && (
        <div className="bg-lost/10 border border-lost text-lost px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
            Type <span className="text-lost">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
            Title <span className="text-lost">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
            Description <span className="text-lost">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="input-field"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
            Category <span className="text-lost">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
            Location <span className="text-lost">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
            Date <span className="text-lost">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={maxDate}
            className="input-field"
            required
          />
          {dateError && (
            <p className="text-lost text-sm mt-1">{dateError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
            Contact Number <span className="text-lost">*</span>
          </label>
          <input
            type="tel"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="input-field"
            required
            placeholder="Enter phone number (e.g., 9876543210)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">Add Image (Optional)</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange}
            className="input-field"
          />
          <p className="text-xs text-charcoal/60 dark:text-white/60 mt-1">
            Max size: 3MB. Supported: JPG, PNG, WEBP
          </p>
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {uploading ? 'Uploading Image...' : loading ? 'Creating Post...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
