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

    mobileToggle.addEventListener("click", () => {
        siteNav.classList.toggle("active");
        mobileToggle.classList.toggle("open");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("active");
            mobileToggle.classList.remove("open");
        });
    });

    document.addEventListener("click", (e) => {
        if (!siteNav.contains(e.target) && !mobileToggle.contains(e.target)) {
            siteNav.classList.remove("active");
            mobileToggle.classList.remove("open");
        }
    });

    /* 3. DYNAMIC 70-IMAGE GALLERY ENGINE (WITH LAZY-LOAD & FILTER & LOAD-MORE)
       ========================================================================== */
    // Generate Metadata for the 70 user images in images/img-1.jpg to images/img-70.jpg
    const galleryImages = [];
    for (let i = 1; i <= 70; i++) {
        let category = "tents";
        let categoryLabel = "خيام ملكية";
        let title = `خيمة ملكية VIP - تصميم ${i}`;
        
        if (i > 20 && i <= 40) {
            category = "furniture";
            categoryLabel = "أثاث ومجالس";
            title = `مجالس وأثاث فاخر - تصميم ${i - 20}`;
        } else if (i > 40 && i <= 55) {
            category = "lighting";
            categoryLabel = "إضاءة وديكور";
            title = `إنارة وثريات ملكية - تصميم ${i - 40}`;
        } else if (i > 55) {
            category = "cooling";
            categoryLabel = "تبريد وخدمات";
            title = `تجهيز تكييف ومولدات طاقة - تصميم ${i - 55}`;
        }
        
        galleryImages.push({
            src: `images/img-${i}.jpg`,
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
        carousel.style.transform = `translateX(${currentSlide * 100}%)`;
        
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

    /* 8. CONTACT FORM SUBMISSION TO WHATSAPP
       ========================================================================== */
    const contactForm = document.getElementById("booking-contact-form");
    const inputName = document.getElementById("form-name");
    const inputPhone = document.getElementById("form-phone");
    const errorName = document.getElementById("error-name");
    const errorPhone = document.getElementById("error-phone");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        let isValid = true;

        if (inputName.value.trim().length < 3) {
            errorName.classList.add("visible");
            isValid = false;
        } else {
            errorName.classList.remove("visible");
        }

        const qatariPhoneRegex = /^[34567][0-9]{7}$/;
        const cleanPhone = inputPhone.value.trim().replace(/\s+/g, '');
        if (!qatariPhoneRegex.test(cleanPhone)) {
            errorPhone.classList.add("visible");
            isValid = false;
        } else {
            errorPhone.classList.remove("visible");
        }

        if (isValid) {
            const name = inputName.value.trim();
            const date = document.getElementById("form-date").value || "غير محدد";
            const location = document.getElementById("form-location").value.trim() || "غير محدد";
            const extraDetails = document.getElementById("form-details").value.trim() || "لا يوجد تفاصيل إضافية";
            const phoneNumber = "97455262988";

            const contactMessage = `السلام عليكم ورحمة الله وبركاته،

لقد قمت بإرسال طلب استفسار جديد عبر موقع المعتمد:
👤 الاسم الكريم: ${name}
📞 رقم الجوال القطري: ${cleanPhone}
📅 تاريخ المناسبة المطلوب: ${date}
📍 منطقة التركيب: ${location}
📝 تفاصيل إضافية: ${extraDetails}

يرجى الاتصال بي لتوفير الأسعار المعتمدة والتجهيزات المتاحة.`;

            const encodedContactMessage = encodeURIComponent(contactMessage);
            const whatsappContactUrl = `https://wa.me/${phoneNumber}?text=${encodedContactMessage}`;

            window.open(whatsappContactUrl, "_blank");
        }
    });
});
