import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

export interface HeroProps {
  brandName?: string;
  brandLogo?: React.ReactNode;
  badgeTag?: React.ReactNode;
  headline?: React.ReactNode;
  subheadline?: React.ReactNode;
  primaryCtaLabel?: string;
  primaryCtaLink?: string;
  onPrimaryCtaClick?: () => void;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  onSecondaryCtaClick?: () => void;
  extraLeftContent?: React.ReactNode;
  cardLabel?: string;
  cardAmount?: string;
  cardDecimals?: string;
  cardDeltaBadge?: string;
  cardDeltaCaption?: string;
  navLinks?: Array<{ label: string; href: string; hasChevron?: boolean; onClick?: () => void; badge?: string }>;
  loginLabel?: string;
  loginLink?: string;
  onLoginClick?: () => void;
  signupLabel?: string;
  signupLink?: string;
  onSignupClick?: () => void;
  ctaNavLabel?: string;
  ctaNavLink?: string;
  onCtaNavClick?: () => void;
  liveOpsBadge?: React.ReactNode;
  rightContent?: React.ReactNode;
  onScrollDown?: () => void;
  scrollDownLabel?: string;
}

// 4.1 The BAR_HEIGHTS constant — use these 32 numbers exactly, in this order
export const BAR_HEIGHTS = [
  23, 40, 53, 40, 33, 14, 7, 17, 75, 65,
  88, 75, 65, 47, 33, 88, 4, 7, 9, 14,
  95, 65, 79, 37, 7, 40, 17, 20, 62, 47,
  92, 72,
];

// 4.2 Animate — the reusable entrance-animation wrapper
export interface AnimateProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
}

export function Animate({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: AnimateProps) {
  const directionMap: Record<'up' | 'down' | 'left' | 'right' | 'scale', string> = {
    up: 'animate-fade-up',
    down: 'animate-fade-down',
    left: 'animate-fade-left',
    right: 'animate-fade-right',
    scale: 'animate-fade-scale',
  };

  const directionClass = directionMap[direction] || 'animate-fade-up';

  return (
    <div
      className={`opacity-0 ${directionClass} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// 4.4 RevenueCard — the glassmorphic stat card (right column)
export interface RevenueCardProps {
  cardLabel?: string;
  cardAmount?: string;
  cardDecimals?: string;
  cardDeltaBadge?: string;
  cardDeltaCaption?: string;
}

export function RevenueCard({
  cardLabel = 'Citizens Supported',
  cardAmount = '12,430',
  cardDecimals = '+',
  cardDeltaBadge = '+32.4% Aid Flow',
  cardDeltaCaption = 'Western Province flood response telemetry',
}: RevenueCardProps) {
  const maxHeight = Math.max(...BAR_HEIGHTS);
  const timeLabels = ['10:00', '12:00', '14:00', '16:00', '16:00'];

  return (
    <Animate delay={900} direction="scale" className="w-full max-w-[405px] mx-auto lg:mx-0">
      <div className="w-full rounded-[24px] sm:rounded-[33px] bg-[rgba(17,16,15,0.35)] backdrop-blur-[20px] p-5 sm:p-8 pb-5 sm:pb-6">
        {/* 1. Label */}
        <p className="text-white text-[16px] sm:text-[20px] font-[450] leading-[20px] mb-3 sm:mb-4">
          {cardLabel}
        </p>

        {/* 2. Amount */}
        <p className="mb-2 sm:mb-3">
          <span className="text-white text-[28px] sm:text-[46px] font-[450] leading-[1]">
            {cardAmount}
          </span>
          <span className="text-white/20 text-[28px] sm:text-[46px] font-[450] leading-[1]">
            {cardDecimals}
          </span>
        </p>

        {/* 3. Delta row */}
        <div className="flex items-center gap-[10px] mb-6 sm:mb-8">
          <span className="px-[6px] py-[7px] bg-white/20 rounded-[6px] text-white text-[12px] sm:text-[14px] font-[450] leading-[14px]">
            {cardDeltaBadge}
          </span>
          <span className="text-white/80 text-[12px] sm:text-[14px] font-[450] leading-[14px] opacity-70">
            {cardDeltaCaption}
          </span>
        </div>

        {/* 4. Chart block */}
        <div className="relative">
          {/* (a) Bars */}
          <div className="flex items-end gap-[1.5px] h-[80px] sm:h-[100px]">
            {BAR_HEIGHTS.map((h, i) => {
              const isProjected = i >= 28;
              const heightPercent = (h / maxHeight) * 100;

              return (
                <div
                  key={i}
                  className="flex-1 rounded-[0.5px] animate-bar-grow origin-bottom"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: isProjected ? 'rgba(255,255,255,0.1)' : 'white',
                    animationDelay: `${1100 + i * 30}ms`,
                  }}
                />
              );
            })}
          </div>

          {/* (b) Vertical gridlines */}
          <div className="absolute inset-0 pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-white/10"
                style={{ left: `${((i + 1) / 5) * 100}%` }}
              />
            ))}
          </div>

          {/* (c) Time axis */}
          <div className="flex justify-between mt-3">
            {timeLabels.map((time, i) => (
              <span
                key={i}
                className="text-[9px] sm:text-[10px] font-[450] leading-[10px] text-white/80"
                style={{ opacity: i >= 3 ? 0.4 : 1 }}
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Animate>
  );
}

// 4.3 Hero — the outer section (default export)
export default function Hero({
  brandName = 'RELIEFCORE',
  brandLogo,
  badgeTag,
  headline = 'Rapid crisis response when every second counts',
  subheadline = 'Autonomous humanitarian coordination, real-time AI triage, and life-saving resource distribution.',
  primaryCtaLabel = 'Request Assistance',
  primaryCtaLink = '/citizen/submit',
  onPrimaryCtaClick,
  secondaryCtaLabel = 'Track Relief Request',
  secondaryCtaLink = '/citizen/track',
  onSecondaryCtaClick,
  extraLeftContent,
  cardLabel = 'Citizens Supported',
  cardAmount = '12,430',
  cardDecimals = '+',
  cardDeltaBadge = '+32.4% Aid Flow',
  cardDeltaCaption = 'vs. previous period (Western Province)',
  navLinks,
  loginLabel = 'Sign In',
  loginLink = '/login',
  onLoginClick,
  signupLabel = 'Register',
  signupLink = '/signup',
  onSignupClick,
  ctaNavLabel = 'Request Help',
  ctaNavLink = '/citizen/submit',
  onCtaNavClick,
  liveOpsBadge,
  rightContent,
  onScrollDown,
  scrollDownLabel = 'Explore Live Operations',
}: HeroProps) {
  let navigate: ((path: string) => void) | null = null;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = null;
  }

  const handlePrimaryClick = (e: React.MouseEvent) => {
    if (onPrimaryCtaClick) {
      onPrimaryCtaClick();
    } else if (primaryCtaLink && primaryCtaLink.startsWith('/') && navigate) {
      e.preventDefault();
      navigate(primaryCtaLink);
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent) => {
    if (onSecondaryCtaClick) {
      onSecondaryCtaClick();
    } else if (secondaryCtaLink && secondaryCtaLink.startsWith('/') && navigate) {
      e.preventDefault();
      navigate(secondaryCtaLink);
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#080A19]">
      {/* Background video — first child, absolutely positioned, covering */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_092641_de52eb87-daf2-41db-92cb-7a56eae012a5.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Content wrapper */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        <Nav
          brandName={brandName}
          brandLogo={brandLogo}
          navLinks={navLinks}
          loginLabel={loginLabel}
          loginLink={loginLink}
          onLoginClick={onLoginClick}
          signupLabel={signupLabel}
          signupLink={signupLink}
          onSignupClick={onSignupClick}
          ctaNavLabel={ctaNavLabel}
          ctaNavLink={ctaNavLink}
          onCtaNavClick={onCtaNavClick}
          liveOpsBadge={liveOpsBadge}
        />

        <div className="flex-1 flex items-center py-8">
          <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-12">
            {/* Copy block (left column) */}
            <div className="max-w-[593px]">
              {/* Optional Badge Tag */}
              {badgeTag && (
                <Animate delay={200} direction="up" className="mb-4">
                  {badgeTag}
                </Animate>
              )}

              {/* 1. Headline */}
              <Animate delay={300} direction="up">
                <h1 className="text-white text-[36px] sm:text-[52px] md:text-[64px] lg:text-[72px] font-normal leading-[0.95] mb-5 sm:mb-8">
                  {headline}
                </h1>
              </Animate>

              {/* 2. Subtitle */}
              <Animate delay={500} direction="up">
                <p className="text-white/80 text-[16px] sm:text-[18px] md:text-[20px] font-[450] leading-[1.3] max-w-[370px] mb-7 sm:mb-10">
                  {subheadline}
                </p>
              </Animate>

              {/* 3. CTA buttons */}
              <Animate delay={700} direction="up">
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {primaryCtaLink ? (
                    <a
                      href={primaryCtaLink}
                      onClick={handlePrimaryClick}
                      className="h-[46px] sm:h-[51px] px-5 sm:px-[27px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[14px] sm:text-[15.5px] font-[450] leading-[15.5px] transition-opacity hover:opacity-90 inline-flex items-center justify-center cursor-pointer text-decoration-none"
                    >
                      {primaryCtaLabel}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePrimaryClick}
                      className="h-[46px] sm:h-[51px] px-5 sm:px-[27px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[14px] sm:text-[15.5px] font-[450] leading-[15.5px] transition-opacity hover:opacity-90 inline-flex items-center justify-center cursor-pointer"
                    >
                      {primaryCtaLabel}
                    </button>
                  )}

                  {secondaryCtaLink ? (
                    <a
                      href={secondaryCtaLink}
                      onClick={handleSecondaryClick}
                      className="h-[46px] sm:h-[51px] px-5 sm:px-[27px] rounded-[12px] border border-white text-white text-[14px] sm:text-[15.5px] font-[450] leading-[15.5px] transition-opacity hover:opacity-80 inline-flex items-center justify-center cursor-pointer text-decoration-none"
                    >
                      {secondaryCtaLabel}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSecondaryClick}
                      className="h-[46px] sm:h-[51px] px-5 sm:px-[27px] rounded-[12px] border border-white text-white text-[14px] sm:text-[15.5px] font-[450] leading-[15.5px] transition-opacity hover:opacity-80 inline-flex items-center justify-center cursor-pointer"
                    >
                      {secondaryCtaLabel}
                    </button>
                  )}
                </div>
              </Animate>

              {/* Extra left content (e.g. tracking search or status prompts) */}
              {extraLeftContent && (
                <Animate delay={850} direction="up">
                  {extraLeftContent}
                </Animate>
              )}
            </div>

            {/* Right column: Either custom Crisis Operations HUD or pure RevenueCard */}
            {rightContent ? (
              rightContent
            ) : (
              <RevenueCard
                cardLabel={cardLabel}
                cardAmount={cardAmount}
                cardDecimals={cardDecimals}
                cardDeltaBadge={cardDeltaBadge}
                cardDeltaCaption={cardDeltaCaption}
              />
            )}
          </div>
        </div>

        {/* Optional Scroll Down Indicator */}
        {onScrollDown && (
          <Animate delay={1200} direction="up" className="pb-6 flex justify-center">
            <button
              type="button"
              onClick={onScrollDown}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-[14px] text-white/80 text-[13px] font-[450] transition-all cursor-pointer border border-white/15"
            >
              <span>{scrollDownLabel}</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-white/80" />
            </button>
          </Animate>
        )}
      </div>
    </section>
  );
}

// 4.5 Nav — header + mobile menu
export interface NavProps {
  brandName?: string;
  brandLogo?: React.ReactNode;
  navLinks?: Array<{ label: string; href: string; hasChevron?: boolean; onClick?: () => void; badge?: string }>;
  loginLabel?: string;
  loginLink?: string;
  onLoginClick?: () => void;
  signupLabel?: string;
  signupLink?: string;
  onSignupClick?: () => void;
  ctaNavLabel?: string;
  ctaNavLink?: string;
  onCtaNavClick?: () => void;
  liveOpsBadge?: React.ReactNode;
}

export function Nav({
  brandName = 'RELIEFCORE',
  brandLogo,
  navLinks = [
    { label: 'Citizen Portal', href: '/citizen' },
    { label: 'Verified Shelters', href: '/citizen/shelters' },
    { label: 'Satellite Map', href: '/map' },
    { label: 'Coordinator Command', href: '/coordinator/dashboard' },
  ],
  loginLabel = 'Sign In',
  loginLink = '/login',
  onLoginClick,
  signupLabel = 'Register',
  signupLink = '/signup',
  onSignupClick,
  ctaNavLabel = 'Request Help',
  ctaNavLink = '/citizen/submit',
  onCtaNavClick,
  liveOpsBadge,
}: NavProps) {
  const [isOpen, setIsOpen] = useState(false);

  let navigate: ((path: string) => void) | null = null;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = null;
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent, href?: string, onClick?: () => void) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }
    if (href && href.startsWith('/') && navigate) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <>
      <nav className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] pt-[20px] sm:pt-[30px] flex items-center justify-between relative z-50">
        {/* (i) Logo */}
        <Animate delay={0} direction="down">
          <div className="flex items-center gap-2.5">
            {brandLogo ? (
              <a
                href="/"
                onClick={(e) => handleLinkClick(e, '/')}
                className="flex items-center gap-2.5 text-decoration-none cursor-pointer"
              >
                {brandLogo}
              </a>
            ) : (
              <a
                href="/"
                onClick={(e) => handleLinkClick(e, '/')}
                className="flex items-center gap-2.5 text-decoration-none cursor-pointer"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 256 256"
                  fill="none"
                  className="sm:w-[32px] sm:h-[32px] text-white"
                >
                  <path
                    d="M 256 256 L 178 256 C 150.386 256 128 233.614 128 206 L 128 256 L 0 256 L 0 192 C 0 156.654 28.654 128 64 128 C 99.346 128 128 156.654 128 192 L 128 128 L 256 128 Z M 78 0 C 105.614 0 128 22.386 128 50 L 128 0 L 256 0 L 256 64 C 256 99.346 227.346 128 192 128 C 156.654 128 128 99.346 128 64 L 128 128 L 0 128 L 0 0 Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-white text-[22px] sm:text-[26px] font-[450] leading-none tracking-[-0.02em]">
                  {brandName}
                </span>
              </a>
            )}
          </div>
        </Animate>

        {/* (ii) Center nav pill */}
        <Animate delay={100} direction="down" className="hidden lg:block">
          <div className="h-[52px] px-6 flex items-center gap-[30px] bg-[rgba(10,7,7,0.35)] rounded-[11px] backdrop-blur-[17px] border border-white/[0.08]">
            {navLinks.map((item, idx) => {
              if (item.hasChevron && !item.badge) {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleLinkClick(e, item.href, item.onClick)}
                    className="flex items-center gap-[5px] text-white/80 text-[14px] font-[450] leading-[14px] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-[10px] h-[10px] opacity-80" />
                  </button>
                );
              }

              return (
                <a
                  key={idx}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href, item.onClick)}
                  className="flex items-center gap-1.5 text-white/80 text-[14px] font-[450] leading-[14px] hover:text-white transition-colors cursor-pointer text-decoration-none"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold tracking-wide border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.hasChevron && <ChevronDown className="w-[10px] h-[10px] opacity-80" />}
                </a>
              );
            })}
          </div>
        </Animate>

        {/* (iii) Right auth pill */}
        <Animate delay={200} direction="down" className="hidden lg:block">
          <div className="h-[52px] p-[3px] bg-[rgba(0,0,0,0.35)] rounded-[13px] backdrop-blur-[17px] flex items-center gap-[5px] border border-white/[0.08]">
            {liveOpsBadge}
            {loginLabel && (
              <a
                href={loginLink}
                onClick={(e) => handleLinkClick(e, loginLink, onLoginClick)}
                className="h-[46px] px-6 rounded-[11px] text-white text-[14px] font-[450] leading-[14px] hover:bg-white/5 transition-colors inline-flex items-center justify-center cursor-pointer text-decoration-none"
              >
                {loginLabel}
              </a>
            )}
            {signupLabel && (
              <a
                href={signupLink}
                onClick={(e) => handleLinkClick(e, signupLink, onSignupClick)}
                className="h-[46px] px-5 rounded-[11px] text-white/90 text-[14px] font-[450] leading-[14px] hover:bg-white/5 transition-colors inline-flex items-center justify-center cursor-pointer text-decoration-none"
              >
                {signupLabel}
              </a>
            )}
            {ctaNavLabel && (
              <a
                href={ctaNavLink}
                onClick={(e) => handleLinkClick(e, ctaNavLink, onCtaNavClick)}
                className="h-[46px] px-6 bg-[#E9E9E9] rounded-[11px] text-[#0A0707] text-[14px] font-[450] leading-[14px] hover:bg-white transition-colors inline-flex items-center justify-center cursor-pointer text-decoration-none"
              >
                {ctaNavLabel}
              </a>
            )}
          </div>
        </Animate>

        {/* (iv) Mobile hamburger */}
        <Animate delay={100} direction="down" className="lg:hidden">
          <button
            type="button"
            className="w-[44px] h-[44px] flex items-center justify-center rounded-[11px] bg-[rgba(10,7,7,0.35)] backdrop-blur-[17px] transition-colors hover:bg-white/10 border border-white/[0.08] cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <Menu
                className={`w-5 h-5 text-white absolute inset-0 transition-all duration-300 ease-out ${
                  isOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                className={`w-5 h-5 text-white absolute inset-0 transition-all duration-300 ease-out ${
                  isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </div>
          </button>
        </Animate>
      </nav>

      {/* (v) Mobile menu overlay (sibling of <nav>) */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop (click closes menu) */}
        <div
          className={`absolute inset-0 bg-[#080A19]/90 backdrop-blur-[24px] transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-[76px] sm:top-[86px] left-4 right-4 sm:left-6 sm:right-6 bg-[rgba(17,16,15,0.6)] backdrop-blur-[30px] rounded-[20px] border border-white/[0.06] p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top ${
            isOpen
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-4 scale-[0.97]'
          }`}
        >
          {/* Panel links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((item, i) => (
              <a
                key={i}
                href={item.href}
                onClick={(e) => {
                  setIsOpen(false);
                  handleLinkClick(e, item.href, item.onClick);
                }}
                className={`flex items-center justify-between px-4 py-4 rounded-[12px] text-white/90 text-[18px] font-[450] hover:bg-white/[0.06] transition-all duration-300 text-decoration-none ${
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                }`}
                style={{
                  transitionDelay: isOpen ? `${100 + i * 50}ms` : '0ms',
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.hasChevron && <ChevronDown className="w-4 h-4 opacity-50" />}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 my-5" />

          {/* Panel CTAs */}
          <div
            className={`flex flex-col gap-3 transition-all duration-300 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transitionDelay: isOpen ? '350ms' : '0ms' }}
          >
            {ctaNavLabel && (
              <a
                href={ctaNavLink}
                onClick={(e) => {
                  setIsOpen(false);
                  handleLinkClick(e, ctaNavLink, onCtaNavClick);
                }}
                className="w-full h-[50px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[15px] font-[450] transition-colors hover:bg-white inline-flex items-center justify-center text-decoration-none cursor-pointer"
              >
                {ctaNavLabel}
              </a>
            )}
            <div className="flex gap-2">
              {loginLabel && (
                <a
                  href={loginLink}
                  onClick={(e) => {
                    setIsOpen(false);
                    handleLinkClick(e, loginLink, onLoginClick);
                  }}
                  className="flex-1 w-full h-[50px] rounded-[12px] border border-white/30 text-white text-[15px] font-[450] transition-colors hover:bg-white/5 inline-flex items-center justify-center text-decoration-none cursor-pointer"
                >
                  {loginLabel}
                </a>
              )}
              {signupLabel && (
                <a
                  href={signupLink}
                  onClick={(e) => {
                    setIsOpen(false);
                    handleLinkClick(e, signupLink, onSignupClick);
                  }}
                  className="flex-1 w-full h-[50px] rounded-[12px] bg-white/10 text-white text-[15px] font-[450] transition-colors hover:bg-white/15 inline-flex items-center justify-center text-decoration-none cursor-pointer"
                >
                  {signupLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

