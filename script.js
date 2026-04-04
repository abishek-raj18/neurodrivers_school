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

  // Lightbox
  const galleryItems = document.querySelectorAll('.media-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  
  let currentIndex = 0;
  
  function updateLightboxContent(item) {
    if (item.tagName.toLowerCase() === 'video') {
      lightboxImg.style.display = 'none';
      lightboxVideo.style.display = 'block';
      lightboxVideo.src = item.src;
      lightboxVideo.play().catch(e => console.log("Auto-play prevented", e));
    } else {
      lightboxVideo.style.display = 'none';
      lightboxVideo.pause();
      lightboxImg.style.display = 'block';
      lightboxImg.src = item.src;
    }
  }

  function openLightbox(index) {
    if (!lightbox) return;
    currentIndex = index;
    updateLightboxContent(galleryItems[currentIndex]);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightboxVideo.pause();
    lightboxVideo.src = "";
    document.body.style.overflow = 'auto';
  }
  
  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightboxContent(galleryItems[currentIndex]);
  }
  
  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent(galleryItems[currentIndex]);
  }
  
  galleryItems.forEach((item, index) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => openLightbox(index));
  });
  
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  
  // Close on outside click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

