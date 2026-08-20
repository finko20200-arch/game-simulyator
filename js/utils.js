/**
 * Seven Nights of the Comet - Utility Functions
 */

const Utils = {
  /**
   * Safe localStorage operations with error handling
   */
  storage: {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('LocalStorage read error:', e);
        return defaultValue;
      }
    },
    
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn('LocalStorage write error:', e);
        return false;
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn('LocalStorage remove error:', e);
        return false;
      }
    }
  },
  
  /**
   * Format timestamp for save files
   */
  formatTime(date) {
    const d = new Date(date);
    return d.toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  },
  
  /**
   * Debounce function calls
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * Clamp value between min and max
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },
  
  /**
   * Preload images with error handling
   */
  preloadImages(sources) {
    const promises = Object.entries(sources).map(([key, src]) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ key, success: true, img });
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          resolve({ key, success: false, src });
        };
        img.src = src;
      });
    });
    return Promise.all(promises);
  },
  
  /**
   * Generate unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
  
  /**
   * Deep clone object
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

Object.freeze(Utils);
