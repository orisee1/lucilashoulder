/**
 * =========================================
 * MARIA LUCILA - SHOULDER PORTFOLIO JS
 * Sistema Inteligente de Adaptação Mobile/Desktop
 * Performance otimizada e experiência nativa
 * =========================================
 */

// Configuração global e detecção de dispositivo
const CONFIG = {
    // Configurações básicas
    scrollOffset: 80,
    animationDuration: 300,
    
    // Configurações de device detection
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
    
    // Configurações de performance
    throttleDelay: 16, // ~60fps
    debounceDelay: 250,
    
    // Intersection Observer
    observerOptions: {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '0px 0px -50px 0px'
    },
    
    // WhatsApp
    whatsappNumber: "5567992865982"
};

// Detecção inteligente de dispositivo
const DeviceDetector = {
    // Cache das detecções
    _cache: {},
    
    /**
     * Detecta se é dispositivo móvel
     */
    get isMobile() {
        if (this._cache.isMobile !== undefined) return this._cache.isMobile;
        
        this._cache.isMobile = window.innerWidth <= CONFIG.mobileBreakpoint || 
                              /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return this._cache.isMobile;
    },
    
    /**
     * Detecta se é tablet
     */
    get isTablet() {
        if (this._cache.isTablet !== undefined) return this._cache.isTablet;
        
        this._cache.isTablet = window.innerWidth > CONFIG.mobileBreakpoint && 
                              window.innerWidth <= CONFIG.tabletBreakpoint;
        return this._cache.isTablet;
    },
    
    /**
     * Detecta se é desktop
     */
    get isDesktop() {
        if (this._cache.isDesktop !== undefined) return this._cache.isDesktop;
        
        this._cache.isDesktop = window.innerWidth > CONFIG.tabletBreakpoint;
        return this._cache.isDesktop;
    },
    
    /**
     * Detecta se suporta touch
     */
    get hasTouch() {
        if (this._cache.hasTouch !== undefined) return this._cache.hasTouch;
        
        this._cache.hasTouch = 'ontouchstart' in window || 
                              navigator.maxTouchPoints > 0 || 
                              navigator.msMaxTouchPoints > 0;
        return this._cache.hasTouch;
    },
    
    /**
     * Detecta se prefere movimento reduzido
     */
    get prefersReducedMotion() {
        if (this._cache.prefersReducedMotion !== undefined) return this._cache.prefersReducedMotion;
        
        this._cache.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return this._cache.prefersReducedMotion;
    },
    
    /**
     * Detecta orientação (mobile)
     */
    get isLandscape() {
        return window.innerHeight < window.innerWidth;
    },
    
    /**
     * Limpa cache (útil para resize)
     */
    clearCache() {
        this._cache = {};
    },
    
    /**
     * Adiciona classes CSS baseadas no dispositivo
     */
    addDeviceClasses() {
        const body = document.body;
        const classes = [];
        
        // Remove classes existentes
        body.classList.remove('is-mobile', 'is-tablet', 'is-desktop', 'has-touch', 'no-touch', 'reduced-motion');
        
        // Adiciona classes baseadas na detecção
        if (this.isMobile) classes.push('is-mobile');
        if (this.isTablet) classes.push('is-tablet');
        if (this.isDesktop) classes.push('is-desktop');
        if (this.hasTouch) classes.push('has-touch');
        else classes.push('no-touch');
        if (this.prefersReducedMotion) classes.push('reduced-motion');
        
        body.classList.add(...classes);
        
        // Adiciona atributo de viewport
        body.setAttribute('data-viewport', this.isMobile ? 'mobile' : this.isTablet ? 'tablet' : 'desktop');
    }
};

// Utilitários de performance
const Utils = {
    /**
     * Throttle otimizado
     */
    throttle(func, limit = CONFIG.throttleDelay) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Debounce otimizado
     */
    debounce(func, delay = CONFIG.debounceDelay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    /**
     * RequestAnimationFrame helper
     */
    raf(callback) {
        return window.requestAnimationFrame ? 
               window.requestAnimationFrame(callback) : 
               setTimeout(callback, 16);
    },
    
    /**
     * Smooth scroll cross-browser - OTIMIZADO PARA MOBILE
     */
    smoothScrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        
        // Em mobile, usa scroll natural para melhor performance
        if (DeviceDetector.isMobile) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'auto' // Scroll natural em mobile
            });
        } else {
            // Desktop mantém smooth scroll
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                // Fallback para browsers antigos
                this.animateScrollTo(targetPosition);
            }
        }
    },
    
    /**
     * Animação de scroll para browsers antigos
     */
    animateScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 500;
        let start = null;
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) this.raf(animation);
        };
        
        this.raf(animation);
    },
    
    /**
     * Easing function
     */
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    },
    
    /**
     * Detecta se elemento está visível
     */
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

/**
 * =========================================
 * GERENCIADOR PRINCIPAL DO PORTFÓLIO
 * =========================================
 */
class PortfolioManager {
    constructor() {
        this.isInitialized = false;
        this.components = {};
        
        // Inicializa quando DOM estiver pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    /**
     * Inicialização principal
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            // Detecta dispositivo e adiciona classes
            DeviceDetector.addDeviceClasses();
            
            // Inicializa componentes
            this.initComponents();
            
            // Configura event listeners globais
            this.setupGlobalEvents();
            
            // Inicializa animações
            this.initAnimations();
            
            // Finaliza carregamento
            this.finishLoading();
            
            this.isInitialized = true;
            
            console.log('🚀 Portfólio Maria Lucila inicializado com sucesso!', {
                device: DeviceDetector.isMobile ? 'Mobile' : DeviceDetector.isTablet ? 'Tablet' : 'Desktop',
                touch: DeviceDetector.hasTouch ? 'Sim' : 'Não',
                viewport: `${window.innerWidth}x${window.innerHeight}`
            });
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
        }
    }
    
    /**
     * Inicializa todos os componentes
     */
    initComponents() {
        this.components = {
            navigation: new NavigationManager(),
            animations: new AnimationManager(),
            scroll: new ScrollManager(),
            forms: new FormManager(),
            interactions: new InteractionManager(),
            lazyLoad: new LazyLoadManager()
        };
    }
    
    /**
     * Configura eventos globais
     */
    setupGlobalEvents() {
        // Scroll otimizado
        window.addEventListener('scroll', 
            Utils.throttle(() => this.handleScroll(), CONFIG.throttleDelay), 
            { passive: true }
        );
        
        // Resize com debounce
        window.addEventListener('resize', 
            Utils.debounce(() => this.handleResize(), CONFIG.debounceDelay)
        );
        
        // Orientação (mobile)
        if (DeviceDetector.isMobile) {
            window.addEventListener('orientationchange', 
                Utils.debounce(() => this.handleOrientationChange(), 500)
            );
        }
        
        // Visibilidade da página
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Touch events para mobile - DESABILITADO para scroll natural
        // if (DeviceDetector.hasTouch) {
        //     this.setupTouchEvents();
        // }
    }
    
    /**
     * Configura eventos de touch para mobile - DESABILITADO
     */
    // setupTouchEvents() {
    //     let touchStartY = 0;
    //     let touchEndY = 0;
        
    //     document.addEventListener('touchstart', (e) => {
    //         touchStartY = e.changedTouches[0].screenY;
    //     }, { passive: true });
        
    //     document.addEventListener('touchend', (e) => {
    //         touchEndY = e.changedTouches[0].screenY;
    //         this.handleSwipe(touchStartY, touchEndY);
    //     }, { passive: true });
    // }
    
    /**
     * Gerencia gestos de swipe (mobile) - DESABILITADO
     */
    // handleSwipe(startY, endY) {
    //     const swipeThreshold = 100;
    //     const diff = startY - endY;
        
    //     if (Math.abs(diff) > swipeThreshold) {
    //         if (diff > 0) {
    //             // Swipe up - pode implementar navegação para próxima seção
    //             this.components.navigation.goToNextSection();
    //         } else {
    //             // Swipe down - pode implementar navegação para seção anterior
    //             this.components.navigation.goToPreviousSection();
    //         }
    //     }
    // }
    
    /**
     * Gerencia scroll global
     */
    handleScroll() {
        Object.values(this.components).forEach(component => {
            if (component.handleScroll) {
                component.handleScroll();
            }
        });
    }
    
    /**
     * Gerencia redimensionamento
     */
    handleResize() {
        // Limpa cache de detecção
        DeviceDetector.clearCache();
        
        // Atualiza classes do dispositivo
        DeviceDetector.addDeviceClasses();
        
        // Notifica componentes
        Object.values(this.components).forEach(component => {
            if (component.handleResize) {
                component.handleResize();
            }
        });
    }
    
    /**
     * Gerencia mudança de orientação (mobile)
     */
    handleOrientationChange() {
        setTimeout(() => {
            this.handleResize();
            
            // Força recálculo de altura em mobile
            if (DeviceDetector.isMobile) {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }
        }, 100);
    }
    
    /**
     * Gerencia visibilidade da página
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Página ficou invisível - pode pausar animações
            this.components.animations?.pause();
        } else {
            // Página ficou visível - pode retomar animações
            this.components.animations?.resume();
        }
    }
    
    /**
     * Inicializa sistema de animações
     */
    initAnimations() {
        // Só inicializa animações se não prefere movimento reduzido
        if (!DeviceDetector.prefersReducedMotion) {
            this.components.animations.initIntersectionObserver();
        }
    }
    
    /**
     * Finaliza carregamento
     */
    finishLoading() {
        // Remove classe de loading
        document.body.classList.remove('loading');
        
        // Adiciona classe de carregado
        document.body.classList.add('loaded');
        
        // Garante que todas as imagens fiquem visíveis
        this.components.lazyLoad?.ensureImagesVisible();
        
        // Dispara evento customizado
        window.dispatchEvent(new CustomEvent('portfolioLoaded', {
            detail: { manager: this }
        }));
    }
}

/**
 * =========================================
 * GERENCIADOR DE NAVEGAÇÃO INTELIGENTE
 * =========================================
 */
class NavigationManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.navLinksContainer = document.getElementById('navLinks');
        this.sections = document.querySelectorAll('section[id]');
        this.currentSection = 0;
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.updateActiveLink();
    }
    
    /**
     * Configura navegação principal
     */
    setupNavigation() {
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.scrollToSection(targetElement, index);
                    this.closeMobileMenu();
                }
            });
        });
    }
    
    /**
     * Configura menu mobile
     */
    setupMobileMenu() {
        if (!this.mobileToggle) return;
        
        // Toggle do menu
        this.mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });
        
        // Fecha menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMobileMenu();
            }
        });
        
        // Trata eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }
    
    /**
     * Scroll suave para seção
     */
    scrollToSection(targetElement, sectionIndex = null) {
        const headerHeight = this.header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        // Atualiza seção atual
        if (sectionIndex !== null) {
            this.currentSection = sectionIndex;
        }
        
        // Scroll otimizado por dispositivo
        if (DeviceDetector.isMobile) {
            // Mobile: scroll instantâneo e natural
            window.scrollTo({
                top: targetPosition,
                behavior: 'auto'
            });
        } else {
            // Desktop: scroll suave
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Atualiza URL
        const targetId = targetElement.getAttribute('id');
        if (targetId && history.pushState) {
            history.pushState(null, null, `#${targetId}`);
        }
    }
    
    /**
     * Navegação para próxima seção - DESABILITADO para scroll natural
     */
    // goToNextSection() {
    //     if (this.currentSection < this.sections.length - 1) {
    //         this.currentSection++;
    //         this.scrollToSection(this.sections[this.currentSection], this.currentSection);
    //     }
    // }
    
    /**
     * Navegação para seção anterior - DESABILITADO para scroll natural
     */
    // goToPreviousSection() {
    //     if (this.currentSection > 0) {
    //         this.currentSection--;
    //         this.scrollToSection(this.sections[this.currentSection], this.currentSection);
    //     }
    // }
    
    /**
     * Toggle do menu mobile
     */
    toggleMobileMenu() {
        const isOpen = this.mobileToggle.classList.contains('active');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    /**
     * Abre menu mobile
     */
    openMobileMenu() {
        this.mobileToggle.classList.add('active');
        this.navLinksContainer.classList.add('show');
        
        // Previne scroll do body
        document.body.style.overflow = 'hidden';
        
        // Adiciona atributo de acessibilidade
        this.mobileToggle.setAttribute('aria-expanded', 'true');
        this.navLinksContainer.setAttribute('aria-hidden', 'false');
    }
    
    /**
     * Fecha menu mobile
     */
    closeMobileMenu() {
        this.mobileToggle.classList.remove('active');
        this.navLinksContainer.classList.remove('show');
        
        // Restaura scroll do body
        document.body.style.overflow = '';
        
        // Atualiza atributos de acessibilidade
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        this.navLinksContainer.setAttribute('aria-hidden', 'true');
    }
    
    /**
     * Atualiza link ativo baseado na posição do scroll
     */
    updateActiveLink() {
        const scrollPosition = window.pageYOffset + CONFIG.scrollOffset;
        
        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove classe ativa de todos os links
                this.navLinks.forEach(link => link.classList.remove('active'));
                
                // Adiciona classe ativa ao link correspondente
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    this.currentSection = index;
                }
            }
        });
    }
    
    /**
     * Gerencia eventos de scroll
     */
    handleScroll() {
        this.updateActiveLink();
    }
    
    /**
     * Gerencia redimensionamento
     */
    handleResize() {
        // Fecha menu mobile em caso de mudança para desktop
        if (DeviceDetector.isDesktop) {
            this.closeMobileMenu();
        }
    }
}

/**
 * =========================================
 * GERENCIADOR DE ANIMAÇÕES INTELIGENTE
 * =========================================
 */
class AnimationManager {
    constructor() {
        this.observer = null;
        this.animatedElements = new Set();
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        // Só inicializa se animações são permitidas
        if (!DeviceDetector.prefersReducedMotion) {
            this.initIntersectionObserver();
            this.animateHero();
        }
    }
    
    /**
     * Inicializa Intersection Observer
     */
    initIntersectionObserver() {
        if (!window.IntersectionObserver) {
            // Fallback para browsers antigos
            this.fallbackAnimation();
            return;
        }
        
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            CONFIG.observerOptions
        );
        
        // Observa elementos animáveis
        const animatableElements = document.querySelectorAll(
            'section, .timeline-item, .galeria-item, .depoimento-card, .stat-item, .contato-item'
        );
        
        animatableElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            this.observer.observe(el);
        });
    }
    
    /**
     * Manipula intersecções do observer
     */
    handleIntersection(entries) {
        if (this.isPaused) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                this.animateElement(entry.target);
            }
        });
    }
    
    /**
     * Anima elemento específico
     */
    animateElement(element) {
        if (this.animatedElements.has(element)) return;
        
        this.animatedElements.add(element);
        element.classList.add('is-visible');
        
        // Animações específicas por tipo de elemento
        this.applySpecificAnimation(element);
    }
    
    /**
     * Aplica animações específicas
     */
    applySpecificAnimation(element) {
        const animationDelay = DeviceDetector.isMobile ? 100 : 150;
        
        // Timeline items
        if (element.classList.contains('timeline-item')) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }, animationDelay);
        }
        
        // Galeria items
        else if (element.classList.contains('galeria-item')) {
            const index = Array.from(element.parentNode.children).indexOf(element);
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * (DeviceDetector.isMobile ? 50 : 100));
        }
        
        // Depoimentos
        else if (element.classList.contains('depoimento-card')) {
            const index = Array.from(element.parentNode.children).indexOf(element);
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'scale(1) translateY(0)';
            }, index * (DeviceDetector.isMobile ? 100 : 150));
        }
        
        // Stats
        else if (element.classList.contains('stat-item')) {
            setTimeout(() => {
                this.animateCounter(element);
            }, animationDelay);
        }
        
        // Seção código
        else if (element.id === 'codigo') {
            this.animateCodeSection(element);
        }
    }
    
    /**
     * Anima contador de estatísticas
     */
    animateCounter(statItem) {
        const numberElement = statItem.querySelector('.stat-number');
        if (!numberElement) return;
        
        const finalValue = numberElement.textContent;
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        
        if (isNaN(numericValue)) return;
        
        const duration = DeviceDetector.isMobile ? 1000 : 1500;
        const steps = 60;
        const stepValue = numericValue / steps;
        let currentValue = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            currentValue = Math.min(Math.floor(stepValue * step), numericValue);
            
            let displayValue = currentValue.toString();
            if (finalValue.includes('+')) displayValue += '+';
            if (finalValue.includes('%')) displayValue += '%';
            
            numberElement.textContent = displayValue;
            
            if (step >= steps) {
                clearInterval(timer);
                numberElement.textContent = finalValue;
            }
        }, duration / steps);
    }
    
    /**
     * Anima seção do código
     */
    animateCodeSection(section) {
        const codeBox = section.querySelector('.codigo-box');
        const benefits = section.querySelectorAll('.beneficio');
        
        if (codeBox) {
            setTimeout(() => {
                codeBox.style.opacity = '1';
                codeBox.style.transform = 'scale(1)';
            }, 200);
        }
        
        benefits.forEach((benefit, index) => {
            setTimeout(() => {
                benefit.style.opacity = '1';
                benefit.style.transform = 'translateX(0)';
            }, 400 + (index * 100));
        });
    }
    
    /**
     * Anima seção hero
     */
    animateHero() {
        const heroText = document.querySelector('.hero-text');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroText) {
            setTimeout(() => {
                heroText.classList.add('fade-in-up');
            }, 100);
        }
        
        if (heroImage) {
            setTimeout(() => {
                heroImage.classList.add('fade-in-up');
            }, DeviceDetector.isMobile ? 200 : 300);
        }
    }
    
    /**
     * Fallback para browsers antigos
     */
    fallbackAnimation() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => {
            el.classList.add('is-visible');
        });
    }
    
    /**
     * Pausa animações
     */
    pause() {
        this.isPaused = true;
    }
    
    /**
     * Retoma animações
     */
    resume() {
        this.isPaused = false;
    }
}

/**
 * =========================================
 * GERENCIADOR DE SCROLL INTELIGENTE
 * =========================================
 */
class ScrollManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.backToTopBtn = document.getElementById('voltarTopo');
        this.lastScrollY = window.pageYOffset;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        this.setupBackToTop();
        
        // Configura altura de viewport para mobile
        if (DeviceDetector.isMobile) {
            this.setMobileViewportHeight();
        }
    }
    
    /**
     * Configura altura de viewport para mobile
     */
    setMobileViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    /**
     * Gerencia eventos de scroll
     */
    handleScroll() {
        if (!this.ticking) {
            Utils.raf(() => {
                this.updateHeader();
                this.updateBackToTop();
                this.lastScrollY = window.pageYOffset;
                this.ticking = false;
            });
            this.ticking = true;
        }
    }
    
    /**
     * Atualiza header baseado no scroll
     */
    updateHeader() {
        const currentScrollY = window.pageYOffset;
        
        // Adiciona classe scrolled
        if (currentScrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Efeito hide/show do header (só desktop)
        if (DeviceDetector.isDesktop) {
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                // Scrolling down - esconde header
                this.header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - mostra header
                this.header.style.transform = 'translateY(0)';
            }
        }
    }
    
    /**
     * Atualiza botão voltar ao topo
     */
    updateBackToTop() {
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition > 300) {
            this.backToTopBtn.classList.add('show');
        } else {
            this.backToTopBtn.classList.remove('show');
        }
    }
    
    /**
     * Configura botão voltar ao topo
     */
    setupBackToTop() {
        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', () => {
                // Scroll otimizado para cada dispositivo
                if (DeviceDetector.isMobile) {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    }
    
    /**
     * Gerencia redimensionamento
     */
    handleResize() {
        if (DeviceDetector.isMobile) {
            this.setMobileViewportHeight();
        }
        
        // Reset header transform em mudanças de device
        this.header.style.transform = 'translateY(0)';
    }
}

/**
 * =========================================
 * GERENCIADOR DE FORMULÁRIOS
 * =========================================
 */
class FormManager {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.contactForm = document.getElementById('contatoForm');
        
        this.init();
    }
    
    init() {
        if (this.contactForm) {
            this.setupContactForm();
        }
    }
    
    /**
     * Configura formulário de contato
     */
    setupContactForm() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit(e);
        });
        
        // Validação em tempo real
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    /**
     * Processa envio do formulário
     */
    async handleContactSubmit(e) {
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData);
        
        // Valida formulário
        if (!this.validateForm(data)) {
            this.showMessage('Por favor, corrija os campos destacados.', 'error');
            return;
        }
        
        // Mostra loading
        this.showLoading(true);
        
        try {
            // Envia para WhatsApp
            await this.sendToWhatsApp(data);
            
            // Sucesso
            this.showMessage('Redirecionando para WhatsApp...', 'success');
            this.contactForm.reset();
            
        } catch (error) {
            this.showMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
            console.error('Erro no formulário:', error);
        } finally {
            this.showLoading(false);
        }
    }
    
    /**
     * Envia dados para WhatsApp
     */
    async sendToWhatsApp(data) {
        return new Promise((resolve) => {
            const message = this.buildWhatsAppMessage(data);
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
            
            // Abre WhatsApp
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            // Resolve após delay para UX
            setTimeout(resolve, 1000);
        });
    }
    
    /**
     * Constrói mensagem do WhatsApp
     */
    buildWhatsAppMessage(data) {
        return `
🌟 *Nova mensagem do site!*

👤 *Nome:* ${data.nome}
📧 *E-mail:* ${data.email}
📱 *Telefone:* ${data.telefone || 'Não informado'}

💬 *Mensagem:*
${data.mensagem}

---
_Enviado via maria-lucila.com_
        `.trim();
    }
    
    /**
     * Valida formulário completo
     */
    validateForm(data) {
        let isValid = true;
        
        // Nome
        if (!data.nome || data.nome.trim().length < 2) {
            this.showFieldError('nome', 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }
        
        // Email
        if (!data.email || !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'E-mail inválido');
            isValid = false;
        }
        
        // Mensagem
        if (!data.mensagem || data.mensagem.trim().length < 10) {
            this.showFieldError('mensagem', 'Mensagem deve ter pelo menos 10 caracteres');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Valida campo individual
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        switch(field.name) {
            case 'nome':
                if (value.length < 2) {
                    this.showFieldError(field.name, 'Nome muito curto');
                    isValid = false;
                }
                break;
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showFieldError(field.name, 'E-mail inválido');
                    isValid = false;
                }
                break;
            case 'mensagem':
                if (value.length < 10) {
                    this.showFieldError(field.name, 'Mensagem muito curta');
                    isValid = false;
                }
                break;
        }
        
        if (isValid) {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    /**
     * Valida email
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    /**
     * Mostra erro em campo
     */
    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        field.classList.add('error');
        
        // Remove erro existente
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Adiciona novo erro
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
        
        // Foca no campo com erro (desktop)
        if (DeviceDetector.isDesktop) {
            field.focus();
        }
    }
    
    /**
     * Remove erro de campo
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    }
    
    /**
     * Mostra mensagem de feedback
     */
    showMessage(message, type) {
        // Remove mensagem existente
        const existingMessage = this.contactForm.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();
        
        // Cria nova mensagem
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        this.contactForm.appendChild(messageElement);
        
        // Remove após delay
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
    
    /**
     * Controla estado de loading
     */
    showLoading(isLoading) {
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
        }
    }
}

/**
 * =========================================
 * GERENCIADOR DE INTERAÇÕES
 * =========================================
 */
class InteractionManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCopyCode();
        this.setupHoverEffects();
        this.setupKeyboardNavigation();
    }
    
    /**
     * Configura funcionalidade de copiar código
     */
    setupCopyCode() {
        // Torna função global para onclick
        window.copiarCodigo = async () => {
            const codigoTexto = document.getElementById('codigoTexto');
            const copyBtn = document.querySelector('.copy-btn');
            
            if (!codigoTexto || !copyBtn) return;
            
            try {
                await navigator.clipboard.writeText(codigoTexto.textContent);
                this.showCopySuccess(copyBtn);
            } catch (err) {
                // Fallback para browsers antigos
                this.fallbackCopyText(codigoTexto.textContent, copyBtn);
            }
        };
    }
    
    /**
     * Mostra feedback de cópia bem-sucedida
     */
    showCopySuccess(copyBtn) {
        const originalContent = copyBtn.innerHTML;
        const originalStyle = copyBtn.style.cssText;
        
        // Atualiza botão
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = 'rgba(46, 204, 113, 0.3)';
        
        // Mostra toast
        this.showCopyToast();
        
        // Restaura após delay
        setTimeout(() => {
            copyBtn.innerHTML = originalContent;
            copyBtn.style.cssText = originalStyle;
        }, 2000);
        
        // Feedback tátil para mobile
        if (DeviceDetector.hasTouch && 'vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
    
    /**
     * Fallback para copiar texto
     */
    fallbackCopyText(text, copyBtn) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess(copyBtn);
        } catch (err) {
            console.error('Erro ao copiar:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    /**
     * Mostra toast de código copiado
     */
    showCopyToast() {
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.innerHTML = '<i class="fas fa-check"></i> Código copiado!';
        
        // Estilos inline para garantir funcionamento
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 9999;
            font-weight: 500;
            box-shadow: var(--shadow-lg);
            animation: fadeInOut 2s ease;
            pointer-events: none;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 2000);
    }
    
    /**
     * Configura efeitos de hover (só desktop)
     */
    setupHoverEffects() {
        if (!DeviceDetector.isDesktop) return;
        
        // Efeito parallax sutil no hero
        this.setupHeroParallax();
        
        // Efeito tilt nos cards
        this.setupCardTilt();
    }
    
    /**
     * Configura parallax do hero
     */
    setupHeroParallax() {
        const heroImage = document.querySelector('.hero-image img');
        if (!heroImage) return;
        
        let rafId;
        
        const handleMouseMove = Utils.throttle((e) => {
            if (rafId) cancelAnimationFrame(rafId);
            
            rafId = Utils.raf(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                
                heroImage.style.transform = `translate(${x}px, ${y}px)`;
            });
        }, 16);
        
        document.addEventListener('mousemove', handleMouseMove);
        
        // Cleanup
        document.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            heroImage.style.transform = 'translate(0, 0)';
        });
    }
    
    /**
     * Configura efeito tilt nos cards
     */
    setupCardTilt() {
        const cards = document.querySelectorAll('.depoimento-card, .galeria-item');
        
        cards.forEach(card => {
            let rafId;
            
            const handleMouseMove = (e) => {
                if (rafId) cancelAnimationFrame(rafId);
                
                rafId = Utils.raf(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
            };
            
            const handleMouseLeave = () => {
                if (rafId) cancelAnimationFrame(rafId);
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            };
            
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    }
    
    /**
     * Configura navegação por teclado - AJUSTADO para não interferir
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Só ativa navegação com teclas específicas e sem interferir no scroll
            if (!e.target.matches('input, textarea, select') && e.ctrlKey) {
                switch(e.key) {
                    case 'Home':
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        break;
                    case 'End':
                        e.preventDefault();
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        break;
                }
            }
        });
    }
}

/**
 * =========================================
 * GERENCIADOR DE LAZY LOADING
 * =========================================
 */
class LazyLoadManager {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.observer = null;
        
        this.init();
    }
    
    init() {
        // Primeiro, garante que todas as imagens com src válido fiquem visíveis
        this.ensureImagesVisible();
        
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback para browsers antigos
            this.loadAllImages();
        }
    }
    
    /**
     * Garante que todas as imagens com src válido fiquem visíveis
     */
    ensureImagesVisible() {
        document.querySelectorAll('img').forEach(img => {
            if (img.src && (img.src.includes('http') || img.src.includes('imagens/'))) {
                img.style.opacity = '1';
                img.classList.add('loaded');
            }
        });
    }
    
    /**
     * Configura Intersection Observer para lazy loading
     */
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.images.forEach(img => {
            // Só aplica lazy loading se tiver data-src
            if (img.dataset.src && !img.src.startsWith('http')) {
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+';
                this.observer.observe(img);
            } else {
                // Se já tem src válido, marca como carregada
                img.classList.add('loaded');
            }
        });
    }
    
    /**
     * Carrega imagem específica
     */
    loadImage(img) {
        // Se tem data-src, usa ela
        if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
        }
        
        // Garante que imagem fica visível
        img.style.opacity = '1';
        img.classList.add('loaded');
        
        // Adiciona classe quando carregada
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.style.opacity = '1';
        }, { once: true });
        
        // Tratamento de erro
        img.addEventListener('error', () => {
            img.classList.add('error');
            img.style.opacity = '0.6';
            console.warn('Erro ao carregar imagem:', img.src);
        }, { once: true });
    }
    
    /**
     * Fallback: carrega todas as imagens
     */
    loadAllImages() {
        this.images.forEach(img => {
            this.loadImage(img);
            // Garante visibilidade total
            img.style.opacity = '1';
            img.classList.add('loaded');
        });
    }
}

/**
 * =========================================
 * INICIALIZAÇÃO E BOOTSTRAP
 * =========================================
 */

// Adiciona estilos dinâmicos
const addDynamicStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        /* Animação do toast */
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            10%, 90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        /* Estados de loading */
        .loading { opacity: 0.7; pointer-events: none; }
        .loaded { opacity: 1; }
        
        /* Lazy loading */
        img { transition: opacity 0.3s ease; }
        img:not(.loaded) { opacity: 0.7; }
        img.loaded { opacity: 1; }
        img.error { opacity: 0.5; filter: grayscale(100%); }
        
        /* Otimizações de performance */
        .hero-image img, .galeria-item img { 
            transform: translateZ(0); 
            backface-visibility: hidden; 
        }
        
        /* Mobile optimizations */
        @media screen and (max-width: 768px) {
            .has-touch .galeria-item:hover,
            .has-touch .depoimento-card:hover {
                transform: none !important;
            }
            
            .has-touch .nav-link:hover {
                transform: none !important;
            }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    
    document.head.appendChild(style);
};

// Adiciona estilos dinâmicos
addDynamicStyles();

// Inicializa o portfólio
let portfolio;

// Função de inicialização
const initPortfolio = () => {
    portfolio = new PortfolioManager();
    
    // Exporta para debugging
    if (typeof window !== 'undefined') {
        window.Portfolio = {
            manager: portfolio,
            device: DeviceDetector,
            utils: Utils,
            config: CONFIG
        };
    }
};

// Inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}

// Cleanup para spa/hot reload
window.addEventListener('beforeunload', () => {
    if (portfolio?.components?.animations?.observer) {
        portfolio.components.animations.observer.disconnect();
    }
    if (portfolio?.components?.lazyLoad?.observer) {
        portfolio.components.lazyLoad.observer.disconnect();
    }
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator && !DeviceDetector.prefersReducedMotion) {
    window.addEventListener('load', () => {
        console.log('💡 Service Worker disponível para implementação futura');
    });
}

// Analytics helper
const trackEvent = (category, action, label = '') => {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            custom_map: {
                device_type: DeviceDetector.isMobile ? 'mobile' : 'desktop'
            }
        });
    }
    
    // Console log para debug
    console.log(`📊 Event: ${category} - ${action} - ${label}`);
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.trackEvent = trackEvent;
}
