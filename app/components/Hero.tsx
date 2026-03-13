export function Hero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-grain px-6 py-10 shadow-glow sm:px-10 sm:py-14 lg:px-14">
      <div className="grid-fade absolute inset-0 opacity-40" />
      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-mist/80">
            AR.js + Next.js + Tailwind
          </p>
          <h1 className="section-title max-w-4xl text-4xl leading-none text-white sm:text-6xl lg:text-7xl">
            Do estruturalismo ao behaviorismo, agora em realidade aumentada.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-mist/80 sm:text-lg">
            Uma linha do tempo imersiva com cards em estilo carrossel, retratos
            históricos e uma cena AR ancorada em marcador QR-style para explorar
            a virada da psicologia experimental para o estudo do comportamento.
          </p>
        </div>

        <div className="glass-panel rounded-[1.75rem] p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-mist/65">
            Experiência
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm text-mist/70">Camada 1</p>
              <p className="mt-1 text-lg font-semibold text-white">
                Timeline editorial com navegação por época
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm text-mist/70">Camada 2</p>
              <p className="mt-1 text-lg font-semibold text-white">
                Card AR sincronizado com o marco histórico selecionado
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm text-mist/70">Camada 3</p>
              <p className="mt-1 text-lg font-semibold text-white">
                Fontes e imagens reais via Wikipédia em português e Wikimedia Commons
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
