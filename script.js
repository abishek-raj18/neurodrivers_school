import { supabase } from './supabase.js';

// Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(r => observer.observe(r));

  // Nav scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 60) {
      nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.12)';
    } else {
      nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)';
    }
  });

  // ── LIGHTBOX ──────────────────────────────────────────────────
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const closeBtn      = document.querySelector('.lightbox-close');
  const prevBtn       = document.querySelector('.lightbox-prev');
  const nextBtn       = document.querySelector('.lightbox-next');

  // All clickable media — both regular gallery AND autism-day collage
  const allMedia = Array.from(document.querySelectorAll('.media-item'));
  let currentIndex = 0;

  function getSrc(el) {
    return el.tagName.toLowerCase() === 'video' ? el.src : el.src;
  }

  function updateLightboxContent(el) {
    if (el.tagName.toLowerCase() === 'video') {
      lightboxImg.style.display   = 'none';
      lightboxVideo.style.display = 'block';
      lightboxVideo.src = el.src;
      lightboxVideo.load();
      lightboxVideo.play().catch(() => {});
    } else {
      lightboxVideo.pause();
      lightboxVideo.style.display = 'none';
      lightboxImg.style.display   = 'block';
      lightboxImg.src = el.src;
    }
  }

  function openLightbox(index) {
    if (!lightbox) return;
    currentIndex = index;
    updateLightboxContent(allMedia[currentIndex]);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightboxVideo.pause();
    lightboxVideo.src = '';
    document.body.style.overflow = 'auto';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % allMedia.length;
    updateLightboxContent(allMedia[currentIndex]);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + allMedia.length) % allMedia.length;
    updateLightboxContent(allMedia[currentIndex]);
  }

  // Attach click to every media item (incl. ac-media)
  allMedia.forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => openLightbox(i));
  });

  // Also make the whole ac-item tile clickable (so overlay play btn works)
  document.querySelectorAll('.ac-item').forEach(tile => {
    tile.style.cursor = 'pointer';
    tile.addEventListener('click', (e) => {
      // Find the media-item inside this tile
      const media = tile.querySelector('.media-item');
      if (!media) return;
      const idx = allMedia.indexOf(media);
      if (idx !== -1) openLightbox(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn)  nextBtn.addEventListener('click',  showNext);
  if (prevBtn)  prevBtn.addEventListener('click',  showPrev);

  // Close on backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
  });

  // ── SUPABASE INTEGRATION ────────────────────────────────────
  async function loadSupabaseImages() {
    // Skip entirely if Supabase is not configured — static HTML content stays intact
    if (!supabase) {
      console.info('Supabase not connected — showing static content.');
      return;
    }

    try {
      const galleryGrid = document.querySelector('.gallery-grid');
      const campusGrid  = document.querySelector('.intro-visual-grid');

      // 1. Fetch from 'gallery_images' table
      const { data: galleryItems, error: galleryError } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (galleryError) throw galleryError;

      // 2. Fetch from 'campus_images' table (for Our Campus section)
      const { data: campusItems, error: campusError } = await supabase
        .from('campus_images')
        .select('*');

      if (campusError) throw campusError;

      // Only replace static content if Supabase returned rows
      const hasGallery = galleryGrid && galleryItems && galleryItems.length > 0;
      const hasCampus  = campusGrid  && campusItems  && campusItems.length  > 0;

      if (hasGallery || hasCampus) {
        if (hasGallery) galleryGrid.innerHTML = '';
        if (hasCampus)  campusGrid.innerHTML  = '';
        allMedia.length = 0;
      }

      if (hasGallery) {
        galleryItems.forEach((item) => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'gallery-item reveal visible';

          const img = document.createElement('img');
          img.src       = item.url;
          img.alt       = item.alt_text || 'Gallery photo';
          img.className = 'media-item';

          itemDiv.appendChild(img);
          galleryGrid.appendChild(itemDiv);

          allMedia.push(img);
          const newIndex = allMedia.length - 1;
          img.style.cursor = 'pointer';
          img.addEventListener('click', () => openLightbox(newIndex));
        });
      }

      if (hasCampus) {
        campusItems.forEach((item) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'intro-img-wrapper reveal visible';

          const img = document.createElement('img');
          img.src       = item.url;
          img.alt       = item.alt_text || 'Campus photo';
          img.className = 'media-item';

          wrapper.appendChild(img);
          campusGrid.appendChild(wrapper);

          allMedia.push(img);
          const newIndex = allMedia.length - 1;
          img.style.cursor = 'pointer';
          img.addEventListener('click', () => openLightbox(newIndex));
        });
      }

    } catch (err) {
      console.error('Supabase image load error:', err.message);
      // Static content remains — no further action needed
    }
  }

  // Initialize Supabase loading (safe — won't break page if not connected)
  loadSupabaseImages();

