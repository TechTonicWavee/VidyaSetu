'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

/**
 * CollapsibleSidebar — icon-only by default, expands to full width on hover.
 *
 * Props:
 *  navLinks  — array of { id, label, icon (Lucide component), path, badge?, external? }
 *  userInfo  — { initials, name, role }
 *  theme     — { bg, borderColor, activeBg, activeText, activeIcon, iconColor, textColor, hoverBg, accentGradient }
 */
export default function CollapsibleSidebar({ navLinks, userInfo, theme }) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const t = {
    bg: '#111827',
    borderColor: 'rgba(255,255,255,0.07)',
    activeBg: 'rgba(255,255,255,0.12)',
    activeText: '#ffffff',
    activeIcon: '#ffffff',
    iconColor: 'rgba(255,255,255,0.55)',
    textColor: 'rgba(255,255,255,0.75)',
    hoverBg: 'rgba(255,255,255,0.08)',
    accentGradient: 'linear-gradient(135deg,#5B21B6,#4338CA)',
    ...theme,
  };

  const isActive = (path) => {
    if (!path) return false;
    if (path === pathname) return true;
    // exact match for root portal pages to avoid greedy prefix matching
    const rootPaths = [
      '/dean','/faculty','/student',
      '/admin','/parent',
    ];
    if (rootPaths.includes(path)) return pathname === path;
    return pathname?.startsWith(path + '/') || pathname === path;
  };

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        width: expanded ? 256 : 64,
        background: t.bg,
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 30,
        borderRight: `1px solid ${t.borderColor}`,
        boxShadow: '2px 0 12px rgba(0,0,0,0.25)',
      }}
    >
      {/* ── Profile ─────────────────────────────────── */}
      <div
        style={{
          padding: '18px 12px',
          borderBottom: `1px solid ${t.borderColor}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minHeight: 72,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: t.accentGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            flexShrink: 0,
            letterSpacing: '0.02em',
          }}
        >
          {userInfo.initials}
        </div>
        <div
          style={{
            overflow: 'hidden',
            opacity: expanded ? 1 : 0,
            transition: 'opacity 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userInfo.name}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: t.iconColor, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userInfo.role}
          </p>
        </div>
      </div>

      {/* ── Nav Links ───────────────────────────────── */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '10px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);

          return (
            <button
              key={link.id}
              title={!expanded ? link.label : undefined}
              onClick={() => {
                if (link.external) {
                  window.open(link.external, '_blank');
                } else if (link.path) {
                  router.push(link.path);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '9px 10px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: active ? t.activeBg : 'transparent',
                transition: 'background 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = t.hoverBg;
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* Active indicator bar */}
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    bottom: '20%',
                    width: 3,
                    borderRadius: '0 3px 3px 0',
                    background: t.accentGradient,
                  }}
                />
              )}

              <Icon
                size={19}
                style={{
                  flexShrink: 0,
                  color: active ? t.activeIcon : t.iconColor,
                  transition: 'color 0.15s',
                }}
              />

              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? t.activeText : t.textColor,
                  whiteSpace: 'nowrap',
                  opacity: expanded ? 1 : 0,
                  transition: 'opacity 0.15s ease',
                  textAlign: 'left',
                }}
              >
                {link.label}
              </span>

              {/* Badge */}
              {link.badge && expanded && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 10,
                    background: link.badge === 'New' ? t.activeBg : '#EF4444',
                    color: link.badge === 'New' ? t.activeText : '#fff',
                    whiteSpace: 'nowrap',
                    opacity: expanded ? 1 : 0,
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  {link.badge}
                </span>
              )}
              {/* Dot badge in collapsed state */}
              {link.badge && !expanded && (
                <span
                  style={{
                    position: 'absolute',
                    top: 7,
                    right: 7,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#EF4444',
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer ──────────────────────────────────── */}
      <div
        style={{
          padding: '10px 8px',
          borderTop: `1px solid ${t.borderColor}`,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => router.push('/login')}
          title={!expanded ? 'Switch Role' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '9px 10px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            background: 'transparent',
            width: '100%',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={19} style={{ flexShrink: 0, color: '#FCA5A5' }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#FCA5A5',
              whiteSpace: 'nowrap',
              opacity: expanded ? 1 : 0,
              transition: 'opacity 0.15s ease',
            }}
          >
            Switch Role
          </span>
        </button>
      </div>
    </aside>
  );
}
