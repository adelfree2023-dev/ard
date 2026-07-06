/* ==========================================================================
   Al-Moatamad Events - Interactive Client-Side Logic & Estimator
   Theme: Luxury Gold & Charcoal Dark Mode
   Target Platform: GitHub Pages Static Hosting (Fully Optimized)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    /* 1. STICKY HEADER & SCROLL SPY
       ========================================================================== */
    const header = document.getElementById("main-header");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }

        let currentSectionId = "";
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 120;
            const sectionHeight = sec.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute("id");
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });

    /* 2. MOBILE NAVIGATION TOGGLE
       ========================================================================== */
    const mobileToggle = document.getElementById("mobile-toggle");
    const siteNav = document.getElementById("site-nav");
    const navOverlay = document.getElementById("nav-overlay");

    function openNav() {
        siteNav.classList.add("active");
        mobileToggle.classList.add("open");
        if (navOverlay) navOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeNav() {
        siteNav.classList.remove("active");
        mobileToggle.classList.remove("open");
        if (navOverlay) navOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    mobileToggle.addEventListener("click", () => {
        if (siteNav.classList.contains("active")) {
            closeNav();
        } else {
            openNav();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener("click", closeNav);
    });

    if (navOverlay) {
        navOverlay.addEventListener("click", closeNav);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && siteNav.classList.contains("active")) {
            closeNav();
        }
    });

    /* 3. DYNAMIC 70-IMAGE GALLERY ENGINE (WITH LAZY-LOAD & FILTER & LOAD-MORE)
       ========================================================================== */
    // Generate Metadata for the 70 user images in images/img-1.jpg to images/img-70.jpg
    const isEn = document.documentElement.lang === "en";
    const galleryImages = [];
    for (let i = 1; i <= 70; i++) {
        let category = "tents";
        let categoryLabel = isEn ? "Royal Tents" : "خيام ملكية";
        let title = isEn ? `VIP Royal Tent - Design ${i}` : `خيمة ملكية VIP - تصميم ${i}`;
        
        if (i > 20 && i <= 40) {
            category = "furniture";
            categoryLabel = isEn ? "Luxury Furniture & Majlis" : "أثاث ومجالس";
            title = isEn ? `Luxury Majlis & Furniture - Design ${i - 20}` : `مجالس وأثاث فاخر - تصميم ${i - 20}`;
        } else if (i > 40 && i <= 55) {
            category = "lighting";
            categoryLabel = isEn ? "Lighting & Decor" : "إضاءة وديكور";
            title = isEn ? `Royal Lighting & Chandelier - Design ${i - 40}` : `إنارة وثريات ملكية - تصميم ${i - 40}`;
        } else if (i > 55) {
            category = "cooling";
            categoryLabel = isEn ? "Cooling & Power" : "تبريد وخدمات";
            title = isEn ? `AC & Power Generator - Design ${i - 55}` : `تجهيز تكييف ومولدات طاقة - تصميم ${i - 55}`;
        }
        
        galleryImages.push({
            src: `images/img-${i}.webp`,
            category: category,
            categoryLabel: categoryLabel,
            title: title
        });
    }

    const galleryGrid = document.getElementById("main-gallery-grid");
    const btnLoadMore = document.getElementById("btn-load-more");

    
    let activeCategory = "all";
    let loadedCount = 0;
    const itemsPerPage = 12;

    // Filter images based on selected category
    function getFilteredImages() {
        if (activeCategory === "all") {
            return galleryImages;
        }
        return galleryImages.filter(item => item.category === activeCategory);
    }

    // Render next chunk of images
    function renderGallery(append = false) {
        if (!append) {
            galleryGrid.innerHTML = "";
            loadedCount = 0;
        }

        const filtered = getFilteredImages();
        const nextBatch = filtered.slice(loadedCount, loadedCount + itemsPerPage);
        
        nextBatch.forEach(item => {
            const card = document.createElement("div");
            card.className = "gallery-item";
            card.setAttribute("data-category", item.category);
            
            card.innerHTML = `
                <img src="${item.src}" alt="${item.title}" class="gallery-img" loading="lazy">
                <div class="gallery-overlay">
                    <span class="gallery-cat">${item.categoryLabel}</span>
                    <h4>${item.title}</h4>
                    <button class="view-large-btn" aria-label="عرض الصورة بحجم كامل"><i class="fa-solid fa-expand"></i></button>
                </div>
            `;
            
            // Attach lightbox handler to this card
            card.addEventListener("click", () => openLightbox(item.src, item.title));
            
            galleryGrid.appendChild(card);
        });

        loadedCount += nextBatch.length;

        // Show/hide 'Load More' button based on availability
        if (loadedCount < filtered.length) {
            btnLoadMore.style.display = "inline-flex";
        } else {
            btnLoadMore.style.display = "none";
        }
    }



    // Load More click handler
    btnLoadMore.addEventListener("click", () => {
        renderGallery(true);
    });

    // Initial render
    renderGallery(false);

    /* 4. LIGHTBOX MODAL
       ========================================================================== */
    const lightboxModal = document.getElementById("gallery-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxCloseBtn = document.getElementById("lightbox-close-btn");

    function openLightbox(src, title) {
        lightboxImg.src = src;
        lightboxImg.alt = title;
        lightboxCaption.textContent = title;
        
        lightboxModal.classList.add("active");
        lightboxModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // disable background scroll
    }

    function closeLightbox() {
        lightboxModal.classList.remove("active");
        lightboxModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // enable background scroll
    }

    lightboxCloseBtn.addEventListener("click", closeLightbox);
    
    lightboxModal.addEventListener("click", (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
            closeLightbox();
        }
    });

    /* 5. TESTIMONIALS SLIDER
       ========================================================================== */
    const carousel = document.getElementById("testimonials-carousel");
    const dots = document.querySelectorAll(".dot");
    let currentSlide = 0;

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        const multiplier = isEn ? -1 : 1;
        carousel.style.transform = `translateX(${currentSlide * 100 * multiplier}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentSlide);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.getAttribute("data-index"), 10);
            goToSlide(index);
        });
    });

    setInterval(() => {
        let nextSlide = (currentSlide + 1) % dots.length;
        goToSlide(nextSlide);
    }, 6000);

    /* 6. THEME SWITCHER LOGIC (LIGHT / DARK MODE)
       ========================================================================== */
    const themeToggle = document.getElementById("theme-toggle");
    
    // Initial icon state adjustment based on loaded theme
    if (document.body.classList.contains("light-theme")) {
        if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            if (document.body.classList.contains("light-theme")) {
                document.body.classList.remove("light-theme");
                localStorage.setItem("theme", "dark");
                themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                document.body.classList.add("light-theme");
                localStorage.setItem("theme", "light");
                themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        });
    }

    /* 7. GOOGLE ADS CONVERSION TRACKING FOR CONTACT BUTTONS
       ========================================================================== */
    function trackConversion(sendToId) {
        if (typeof gtag === 'function') {
            gtag('event', 'conversion', {
                'send_to': sendToId
            });
        }
    }

    // Track clicks on Phone links (عميل مهتم للمكالمات الهاتفية)
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackConversion('AW-18248508524/Qb2CCPLY3MscEOzIyP1D');
        });
    });

    // Track clicks on WhatsApp links (جهة اتصال)
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            trackConversion('AW-18248508524/J-rKCMee3MscEOzIyP1D');
        });
    });

});

