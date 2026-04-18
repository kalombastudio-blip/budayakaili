/**
 * =========================================
 * HARMONI BUDAYA KAILI 2026
 * Main JavaScript
 * =========================================
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    lucide.createIcons();

    // ============================
    // 1. HERO SLIDER
    // ============================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    let currentSlide = 0;
    let sliderInterval;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlider() {
        sliderInterval = setInterval(nextSlide, 5000);
    }

    function resetSlider() {
        clearInterval(sliderInterval);
        startSlider();
    }

    // Initialize first slide
    goToSlide(0);
    startSlider();

    // Slider controls
    nextBtn.addEventListener('click', () => { nextSlide(); resetSlider(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetSlider(); });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goToSlide(i); resetSlider(); });
    });

    // Touch/Swipe support for hero
    let touchStartX = 0;
    let touchEndX = 0;
    const heroSlider = document.getElementById('hero-slider');

    heroSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetSlider();
        }
    }, { passive: true });


    // ============================
    // 2. NAVBAR SCROLL EFFECT
    // ============================
    const navbar = document.getElementById('navbar');
    
    function handleNavbarScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();


    // ============================
    // 3. MOBILE MENU
    // ============================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let mobileMenuOpen = false;

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOpen = !mobileMenuOpen;
        mobileMenu.classList.toggle('hidden', !mobileMenuOpen);
        
        const icon = mobileMenuBtn.querySelector('[data-lucide]');
        icon.setAttribute('data-lucide', mobileMenuOpen ? 'x' : 'menu');
        lucide.createIcons();
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOpen = false;
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('[data-lucide]');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });


    // ============================
    // 4. SCROLL ANIMATIONS
    // ============================
    const scrollElements = document.querySelectorAll('.scroll-animate');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay based on animation-delay style
                const delay = entry.target.style.animationDelay || '0s';
                const delayMs = parseFloat(delay) * 1000;

                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delayMs);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollElements.forEach(el => observer.observe(el));


    // ============================
    // 5. COUNTER ANIMATION
    // ============================
    const counters = document.querySelectorAll('.counter');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const start = 0;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function (ease-out-cubic)
                    const easedProgress = 1 - Math.pow(1 - progress, 3);
                    
                    const current = Math.floor(start + (target - start) * easedProgress);
                    counter.textContent = current.toLocaleString('id-ID') + '+';

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));


    // ============================
    // 6. FORM TAB SWITCHING
    // ============================
    const tabs = document.querySelectorAll('.form-tab');
    const panels = document.querySelectorAll('.form-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            // Update tabs
            tabs.forEach(t => t.classList.remove('active-tab'));
            tab.classList.add('active-tab');

            // Update panels
            panels.forEach(p => p.classList.add('hidden'));
            document.getElementById(`form-${target}`).classList.remove('hidden');
        });
    });


    // ============================
    // 7. FORM SUBMISSIONS
    // ============================

    // Pengunjung & Penampil forms — submit to email via PHP
    const formPengunjung = document.getElementById('formPengunjung');
    const formPenampil = document.getElementById('formPenampil');

    [formPengunjung, formPenampil].forEach(form => {
        if (!form) return;
        form.addEventListener('submit', function(e) {
            const btn = form.querySelector('button[type="submit"]');
            btn.classList.add('btn-loading');
            btn.innerHTML = '<span style="visibility: hidden">Mengirim...</span>';
            // Let the form submit naturally to send_email.php
        });
    });

    // Kemitraan form — redirect to WhatsApp
    const formKemitraan = document.getElementById('formKemitraan');
    if (formKemitraan) {
        formKemitraan.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nama = formKemitraan.querySelector('[name="nama_mitra"]').value;
            const wa = formKemitraan.querySelector('[name="wa_mitra"]').value;
            const jenis = formKemitraan.querySelector('[name="jenis_mitra"]').value;
            const pesan = formKemitraan.querySelector('[name="pesan_mitra"]').value;

            if (!nama || !wa || !jenis) {
                alert('Mohon lengkapi semua field yang wajib diisi.');
                return;
            }

            const jenisLabel = {
                'sponsor_platinum': 'Sponsor Platinum',
                'sponsor_gold': 'Sponsor Gold',
                'donatur': 'Donatur',
                'media_partner': 'Media Partner',
                'lainnya': 'Lainnya'
            };

            let message = `Halo, saya ingin mengajukan kemitraan untuk event *Harmoni Budaya Kaili 2026* 🌿\n\n`;
            message += `*Nama/Perusahaan:* ${nama}\n`;
            message += `*No. WhatsApp:* ${wa}\n`;
            message += `*Jenis Kemitraan:* ${jenisLabel[jenis] || jenis}\n`;
            if (pesan) message += `*Pesan:* ${pesan}\n`;
            message += `\nTerima kasih! 🙏`;

            // Replace with actual WhatsApp number
            const phone = '6282156929275';
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });
    }


    // ============================
    // 8. BACK TO TOP BUTTON
    // ============================
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.remove('opacity-0', 'invisible', 'translate-y-4');
            backToTop.classList.add('opacity-100', 'visible', 'translate-y-0');
        } else {
            backToTop.classList.add('opacity-0', 'invisible', 'translate-y-4');
            backToTop.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ============================
    // 9. LEAF PARTICLES
    // ============================
    const particleContainer = document.getElementById('leaf-particles');
    const leafColors = ['#52B788', '#2D6A4F', '#86efac', '#22c55e', '#15803d'];

    function createLeaf() {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf-particle');
        
        const size = Math.random() * 16 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 12;
        const delay = Math.random() * 10;
        const color = leafColors[Math.floor(Math.random() * leafColors.length)];

        leaf.style.width = `${size}px`;
        leaf.style.height = `${size}px`;
        leaf.style.left = `${left}%`;
        leaf.style.animationDuration = `${duration}s`;
        leaf.style.animationDelay = `${delay}s`;
        
        // SVG leaf shape
        leaf.innerHTML = `<svg viewBox="0 0 24 24" fill="${color}" opacity="0.5">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
        </svg>`;

        particleContainer.appendChild(leaf);

        // Remove leaf after animation
        setTimeout(() => {
            if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
        }, (duration + delay) * 1000);
    }

    // Create initial leaves
    for (let i = 0; i < 8; i++) {
        setTimeout(() => createLeaf(), i * 2000);
    }

    // Continue creating leaves
    setInterval(createLeaf, 4000);


    // ============================
    // 10. SMOOTH SCROLL FOR NAV LINKS
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // ============================
    // 11. ACTIVE NAV LINK HIGHLIGHT
    // ============================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('!text-moss', '!bg-leaf/10');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('!text-moss', '!bg-leaf/10');
            }
        });
    });
});


// ============================
// GLOBAL FUNCTIONS
// ============================

// Open WhatsApp for sponsorship
function openWhatsApp(type) {
    const labels = {
        'sponsor_platinum': 'Sponsor Platinum',
        'sponsor_gold': 'Sponsor Gold',
        'donatur': 'Donatur'
    };
    
    let message = `Halo, saya tertarik menjadi *${labels[type] || type}* untuk event *Harmoni Budaya Kaili 2026* 🌿\n\n`;
    message += `Mohon informasi lebih lanjut mengenai paket kemitraan.\n\nTerima kasih! 🙏`;

    // Replace with actual WhatsApp number
    const phone = '6282156929275';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Show success modal
function showModal(message) {
    const modal = document.getElementById('success-modal');
    const msgEl = document.getElementById('modal-message');
    if (msgEl) msgEl.textContent = message;
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('show');
}

// ============================
// SEARCH OVERLAY
// ============================
function openSearch() {
    const overlay = document.getElementById('search-overlay');
    overlay.classList.add('show');
    setTimeout(() => {
        document.getElementById('search-input').focus();
    }, 300);
}

function closeSearch() {
    const overlay = document.getElementById('search-overlay');
    overlay.classList.remove('show');
}

// ============================
// LANGUAGE SWITCHER (ID / EN)
// ============================
const translations = {
    id: {
        // Hero Slide 1
        hero1_badge: '5 Juni 2026 \u2014 Hari Lingkungan Hidup Sedunia',
        hero1_title: 'Harmoni<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">Budaya Kaili</span>',
        hero1_desc: 'Merayakan keindahan budaya Kaili yang hidup berdampingan selaras dengan alam, dalam semangat melestarikan lingkungan hidup.',
        hero1_cta1: 'Daftar Sekarang',
        hero1_cta2: 'Pelajari Lebih Lanjut',

        // Hero Slide 2
        hero2_badge: 'Lahir dari Alam, Tumbuh Bersama Budaya',
        hero2_title: 'Menjaga Alam,<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-400">Merawat Warisan</span>',
        hero2_desc: 'Bersama kita lestarikan kekayaan budaya Kaili dan keindahan alam Sulawesi Tengah untuk generasi mendatang.',

        // Hero Slide 3
        hero3_badge: 'Seni & Kerajinan Tradisional',
        hero3_title: 'Warisan<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">Tak Ternilai</span>',
        hero3_desc: 'Kulit kayu, tenun, dan ragam kerajinan tangan Kaili \u2014 karya seni yang lahir dari kearifan lokal dan material alam.',

        // Hero Slide 4
        hero4_badge: 'Aksi Nyata untuk Bumi',
        hero4_title: 'Bersama<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-400">Hijau Kembali</span>',
        hero4_desc: 'Gerakan penanaman pohon dan pelestarian lingkungan \u2014 menyatukan komunitas untuk masa depan yang lebih hijau.',

        // Hero Slide 5
        hero5_badge: 'Panggung Seni & Musik',
        hero5_title: 'Dentingan<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">Nada Tradisi</span>',
        hero5_desc: 'Lalove, gimba, dan alunan musik tradisional Kaili bergema di panggung, menghidupkan semangat warisan para leluhur.',

        // Tentang Section
        tentang_badge: 'Tentang Event',
        tentang_title: 'Harmoni Budaya Kaili <span class="text-leaf">2026</span>',
        tentang_p1: 'Masyarakat Kaili merupakan bagian dari sekian banyak masyarakat yang terdapat di Nusantara yang memiliki adat istiadat tersendiri. Dalam penerapan kehidupan masyarakat Kaili banyak kebiasaan atau adat istiadat yang masih berlaku. Masyarakat lokal yang memiliki budaya dan nilai-nilai kearifan adalah aset yang harus dipertahankan. Masyarakat adat memiliki keaslian kehidupan sebagai orang yang berasal dari suatu kultur atau kelompok menghormati asal usul mereka. Masyarakat adat memiliki karakter yang membatasi diri dan mengidentikan diri mereka sebagai sebuah kelompok kecil yang memiliki otoritas dalam menempati sebuah wilayah tertentu.',
        tentang_p2: 'Budaya merupakan cara hidup yang berkembang dan dimiliki bersama oleh sebuah kelompok orang yang diwariskan dari generasi ke generasi. Budaya terbentuk dari banyak unsur termasuk sistim hidup, adat istiadat, bahasa, perkakas, pakaian, bangunan, dan karya seni. Bahasa alat komunikasi merupakan salah satu warisan budaya bagian yang tak terpisahkan dari manusia yang diwariskan secara genetis.',
        tentang_p3: 'Demikian halnya dengan etnik Kaili adalah salah satu bagian dari suku di Nusantara yang mendiami sebagian besar wilayah Propinsi Sulawesi Tengah, tepatnya berada di wilayah Kota Palu. Etnik Kaili memiliki beberapa rumpun sub etnik yaitu <em class="font-semibold text-moss">Ledo, Tara, Rai, Ado, Ija, Unde, Inde, Taa, Daa, Doi, Rai, Lauje, Tialo, Uma, Moma, Tado, Edo, Baree</em>. Setiap sub etnis memiliki khas dalam seni budaya tradisinya. Ditandai dengan banyaknya kesenian Rakyat dari masing-masing subetnis dan upacara adat tradisinya yang berbeda.',
        tentang_tanggal: 'Tanggal',
        tentang_tanggal_val: '5 Juni 2026',
        tentang_lokasi: 'Lokasi',
        tentang_waktu: 'Waktu',
        tentang_tiket: 'Tiket',
        tentang_tiket_val: 'Gratis / Free',
        tentang_peserta: '500+ Peserta Tahun Lalu',
        float_pertunjukan: 'Pertunjukan<br>Seni',
        float_workshop: 'Workshop<br>Budaya',

        // Highlight Cards
        highlight1_title: 'Pertunjukan Seni',
        highlight1_desc: 'Tarian Raego, musik Lalove, dan seni pertunjukan Kaili dalam panggung spektakuler.',
        highlight2_title: 'Aksi Lingkungan',
        highlight2_desc: 'Penanaman pohon, workshop daur ulang, dan edukasi lingkungan hidup untuk semua usia.',
        highlight3_title: 'Pameran & Kuliner',
        highlight3_desc: 'Pameran kerajinan tradisional dan kuliner khas Sulawesi Tengah yang menggugah selera.',

        // Yayasan Section
        yayasan_badge: 'Penyelenggara',
        yayasan_title: 'Yayasan <span class="text-leaf">Bulava Nusantara Permai</span>',
        yayasan_subtitle: 'Lahir dari Cinta untuk Budaya & Lingkungan',
        yayasan_p1: 'Yayasan Bulava Nusantara Permai telah melaksanakan kegiatan pelestarian dengan mengkoleksi Busana tradisional, benda-benda budaya suku Kaili dan menggali nilai-nilai pendidikan Lokal Masyarakat Kaili, telah beberapa kali mengikuti kegiatan budaya di daerah, dan Nasional, serta telah beberapa kali diminta pemerintah maupun Swasta menjadi juri lomba kebudayaan di beberapa kabupaten di Sulawesi Tengah. Maka sangat tepat bila Yayasan Bulava Nusantara mendapat kesempatan untuk melestarikan budaya, dalam Bidang Pendidikan.',
        yayasan_tahun: 'Tahun Berdiri',
        yayasan_program: 'Program Terlaksana',
        yayasan_penerima: 'Penerima Manfaat',
        val_budaya: 'Pelestarian Budaya',
        val_lingkungan: 'Cinta Lingkungan',
        val_masyarakat: 'Pemberdayaan Masyarakat',

        // Pendaftaran Section
        daftar_badge: 'Formulir Pendaftaran',
        daftar_title: 'Bergabung <span class="text-leaf">Bersama Kami</span>',
        daftar_desc: 'Daftarkan diri Anda sebagai pengunjung atau penampil dalam event Harmoni Budaya Kaili 2026',
        tab_pengunjung: 'Pengunjung',
        tab_penampil: 'Penampil',
        form_pengunjung_title: 'Pendaftaran Pengunjung',
        form_pengunjung_sub: 'Gratis \u2014 Terbatas untuk 500 peserta',
        form_penampil_title: 'Pendaftaran Penampil',
        form_penampil_sub: 'Tampilkan bakat Anda di panggung Harmoni Budaya Kaili',
        label_nama: 'Nama Lengkap <span class="text-red-500">*</span>',
        btn_kirim_pengunjung: 'Kirim Pendaftaran',
        btn_kirim_penampil: 'Kirim Pendaftaran Penampil',

        // Kemitraan Section
        mitra_badge: 'Kemitraan',
        mitra_title: 'Sponsorship & <span class="text-transparent bg-clip-text bg-gradient-to-r from-leaf to-emerald-400">Donasi</span>',
        mitra_desc: 'Jadilah bagian dari pergerakan pelestarian budaya dan lingkungan. Dukung event ini sebagai sponsor atau donatur.',

        // Social Media Section
        sosmed_badge: 'Ikuti Kami',
        sosmed_title: 'Tetap <span class="text-leaf">Terhubung</span>',
        sosmed_desc: 'Ikuti media sosial kami untuk update terbaru seputar event Harmoni Budaya Kaili 2026',
        hashtag_label: 'Gunakan hashtag kami di sosial media',

        // Search
        search_placeholder: 'Cari informasi event...',
        search_quick: 'Pencarian Cepat',

        // Footer
        footer_desc: 'Merayakan keindahan budaya Kaili yang hidup berdampingan selaras dengan alam, dalam semangat melestarikan lingkungan hidup.',
        footer_nav: 'Navigasi',
        footer_kontak: 'Kontak',
        footer_copy: '&copy; 2026 Harmoni Budaya Kaili. All rights reserved.',
        footer_made: 'Dibuat oleh <a href="https://kalombastudio.indevs.in/" target="_blank" rel="noopener" class="text-gray-400 hover:text-leaf transition-colors">Kalomba Studio</a>',

        // Modal
        modal_title: 'Pendaftaran Berhasil!',
    },
    en: {
        // Hero Slide 1
        hero1_badge: 'June 5, 2026 \u2014 World Environment Day',
        hero1_title: 'Harmony of<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">Kaili Culture</span>',
        hero1_desc: 'Celebrating the beauty of Kaili culture living in harmony with nature, in the spirit of environmental preservation.',
        hero1_cta1: 'Register Now',
        hero1_cta2: 'Learn More',

        // Hero Slide 2
        hero2_badge: 'Born from Nature, Growing with Culture',
        hero2_title: 'Protecting Nature,<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-400">Preserving Heritage</span>',
        hero2_desc: 'Together we preserve the cultural richness of Kaili and the natural beauty of Central Sulawesi for future generations.',

        // Hero Slide 3
        hero3_badge: 'Traditional Arts & Crafts',
        hero3_title: 'Priceless<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">Heritage</span>',
        hero3_desc: 'Bark cloth, woven textiles, and various Kaili handicrafts \u2014 artworks born from local wisdom and natural materials.',

        // Hero Slide 4
        hero4_badge: 'Real Action for the Earth',
        hero4_title: 'Together<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-400">Going Green</span>',
        hero4_desc: 'Tree planting movement and environmental preservation \u2014 uniting communities for a greener future.',

        // Hero Slide 5
        hero5_badge: 'Art & Music Stage',
        hero5_title: 'The Sound of<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">Tradition</span>',
        hero5_desc: 'Lalove, gimba, and the melodies of traditional Kaili music resonate on stage, reviving the spirit of ancestral heritage.',

        // Tentang Section
        tentang_badge: 'About the Event',
        tentang_title: 'Harmoni Budaya Kaili <span class="text-leaf">2026</span>',
        tentang_p1: 'The Kaili community is one of the many societies found across the Indonesian archipelago, possessing their own unique customs and traditions. In the daily life of the Kaili people, many customs and traditions are still practiced. The local community, with its culture and values of wisdom, is an asset that must be preserved. Indigenous peoples maintain the authenticity of their way of life as people originating from a particular culture or group, honoring their origins. They possess a character that defines and identifies them as a small group with authority over a specific territory.',
        tentang_p2: 'Culture is a way of life that develops and is shared by a group of people, passed down from generation to generation. Culture is formed from many elements, including living systems, customs, language, tools, clothing, architecture, and works of art. Language, as a communication tool, is one of the cultural heritage inseparable from humanity, passed down genetically.',
        tentang_p3: 'Likewise, the Kaili ethnic group is one of the many tribes in the archipelago that inhabits most of the Central Sulawesi Province, specifically in the Palu City area. The Kaili have several sub-ethnic branches, namely: <em class="font-semibold text-moss">Ledo, Tara, Rai, Ado, Ija, Unde, Inde, Taa, Daa, Doi, Rai, Lauje, Tialo, Uma, Moma, Tado, Edo, Baree</em>. Each sub-ethnic group has its own distinctive characteristics in traditional cultural arts, marked by the abundance of folk arts and different traditional ceremonial rituals from each sub-ethnic group.',
        tentang_tanggal: 'Date',
        tentang_tanggal_val: 'June 5, 2026',
        tentang_lokasi: 'Location',
        tentang_waktu: 'Time',
        tentang_tiket: 'Ticket',
        tentang_tiket_val: 'Free Admission',
        tentang_peserta: '500+ Attendees Last Year',
        float_pertunjukan: 'Art<br>Performances',
        float_workshop: 'Cultural<br>Workshops',

        // Highlight Cards
        highlight1_title: 'Art Performances',
        highlight1_desc: 'Raego dance, Lalove music, and Kaili performing arts on a spectacular stage.',
        highlight2_title: 'Environmental Action',
        highlight2_desc: 'Tree planting, recycling workshops, and environmental education for all ages.',
        highlight3_title: 'Exhibition & Culinary',
        highlight3_desc: 'Traditional craft exhibitions and authentic Central Sulawesi cuisine.',

        // Yayasan Section
        yayasan_badge: 'Organizer',
        yayasan_title: '<span class="text-leaf">Bulava Nusantara Permai</span> Foundation',
        yayasan_subtitle: 'Born from Love for Culture & Environment',
        yayasan_p1: 'Bulava Nusantara Permai Foundation has carried out preservation activities by collecting traditional costumes, cultural artifacts of the Kaili tribe, and exploring the local educational values of the Kaili community. The foundation has participated in cultural events at regional and national levels, and has been invited by the government and private sector to serve as judges in cultural competitions across several regencies in Central Sulawesi. Therefore, it is very fitting that Yayasan Bulava Nusantara has the opportunity to preserve culture, in the field of Education.',
        yayasan_tahun: 'Years Established',
        yayasan_program: 'Programs Completed',
        yayasan_penerima: 'Beneficiaries',
        val_budaya: 'Cultural Preservation',
        val_lingkungan: 'Environmental Love',
        val_masyarakat: 'Community Empowerment',

        // Pendaftaran Section
        daftar_badge: 'Registration Form',
        daftar_title: 'Join <span class="text-leaf">Us Today</span>',
        daftar_desc: 'Register yourself as a visitor or performer at the Harmoni Budaya Kaili 2026 event',
        tab_pengunjung: 'Visitor',
        tab_penampil: 'Performer',
        form_pengunjung_title: 'Visitor Registration',
        form_pengunjung_sub: 'Free \u2014 Limited to 500 attendees',
        form_penampil_title: 'Performer Registration',
        form_penampil_sub: 'Showcase your talent on the Harmoni Budaya Kaili stage',
        label_nama: 'Full Name <span class="text-red-500">*</span>',
        btn_kirim_pengunjung: 'Submit Registration',
        btn_kirim_penampil: 'Submit Performer Registration',

        // Kemitraan Section
        mitra_badge: 'Partnership',
        mitra_title: 'Sponsorship & <span class="text-transparent bg-clip-text bg-gradient-to-r from-leaf to-emerald-400">Donation</span>',
        mitra_desc: 'Be part of the movement to preserve culture and the environment. Support this event as a sponsor or donor.',

        // Social Media Section
        sosmed_badge: 'Follow Us',
        sosmed_title: 'Stay <span class="text-leaf">Connected</span>',
        sosmed_desc: 'Follow our social media for the latest updates about Harmoni Budaya Kaili 2026',
        hashtag_label: 'Use our hashtags on social media',

        // Search
        search_placeholder: 'Search event information...',
        search_quick: 'Quick Search',

        // Footer
        footer_desc: 'Celebrating the beauty of Kaili culture living in harmony with nature, in the spirit of environmental preservation.',
        footer_nav: 'Navigation',
        footer_kontak: 'Contact',
        footer_copy: '&copy; 2026 Harmoni Budaya Kaili. All rights reserved.',
        footer_made: 'Made by <a href="https://kalombastudio.indevs.in/" target="_blank" rel="noopener" class="text-gray-400 hover:text-leaf transition-colors">Kalomba Studio</a>',

        // Modal
        modal_title: 'Registration Successful!',
    }
};

let currentLang = localStorage.getItem('hbk_lang') || 'id';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('hbk_lang', lang);
    const t = translations[lang];

    // Update html lang attribute
    document.documentElement.setAttribute('lang', lang);

    // Update nav links text via data attributes
    document.querySelectorAll('[data-lang-id]').forEach(el => {
        el.textContent = lang === 'id' ? el.dataset.langId : el.dataset.langEn;
    });

    // Update translatable elements
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.dataset.t;
        if (t[key]) {
            if (el.dataset.tAttr === 'placeholder') {
                el.setAttribute('placeholder', t[key]);
            } else {
                el.innerHTML = t[key];
            }
        }
    });

    // Update active lang buttons (desktop)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active-lang', btn.dataset.lang === lang);
    });

    // Update active lang buttons (mobile)
    document.querySelectorAll('.lang-btn-mobile').forEach(btn => {
        btn.classList.toggle('active-lang-mobile', btn.dataset.lang === lang);
    });

    // Re-init icons that may have been replaced
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize language
document.addEventListener('DOMContentLoaded', function() {
    // Bind desktop lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // Bind mobile lang buttons
    document.querySelectorAll('.lang-btn-mobile').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // Search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', openSearch);
    }

    // Close search on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
            closeModal();
        }
    });

    // Set initial language (if saved)
    if (currentLang !== 'id') {
        setLanguage(currentLang);
    }
});
