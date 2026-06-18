// Image Gallery Component
class ImageGallery {
    constructor() {
        this.lightbox = null;
        this.currentImages = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.createLightbox();
        this.setupGalleryTriggers();
    }

    createLightbox() {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <button class="lightbox-prev" aria-label="Previous image">❮</button>
                <button class="lightbox-next" aria-label="Next image">❯</button>
                <div class="lightbox-content">
                    <img src="" alt="" class="lightbox-image">
                    <div class="lightbox-caption"></div>
                </div>
                <div class="lightbox-counter">
                    <span class="current-index">1</span> / <span class="total-images">1</span>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.lightbox = document.getElementById('lightbox');
        this.setupLightboxEvents();
    }

    setupLightboxEvents() {
        const closeBtn = this.lightbox.querySelector('.lightbox-close');
        const prevBtn = this.lightbox.querySelector('.lightbox-prev');
        const nextBtn = this.lightbox.querySelector('.lightbox-next');

        closeBtn.addEventListener('click', () => this.closeLightbox());
        prevBtn.addEventListener('click', () => this.showPrevImage());
        nextBtn.addEventListener('click', () => this.showNextImage());

        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.showPrevImage();
                    break;
                case 'ArrowRight':
                    this.showNextImage();
                    break;
            }
        });
    }

    setupGalleryTriggers() {
        // Add gallery thumbnails to car modal
        const modalInfo = document.querySelector('.modal-info');
        if (modalInfo) {
            const galleryHTML = `
                <div class="modal-gallery">
                    <div class="gallery-thumbnails" id="gallery-thumbnails"></div>
                </div>
            `;
            modalInfo.insertAdjacentHTML('beforeend', galleryHTML);
        }
    }

    openLightbox(images, startIndex = 0) {
        this.currentImages = images;
        this.currentIndex = startIndex;
        this.updateLightboxContent();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    showNextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.currentImages.length;
        this.updateLightboxContent();
    }

    showPrevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.currentImages.length) % this.currentImages.length;
        this.updateLightboxContent();
    }

    updateLightboxContent() {
        try {
            const img = this.lightbox.querySelector('.lightbox-image');
            const caption = this.lightbox.querySelector('.lightbox-caption');
            const currentIndex = this.lightbox.querySelector('.current-index');
            const totalImages = this.lightbox.querySelector('.total-images');

            // Show loading state
            img.style.opacity = '0.5';
            
            // Load new image
            img.src = this.currentImages[this.currentIndex];
            
            img.onload = () => {
                img.style.opacity = '1';
            };
            
            img.onerror = () => {
                console.error('Failed to load lightbox image');
                img.style.opacity = '1';
            };

            caption.textContent = `Image ${this.currentIndex + 1}`;
            currentIndex.textContent = this.currentIndex + 1;
            totalImages.textContent = this.currentImages.length;
        } catch (error) {
            Utils.error.handle(error, 'ImageGallery.updateLightboxContent');
        }
    }

    renderCarGallery(carId) {
        try {
            const car = DataManager.getCarById(carId);
            if (!car || !car.gallery) return;

            const thumbnailsContainer = document.getElementById('gallery-thumbnails');
            if (!thumbnailsContainer) return;

            thumbnailsContainer.innerHTML = car.gallery.map((img, index) => `
                <div class="gallery-thumbnail" data-index="${index}" data-img="${img}">
                    <img src="${img}" alt="${car.name} - View ${index + 1}" onerror="this.parentElement.style.display='none'">
                </div>
            `).join('');

            thumbnailsContainer.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    const index = parseInt(thumb.dataset.index);
                    this.openLightbox(car.gallery, index);
                });
            });
        } catch (error) {
            Utils.error.handle(error, 'ImageGallery.renderCarGallery');
        }
    }
}