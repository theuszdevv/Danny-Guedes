document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '5531995354599';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================================================
  // 1. MINI ANIMAÇÕES AO ROLAR A PÁGINA (SCROLL REVEAL COM INTERSECTION OBSERVER)
  // ========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // Sticky Header Subtle Shadow & Reading Progress Bar on Scroll
  const siteHeader = document.querySelector('.site-header');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  if (siteHeader || scrollProgressBar) {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (siteHeader) {
        siteHeader.classList.toggle('is-scrolled', scrollY > 24);
      }
      if (scrollProgressBar) {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTotal > 0 ? (scrollY / scrollTotal) * 100 : 0;
        scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ========================================================================
  // 2. PORTRAIT SWITCHER (RETRATOS REAIS DA DANNY GUEDES)
  // ========================================================================
  const photoBtns = document.querySelectorAll('.photo-switcher__btn');
  const artistPhoto = document.getElementById('artistPhoto');
  const secondaryArtistPhoto = document.getElementById('secondaryArtistPhoto');
  const secondaryPhotoCard = document.getElementById('secondaryPhotoCard');
  const portraitStage = document.getElementById('portraitStage');

  function setPortraitPhoto(mainSrc, secondarySrc, mode) {
    if (!artistPhoto || !mainSrc) return;

    const loader = new Image();
    loader.onload = () => {
      artistPhoto.style.opacity = '0';
      setTimeout(() => {
        artistPhoto.src = mainSrc;
        if (secondaryArtistPhoto && secondarySrc) {
          secondaryArtistPhoto.src = secondarySrc;
        }
        if (portraitStage) {
          portraitStage.classList.toggle('is-real-photo', mode === 'real');
        }
        artistPhoto.style.opacity = '1';
      }, prefersReducedMotion ? 0 : 130);
    };
    loader.src = mainSrc;
  }

  photoBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      photoBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      setPortraitPhoto(
        btn.getAttribute('data-photo'),
        btn.getAttribute('data-secondary'),
        btn.getAttribute('data-mode')
      );
    });
  });

  if (secondaryPhotoCard && artistPhoto && secondaryArtistPhoto) {
    secondaryPhotoCard.addEventListener('click', () => {
      const currentMain = artistPhoto.getAttribute('src');
      const currentSecondary = secondaryArtistPhoto.getAttribute('src');
      setPortraitPhoto(currentSecondary, currentMain, 'real');

      photoBtns.forEach((btn) => {
        const isMatch = btn.getAttribute('data-photo') === currentSecondary;
        btn.classList.toggle('is-active', isMatch);
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });
    });
  }

  // ========================================================================
  // 3. SCROLLYTELLING INTERATIVO DOS MÉTODOS (EXPERIENCE MODE)
  // ========================================================================
  const scrollySteps = document.querySelectorAll('.scrolly-step');
  const scrollyImages = document.querySelectorAll('.scrolly-stage__image');
  const scrollyDots = document.querySelectorAll('.scrolly-dot');
  const scrollyRailFill = document.getElementById('scrollyRailFill');
  const scrollyNarrative = document.querySelector('.scrolly-narrative');

  if (scrollySteps.length > 0 && scrollyImages.length > 0) {
    let currentStepNum = '1';

    function setActiveScrollyStep(stepNum) {
      const stepStr = String(stepNum);
      if (stepStr === currentStepNum) return;
      currentStepNum = stepStr;

      scrollySteps.forEach((s) => {
        s.classList.toggle('is-active', s.getAttribute('data-step') === stepStr);
      });

      scrollyImages.forEach((img) => {
        const isCurrent = img.getAttribute('data-stage-step') === stepStr;
        if (img.classList.contains('is-active') && !isCurrent) {
          img.classList.remove('is-active');
          img.classList.add('was-active');
          setTimeout(() => {
            img.classList.remove('was-active');
          }, 850);
        } else if (isCurrent) {
          img.classList.remove('was-active');
          img.classList.add('is-active');
        }
      });

      scrollyDots.forEach((dot) => {
        const isMatch = dot.getAttribute('data-dot') === stepStr;
        dot.classList.toggle('is-active', isMatch);
        dot.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });
    }

    if ('IntersectionObserver' in window) {
      const scrollyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const step = entry.target.getAttribute('data-step');
              if (step) {
                setActiveScrollyStep(step);
              }
            }
          });
        },
        {
          root: null,
          rootMargin: '-15% 0px -25% 0px',
          threshold: 0.15
        }
      );

      scrollySteps.forEach((stepEl) => scrollyObserver.observe(stepEl));
    }

    scrollyDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetStep = dot.getAttribute('data-dot');
        const targetEl = document.querySelector(`.scrolly-step[data-step="${targetStep}"]`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
          setActiveScrollyStep(targetStep);
        }
      });
    });
  }

  // ========================================================================
  // 3.1. UNIFIED 60FPS SCROLL ENGINE (PARALLAX + PROGRESS + STEP TRACKING)
  // ========================================================================
  if (!prefersReducedMotion) {
    const heroSection = document.getElementById('hero');
    const heroArch = document.querySelector('.hero-arch-backdrop');
    const heroPhotoWrapper = document.querySelector('.hero-photo-wrapper');
    const heroCardTop = document.querySelector('.hero-floating-card--top');
    const heroCardBottom = document.querySelector('.hero-floating-card--bottom');

    const aboutSection = document.getElementById('sobre');
    const artistArch = document.querySelector('.artist-blue-arch');
    const artistPhotoFrame = document.querySelector('.artist-photo-frame');

    let isScrollTicking = false;

    function handleUnifiedScroll() {
      const windowH = window.innerHeight;
      const isMobile = window.innerWidth <= 880;

      // 1. Hero Soft Parallax (desktop/tablet only to preserve 60fps on mobile)
      if (heroSection && !isMobile) {
        const heroRect = heroSection.getBoundingClientRect();
        if (heroRect.bottom > 0 && heroRect.top < windowH) {
          const heroDelta = -heroRect.top;
          if (heroArch) heroArch.style.transform = `translateX(-50%) translateY(${heroDelta * 0.12}px)`;
          if (heroPhotoWrapper) heroPhotoWrapper.style.transform = `translateY(${heroDelta * 0.05}px)`;
          if (heroCardTop) heroCardTop.style.transform = `translateY(${heroDelta * -0.06}px)`;
          if (heroCardBottom) heroCardBottom.style.transform = `translateY(${heroDelta * 0.08}px)`;
        }
      }

      // 2. About Section Soft Parallax (desktop/tablet only)
      if (aboutSection && !isMobile) {
        const aboutRect = aboutSection.getBoundingClientRect();
        if (aboutRect.bottom > 0 && aboutRect.top < windowH) {
          const aboutProgress = windowH - aboutRect.top;
          if (artistArch) artistArch.style.transform = `translateX(-50%) translateY(${aboutProgress * -0.05}px)`;
          if (artistPhotoFrame) artistPhotoFrame.style.transform = `translateY(${aboutProgress * -0.025}px)`;
        }
      }

      // 3. Scrollytelling Stage Progress & Step Tracking
      if (scrollyNarrative && scrollyRailFill) {
        const narrRect = scrollyNarrative.getBoundingClientRect();
        if (narrRect.bottom > 0 && narrRect.top < windowH) {
          const availableHeight = narrRect.height - windowH * 0.55;
          const currentProgress = (windowH * 0.45 - narrRect.top) / (availableHeight || 1);
          const clamped = Math.max(0, Math.min(1, currentProgress));

          scrollyRailFill.style.width = `${Math.min(100, Math.max(20, clamped * 100))}%`;

          // Subtle micro-parallax on stage active image
          const activeStageImg = document.querySelector('.scrolly-stage__image.is-active img');
          if (activeStageImg && !isMobile) {
            activeStageImg.style.setProperty('--stage-parallax', `${(clamped - 0.5) * -16}px`);
            activeStageImg.style.setProperty('--stage-scale', `${1 + clamped * 0.025}`);
          }

          // Fallback step switch during rapid scroll
          const windowCenter = window.innerHeight * (isMobile ? 0.38 : 0.45);
          let closestStep = null;
          let minDistance = Infinity;

          scrollySteps.forEach((stepEl) => {
            const rect = stepEl.getBoundingClientRect();
            const stepCenter = rect.top + rect.height / 2;
            const dist = Math.abs(windowCenter - stepCenter);
            if (dist < minDistance && rect.top < windowH * 0.88 && rect.bottom > windowH * 0.12) {
              minDistance = dist;
              closestStep = stepEl.getAttribute('data-step');
            }
          });

          if (closestStep) {
            setActiveScrollyStep(closestStep);
          }
        }
      }

      isScrollTicking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!isScrollTicking) {
          requestAnimationFrame(handleUnifiedScroll);
          isScrollTicking = true;
        }
      },
      { passive: true }
    );

    handleUnifiedScroll();
  }

  // ========================================================================
  // 4. FILTROS DO PORTFÓLIO COM ARIA
  // ========================================================================
  const filterPills = document.querySelectorAll('.filter-pill');
  const nailCards = document.querySelectorAll('.nail-card');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => {
        p.classList.remove('is-active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-selected', 'true');

      const filter = pill.getAttribute('data-filter');
      nailCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        const matches = filter === 'all' || categories.includes(filter);
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  // ========================================================================
  // 5. CALCULADORA DE PREÇOS INTEGRADA AO FORMULÁRIO DE AGENDAMENTO
  // ========================================================================
  const priceItems = document.querySelectorAll('.price-item');
  const selectedServicesText = document.getElementById('selectedServicesText');
  const selectedServicesTotal = document.getElementById('selectedServicesTotal');
  const catalogRuleFeedback = document.getElementById('catalogRuleFeedback');
  const clearCatalogBtn = document.getElementById('clearCatalogBtn');
  const formSyncedServicesList = document.getElementById('formSyncedServicesList');
  const formSyncedTotal = document.getElementById('formSyncedTotal');
  const reposicaoStepper = document.getElementById('reposicaoStepper');
  const reposicaoPriceDisplay = document.getElementById('reposicaoPriceDisplay');
  const qtyMinusBtn = document.getElementById('qtyMinusBtn');
  const qtyPlusBtn = document.getElementById('qtyPlusBtn');
  const qtyCountText = document.getElementById('qtyCountText');

  let reposicaoQty = 1;

  function setItemChecked(item, checked) {
    if (!item) return;
    item.classList.toggle('is-selected', checked);
    item.setAttribute('aria-checked', checked ? 'true' : 'false');
    if (item.getAttribute('data-id') === 'reposicao-unha' && reposicaoStepper) {
      reposicaoStepper.hidden = !checked;
    }
  }

  function showRuleFeedback(msg) {
    if (!catalogRuleFeedback) return;
    if (!msg) {
      catalogRuleFeedback.hidden = true;
      catalogRuleFeedback.textContent = '';
      return;
    }
    catalogRuleFeedback.textContent = msg;
    catalogRuleFeedback.hidden = false;
  }

  function applyBusinessRules(clickedItem) {
    const id = clickedItem.getAttribute('data-id');
    const isNowSelected = clickedItem.classList.contains('is-selected');
    showRuleFeedback('');

    if (!isNowSelected) return;

    const maoItem = document.querySelector('[data-id="mao-simples"]');
    const peItem = document.querySelector('[data-id="pe-simples"]');
    const comboItem = document.querySelector('[data-id="combo-mao-pe"]');

    // Rule 1: Combo Mão e Pé unchecks separate Mão and Pé
    if (id === 'combo-mao-pe') {
      setItemChecked(maoItem, false);
      setItemChecked(peItem, false);
    }

    // Rule 2: Selecting both Mão and Pé automatically switches to Combo Mão e Pé (R$ 70)
    if ((id === 'mao-simples' || id === 'pe-simples') && maoItem?.classList.contains('is-selected') && peItem?.classList.contains('is-selected')) {
      setItemChecked(maoItem, false);
      setItemChecked(peItem, false);
      setItemChecked(comboItem, true);
      showRuleFeedback('Combo Mão e Pé (R$ 70,00) aplicado automaticamente com economia de R$ 10,00!');
    }

    // Rule 3: Structural nail procedures are mutually exclusive
    const group = clickedItem.getAttribute('data-group');
    if (group === 'estrutura') {
      document.querySelectorAll('.price-item[data-group="estrutura"]').forEach((other) => {
        if (other !== clickedItem && other.classList.contains('is-selected')) {
          setItemChecked(other, false);
          showRuleFeedback(`Substituímos o procedimento estrutural anterior por ${clickedItem.getAttribute('data-name')}.`);
        }
      });
    }
  }

  function getSelectedItemsData() {
    const selected = Array.from(priceItems).filter((item) => item.classList.contains('is-selected'));
    return selected.map((item) => {
      const id = item.getAttribute('data-id');
      const baseName = item.getAttribute('data-name');
      const basePrice = Number(item.getAttribute('data-price') || 0);

      if (id === 'reposicao-unha') {
        const sub = basePrice * reposicaoQty;
        return {
          id,
          name: `${baseName} (${reposicaoQty} un)`,
          price: sub,
          formattedPrice: `R$ ${sub.toFixed(2).replace('.', ',')}`
        };
      }

      if (id === 'maquiagem-social') {
        return {
          id,
          name: 'Maquiagem Social & Eventos',
          price: 0,
          formattedPrice: 'Sob consulta'
        };
      }

      return {
        id,
        name: baseName,
        price: basePrice,
        formattedPrice: `R$ ${basePrice.toFixed(2).replace('.', ',')}`
      };
    });
  }

  function syncCatalogAndForm() {
    const items = getSelectedItemsData();
    const total = items.reduce((sum, i) => sum + i.price, 0);
    const hasMakeup = items.some((i) => i.id === 'maquiagem-social');
    const totalFormatted = total > 0
      ? `R$ ${total.toFixed(2).replace('.', ',')}${hasMakeup ? ' + Make (sob consulta)' : ''}`
      : hasMakeup
        ? 'Sob consulta (Maquiagem)'
        : 'R$ 0,00';

    if (items.length === 0) {
      if (selectedServicesText) {
        selectedServicesText.textContent = 'Nenhum serviço selecionado — escolha na tabela acima';
      }
      if (selectedServicesTotal) {
        selectedServicesTotal.textContent = 'Total Estimado: R$ 0,00';
      }
      if (formSyncedServicesList) {
        formSyncedServicesList.textContent = 'Avaliação personalizada / Serviço a definir no atendimento';
      }
      if (formSyncedTotal) {
        formSyncedTotal.textContent = 'A definir';
      }
      return;
    }

    const summaryNames = items.map((i) => i.name).join(' + ');
    const detailedList = items.map((i) => `${i.name} (${i.formattedPrice})`).join(' • ');

    if (selectedServicesText) {
      selectedServicesText.textContent = `Selecionado: ${summaryNames}`;
    }
    if (selectedServicesTotal) {
      selectedServicesTotal.textContent = `Total Estimado: ${totalFormatted}`;
    }
    if (formSyncedServicesList) {
      formSyncedServicesList.textContent = detailedList;
    }
    if (formSyncedTotal) {
      formSyncedTotal.textContent = totalFormatted;
    }
  }

  priceItems.forEach((item) => {
    item.addEventListener('click', () => {
      const nextState = !item.classList.contains('is-selected');
      setItemChecked(item, nextState);
      applyBusinessRules(item);
      syncCatalogAndForm();
    });
  });

  // Quantity Stepper Controls
  function updateReposicaoQty(newQty) {
    reposicaoQty = Math.max(1, Math.min(10, newQty));
    if (qtyCountText) qtyCountText.textContent = `${reposicaoQty} un`;
    if (reposicaoPriceDisplay) {
      reposicaoPriceDisplay.textContent = `R$ ${(reposicaoQty * 10).toFixed(2).replace('.', ',')}`;
    }
    syncCatalogAndForm();
  }

  if (qtyMinusBtn) {
    qtyMinusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateReposicaoQty(reposicaoQty - 1);
    });
  }
  if (qtyPlusBtn) {
    qtyPlusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateReposicaoQty(reposicaoQty + 1);
    });
  }

  if (clearCatalogBtn) {
    clearCatalogBtn.addEventListener('click', () => {
      priceItems.forEach((item) => setItemChecked(item, false));
      updateReposicaoQty(1);
      showRuleFeedback('Seleção limpa. Escolha os procedimentos desejados acima.');
      syncCatalogAndForm();
    });
  }

  // Initialize
  syncCatalogAndForm();

  // ========================================================================
  // 6. SELEÇÃO DE MODELO DO PORTFÓLIO ("QUERO ESSE MODELO")
  // ========================================================================
  const modelInput = document.getElementById('modelInput');
  const bookingSection = document.getElementById('agendar');
  const clientNameInput = document.getElementById('clientName');

  function selectPortfolioModel(modelName, suggestedType) {
    if (modelInput && modelName) {
      modelInput.value = modelName;
    }
    if (suggestedType === 'alongamento-decorado') {
      priceItems.forEach((item) => {
        const id = item.getAttribute('data-id');
        if (id === 'alongamento-gel' || id === 'decoracao-gel') {
          setItemChecked(item, true);
        } else if (item.getAttribute('data-group') === 'estrutura') {
          setItemChecked(item, false);
        }
      });
      syncCatalogAndForm();
    } else if (suggestedType === 'alongamento-gel') {
      priceItems.forEach((item) => {
        const id = item.getAttribute('data-id');
        if (id === 'alongamento-gel') {
          setItemChecked(item, true);
        } else if (item.getAttribute('data-group') === 'estrutura') {
          setItemChecked(item, false);
        }
      });
      syncCatalogAndForm();
    }

    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      setTimeout(() => {
        if (clientNameInput) clientNameInput.focus();
      }, prefersReducedMotion ? 0 : 450);
    }
  }

  document.querySelectorAll('.nail-card__cta').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectPortfolioModel(
        btn.getAttribute('data-model'),
        btn.getAttribute('data-suggest-service')
      );
    });
  });

  // ========================================================================
  // 7. LIGHTBOX MODAL COM FOCO ACESSÍVEL
  // ========================================================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxSelectModelBtn = document.getElementById('lightboxSelectModelBtn');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  let lastFocusedTrigger = null;
  let currentLightboxTitle = '';

  function openLightbox(imgSrc, titleText, triggerEl) {
    if (!lightboxModal || !lightboxImg) return;
    lastFocusedTrigger = triggerEl || document.activeElement;
    currentLightboxTitle = titleText || '';

    lightboxImg.src = imgSrc;
    lightboxImg.alt = titleText || 'Danny Guedes Nail Designer';
    if (lightboxTitle) lightboxTitle.textContent = currentLightboxTitle;

    lightboxModal.classList.add('is-open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      if (lightboxClose) lightboxClose.focus();
    }, 40);
  }

  function closeLightbox() {
    if (!lightboxModal || !lightboxModal.classList.contains('is-open')) return;
    lightboxModal.classList.remove('is-open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  }

  document.querySelectorAll('.nail-card__img-wrap').forEach((wrap) => {
    wrap.addEventListener('click', (e) => {
      const btn = wrap.querySelector('.nail-card__zoom');
      openLightbox(
        wrap.getAttribute('data-img'),
        wrap.getAttribute('data-title'),
        btn || wrap
      );
      e.stopPropagation();
    });
  });

  const viewOriginalCatalogBtn = document.getElementById('viewOriginalCatalogBtn');
  if (viewOriginalCatalogBtn) {
    viewOriginalCatalogBtn.addEventListener('click', () => {
      openLightbox(
        viewOriginalCatalogBtn.getAttribute('data-img'),
        viewOriginalCatalogBtn.getAttribute('data-title'),
        viewOriginalCatalogBtn
      );
    });
  }

  if (lightboxSelectModelBtn) {
    lightboxSelectModelBtn.addEventListener('click', () => {
      const chosenTitle = currentLightboxTitle;
      closeLightbox();
      if (chosenTitle && !chosenTitle.includes('Catálogo')) {
        selectPortfolioModel(chosenTitle, 'alongamento-decorado');
      } else if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      }
    });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = [lightboxClose, lightboxSelectModelBtn].filter(Boolean);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // ========================================================================
  // 8. FORMULÁRIO DE ENVIO UNIFICADO PARA O WHATSAPP (31) 99535-4599
  // ========================================================================
  const bookingForm = document.getElementById('bookingForm');
  const clientNameError = document.getElementById('clientNameError');

  if (clientNameInput && clientNameError) {
    clientNameInput.addEventListener('input', () => {
      if (clientNameInput.value.trim()) {
        clientNameError.hidden = true;
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = clientNameInput?.value.trim() || '';
      if (!name) {
        if (clientNameError) clientNameError.hidden = false;
        if (clientNameInput) clientNameInput.focus();
        return;
      }

      const items = getSelectedItemsData();
      const model = modelInput?.value.trim() || '';
      const period = document.getElementById('periodSelect')?.value || 'Tarde';
      const total = items.reduce((sum, i) => sum + i.price, 0);
      const hasMakeup = items.some((i) => i.id === 'maquiagem-social');

      const serviceLines = items.length > 0
        ? items.map((i) => `• ${i.name} — ${i.formattedPrice}`).join('\n')
        : '• Avaliação / Procedimento a definir';

      let message = `Olá, Danny Guedes! ✨\nMeu nome é *${name}* e gostaria de agendar um horário.\n\n*Serviços selecionados:*\n${serviceLines}`;
      if (total > 0) {
        message += `\n*Total Estimado:* R$ ${total.toFixed(2).replace('.', ',')}${hasMakeup ? ' + Maquiagem (sob consulta)' : ''}`;
      }
      if (model) {
        message += `\n*Inspiração/Modelo:* ${model}`;
      }
      message += `\n*Preferência de período:* ${period}\n\nPoderia me informar a disponibilidade da sua agenda em Belo Horizonte?`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // ========================================================================
  // 12. OVERDRIVE: HAUTE COUTURE MAGNETIC CURSOR & 3D TILT ENGINE
  // ========================================================================
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursorRoot = document.getElementById('overdriveCursor');
    const cursorDot = cursorRoot?.querySelector('.overdrive-cursor__dot');
    const cursorRing = cursorRoot?.querySelector('.overdrive-cursor__ring');

    if (cursorRoot && cursorDot && cursorRing) {
      let mouseX = -100;
      let mouseY = -100;
      let ringX = -100;
      let ringY = -100;
      let magneticTarget = null;
      let isVisible = false;

      window.addEventListener(
        'mousemove',
        (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          if (!isVisible) {
            isVisible = true;
            cursorRoot.style.opacity = '1';
          }
        },
        { passive: true }
      );

      window.addEventListener('mousedown', () => {
        cursorRoot.classList.add('is-clicking');
      });

      window.addEventListener('mouseup', () => {
        cursorRoot.classList.remove('is-clicking');
      });

      // Interactive targets with hover expansion and magnetic attraction
      const interactiveSelector =
        'a, button, .nail-card, .scrolly-step__card, .price-item, .cat-tab-btn, .addon-card, .filter-pill, .scrolly-dot';
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursorRoot.classList.add('is-hovering');
          if (el.matches('button, .btn-pill, .hero-cta-primary, .header-cta-btn, .filter-pill, .scrolly-dot')) {
            magneticTarget = el;
          }
        });

        el.addEventListener('mouseleave', () => {
          cursorRoot.classList.remove('is-hovering');
          magneticTarget = null;
        });
      });

      // 60fps physics lerp loop for the outer ring
      function renderCursor() {
        if (isVisible) {
          cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

          let targetX = mouseX;
          let targetY = mouseY;

          if (magneticTarget) {
            const rect = magneticTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            targetX = centerX + (mouseX - centerX) * 0.35;
            targetY = centerY + (mouseY - centerY) * 0.35;
          }

          ringX += (targetX - ringX) * 0.18;
          ringY += (targetY - ringY) * 0.18;
          cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        }
        requestAnimationFrame(renderCursor);
      }
      requestAnimationFrame(renderCursor);
    }

    // 3D Card Tilt & Specular Light Reflection on Portfolio Cards (.nail-card)
    const nailCards = document.querySelectorAll('.nail-card');
    nailCards.forEach((card) => {
      let isCardHovered = false;
      let cachedRect = null;

      card.addEventListener('mouseenter', () => {
        isCardHovered = true;
        cachedRect = card.getBoundingClientRect();
      });

      card.addEventListener('mousemove', (e) => {
        if (!isCardHovered || !cachedRect) return;
        const x = (e.clientX - cachedRect.left) / cachedRect.width;
        const y = (e.clientY - cachedRect.top) / cachedRect.height;

        const tiltX = (y - 0.5) * -12; // tilt degrees
        const tiltY = (x - 0.5) * 12;

        card.style.transform = `perspective(850px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
        card.style.setProperty('--mouse-x', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${(y * 100).toFixed(1)}%`);
      });

      card.addEventListener('mouseleave', () => {
        isCardHovered = false;
        cachedRect = null;
        card.style.transform = 'perspective(850px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }
});
