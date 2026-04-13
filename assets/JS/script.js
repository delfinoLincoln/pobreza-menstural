/* 
    Funcionalidades interativas e animações
*/


// Inicialização da Página

document.addEventListener("DOMContentLoaded", () => {
    initAOS();
    setupScrollEvents();
    setupNavigation();
    setupBackToTop();
    setupMenuToggle();
    setupSmoothScroll();
    updateActiveNavLink();
});

// AOS - Animate On Scroll

function initAOS() {
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            easing: "ease-in-out-cubic",
            once: false,
            offset: 100,
            delay: 50,
            disable: false,
        });
    }
}

// SCROLL EVENTS - Detectar scroll e atualizar UI

function setupScrollEvents() {
    window.addEventListener("scroll", () => {
        // Atualizar navbar ao scroll
        const navbar = document.getElementById("navbar");
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } 
        else {
            navbar.classList.remove("scrolled");
        }

        // Mostrar/ocultar botão voltar ao topo
        updateBackToTopButton();

        // Atualizar link de navegação ativa
        updateActiveNavLink();
    });
}

// DETECÇÃO DE SEÇÃO ATIVA

function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id], header[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
}

// NAVEGAÇÃO

function setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            // Fechar menu mobile se aberto
            const mobileMenu = document.getElementById("mobile-menu");
            const menuToggle = document.getElementById("menu-toggle");

            if (!mobileMenu.classList.contains("hidden")) {
                mobileMenu.classList.add("hidden");
                menuToggle.querySelector("svg").innerHTML =
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        });
    });
}

// MENU HAMBURGUER

function setupMenuToggle() {
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    menuToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");

        // Animar ícone do menu
        const svg = menuToggle.querySelector("svg");
        if (!mobileMenu.classList.contains("hidden")) {
            svg.innerHTML =
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
        } else {
            svg.innerHTML =
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        }
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
        if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            if (!mobileMenu.classList.contains("hidden")) {
                mobileMenu.classList.add("hidden");
                menuToggle.querySelector("svg").innerHTML =
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        }
    });
}

// SCROLL SUAVE

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                // Calcular a posição com offset para a navbar
                const navHeight = document.getElementById("navbar").offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                });
            }
        });
    });
}

// BOTÃO VOLTAR AO TOPO

function setupBackToTop() {
    const backToTopButton = document.getElementById("back-to-top");

    window.addEventListener("scroll", updateBackToTopButton);

    backToTopButton.addEventListener("click", scrollToTop);
}

function updateBackToTopButton() {
    const backToTopButton = document.getElementById("back-to-top");

    if (window.scrollY > 300) {
        backToTopButton.classList.add("show");
    } 
    else {
        backToTopButton.classList.remove("show");
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

// COMPARTILHAR CONTEÚDO

function shareContent() {
    const title = "Pobreza Menstrual no Brasil - Dignidade Não É Privilégio";
    const text =
        "1 em cada 4 meninas já faltou à escola por não ter absorventes. Conheça os dados e as soluções para esse problema urgente de direitos humanos.";
    const url = window.location.href;

    // Usar Web Share API se disponível
    if (navigator.share) {
        navigator
            .share({
                title: title,
                text: text,
                url: url,
            })
            .catch((err) => console.log("Erro ao compartilhar:", err));
    } else {
        // Fallback: copiar para clipboard e mostrar mensagem
        const fullText = `${title}\n${text}\n${url}`;
        navigator.clipboard
            .writeText(fullText)
            .then(() => {
                showNotification("Conteúdo copiado para a área de transferência!");
            })
            .catch((err) => {
                console.error("Erro ao copiar:", err);
                alert("Abra as redes sociais e compartilhe esse conteúdo importante!");
            });
    }
}

// NOTIFICAÇÕES

function showNotification(message) {
    const notification = document.createElement("div");
    notification.className =
        "fixed top-4 right-4 bg-verde-solucao text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-up";
    notification.textContent = message;
    notification.style.animation = "fadeUpAnimation 0.5s ease-out";

    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = "fadeDownAnimation 0.5s ease-out";
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// CONTADOR ANIMADO

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString("pt-BR");
            clearInterval(interval);
        } else {
            element.textContent = Math.floor(current).toLocaleString("pt-BR");
        }
    }, 16);
}

// EFEITOS DE PARALLAX

function setupParallax() {
    const parallaxElements = document.querySelectorAll("[data-parallax]");

    window.addEventListener("scroll", () => {
        parallaxElements.forEach((element) => {
            const scrollPosition = window.scrollY;
            const yPos = scrollPosition * (element.dataset.parallax || 0.5);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// EFEITO INTERSECTION OBSERVER

function setupIntersectionObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");

                    // Animar números quando entram em view
                    const counters = entry.target.querySelectorAll("[data-count]");
                    counters.forEach((counter) => {
                        const target = parseInt(counter.dataset.count);
                        animateCounter(counter, target);
                    });
                }
            });
        },
        {
            threshold: 0.1,
        },
    );

    // Observar seções
    document.querySelectorAll("section").forEach((section) => {
        observer.observe(section);
    });
}

// VALIDAÇÃO E ACESSIBILIDADE

function setupAccessibility() {
    // Adicionar atributo lang-pt-BR se não existir
    if (!document.documentElement.lang) {
        document.documentElement.lang = "pt-BR";
    }

    // Melhorar navegação por teclado
    document.addEventListener("keydown", (e) => {
        // ESC para fechar menu mobile
        if (e.key === "Escape") {
            const mobileMenu = document.getElementById("mobile-menu");
            if (!mobileMenu.classList.contains("hidden")) {
                mobileMenu.classList.add("hidden");
            }
        }

        // Atalho: pressione 'T' para voltar ao topo
        if (e.key.toLowerCase() === "t" && !e.ctrlKey && !e.metaKey) {
            const activeElement = document.activeElement;
            if (
                activeElement !== document.body &&
                activeElement.tagName !== "INPUT" &&
                activeElement.tagName !== "TEXTAREA"
            ) {
                scrollToTop();
            }
        }
    });
}

// EFEITOS DE HOVER EM CARDS

function setupCardEffects() {
    const cards = document.querySelectorAll('[class*="card"]');

    cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-10px) scale(1.02)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0) scale(1)";
        });
    });
}

// DETECÇÃO DE PREFERÊNCIA DE TEMA

function detectThemePreference() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDark) {
        // Você pode adicionar classe de tema escuro aqui
        console.log("Usuário prefere tema escuro");
    }
}

// PERFORMANCE - Debounce

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// PERFORMANCE - Throttle

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Aplicar throttle ao scroll
const throttledScroll = throttle(() => {
    updateActiveNavLink();
    updateBackToTopButton();
}, 50);

// INICIALIZAÇÃO AVANÇADA

// Setup adicional após carregamento completo
window.addEventListener("load", () => {
    setupAccessibility();
    setupCardEffects();
    setupIntersectionObserver();
    detectThemePreference();

    // Adicionar transição suave CSS
    document.documentElement.style.scrollBehavior = "smooth";

    console.log("Página carregada e funcionalidades ativadas");
});

// TRATAMENTO DE ERROS

window.addEventListener("error", (e) => {
    console.error("Erro na página:", e.error);
    // Você pode adicionar relatório de erros aqui
});

// LIMPEZA DE RECURSOS

window.addEventListener("beforeunload", () => {
    // Remover listeners se necessário
    console.log("Página sendo fechada");
});

// FUNÇÕES DE UTILIDADE

// Verificar se elemento está em viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Scroll para elemento específico
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// ANALYTICS E RASTREAMENTO (opcional)

// Você pode adicionar rastreamento de eventos aqui
function trackEvent(eventName, eventData = {}) {
    console.log(`📊 Evento: ${eventName}`, eventData);

    // Integrar com Google Analytics, Mixpanel, etc.
    if (window.gtag) {
        window.gtag("event", eventName, eventData);
    }
}

// Rastrear cliques em links importantes
document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        trackEvent("navigation_click", {
            link_target: link.getAttribute("href"),
        });
    }
});

// MELHORIAS DE SEO

// Estruturado para SEO (JSON-LD)
function initializeSchemaMarkup() {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Pobreza Menstrual no Brasil - Dignidade Não É Privilégio",
        description:
            "Informações sobre pobreza menstrual no Brasil, dados, consequências e soluções.",
        url: window.location.href,
        inLanguage: "pt-BR",
        author: {
            "@type": "Organization",
            name: "Plataforma Dignidade Menstrual",
        },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

// Executar ao carregar
initializeSchemaMarkup();

// CONSOLE GREETING

console.log(
    "%c Bem-vindo ao site Pobreza Menstrual no Brasil! ",
    "background: linear-gradient(45deg, #E63946, #FFB3BA); color: white; font-size: 14px; padding: 10px; border-radius: 5px; font-weight: bold;",
);
console.log(
    "%cDignidade menstrual é um direito humano. Juntos podemos fazer a diferença!",
    "color: #E63946; font-size: 12px; font-style: italic;",
);