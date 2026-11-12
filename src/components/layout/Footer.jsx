import { ShieldCheck, Activity, ExternalLink } from 'lucide-react'

export function Footer({ onOpenInfo }) {
  return (
    <footer className="w-full mt-10 pt-8 pb-6 border-t border-cold-divider/10 text-xs text-cold-muted bg-cold-shade/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-cold-dark border border-cold-ice/25 flex items-center justify-center p-1 shadow-[0_0_10px_rgba(190,207,255,0.15)]">
                <img
                  src="/logos/1.png"
                  alt="ColdTrack"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
              <span className="font-heading font-bold text-base text-cold-text tracking-tight">
                Cold<span className="text-cold-ice">Track</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider bg-cold-ice/10 text-cold-ice border border-cold-ice/25">
                IOT PLATFORM
              </span>
            </div>

            <p className="text-xs text-cold-muted leading-relaxed">
              Plataforma de hiperautomatización y mantenimiento predictivo en cadena de frío. Conectamos telemetría IoT, diagnóstico cognitivo con IA y orquestación B2B automatizada.
            </p>

            <div className="flex items-center gap-4 pt-1 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Acceso con sesión
              </span>
              <span className="inline-flex items-center gap-1.5 text-cold-ice font-medium">
                <Activity className="w-3.5 h-3.5 text-cold-ice animate-pulse" />
                Telemetría Activa
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-bold text-cold-lavender tracking-wider uppercase block">
              Desarrollado Por
            </span>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center bg-cold-raised border border-cold-divider/10 px-2 py-1 rounded-lg shadow-sm">
                <img
                  src="/logos/tucsoft.png"
                  alt="TucSoft"
                  className="h-5 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'inline-block'
                    }
                  }}
                />
                <span className="hidden font-heading font-black text-xs text-cold-brand-orange tracking-tight">
                  tucsoft
                </span>
              </div>

              <div>
                <span className="font-heading font-bold text-sm text-cold-text block leading-tight">
                  TucSoft
                </span>
                <span className="text-[11px] text-cyan-400 font-medium block">
                  Software & AI Solutions
                </span>
              </div>
            </div>

            <p className="text-xs text-cold-muted leading-relaxed">
              Empresa especializada en soluciones de software, hiperautomatización e inteligencia artificial.
            </p>

            <a
              href="https://tucsoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 font-medium transition-colors"
            >
              <span>Visitar sitio web oficial</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-bold text-cold-text tracking-wider uppercase block">
              Módulos del Sistema
            </span>

            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/"
                  className="text-cold-muted hover:text-cold-ice transition-colors block"
                >
                  Monitor IoT & Diagnóstico
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenInfo}
                  className="text-cold-muted hover:text-cold-ice transition-colors text-left block cursor-pointer"
                >
                  Asistente Cognitivo IA
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenInfo}
                  className="text-cold-muted hover:text-cold-ice transition-colors text-left block cursor-pointer"
                >
                  Órdenes de Reparación
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-bold text-cold-text tracking-wider uppercase block">
              Proyecto Institucional
            </span>

            <p className="text-xs text-cold-muted">
              Caso de Negocio: Mantenimiento Preventivo IoT
            </p>

            <div className="border-t border-cold-divider/10 pt-2.5">
              <span className="font-heading font-semibold text-xs text-cold-text block">
                UTN - Facultad Regional Tucumán
              </span>
              <span className="text-[11px] text-cold-lavender block mt-0.5">
                TFI · Administración de Recursos · Grupo N° 18
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-cold-divider/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-cold-muted">
          <div>
            <span>© 2026 ColdTrack · Desarrollado por </span>
            <span className="text-cold-text font-medium">TucSoft</span>
            <span>.</span>
          </div>

          <div className="font-mono text-cold-lavender">
            UTN - FRT · Grupo N° 18
          </div>
        </div>
      </div>
    </footer>
  )
}
