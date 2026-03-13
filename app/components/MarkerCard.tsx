export function MarkerCard() {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-panel rounded-[2rem] p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-mist/60">
          Marcador
        </p>
        <h2 className="section-title mt-3 text-3xl text-white">
          QR-style com centro AR.js
        </h2>
        <p className="mt-4 text-sm leading-7 text-mist/80">
          O layout do marcador foi desenhado para parecer um QR moderno, mas o
          rastreamento em AR usa o padrão central Hiro, compatível de forma direta com
          o AR.js. A ideia segue a abordagem de combinar marcador AR com linguagem
          visual de QR code.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/markers/qr-hiro-marker.svg"
            download
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
          >
            Baixar marcador SVG
          </a>
          <a
            href="https://ar-js-org.github.io/AR.js-Docs/marker-based/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-white transition hover:bg-white/5"
          >
            Referência do AR.js
          </a>
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] p-4 sm:p-6">
        <div className="rounded-[1.8rem] border border-white/10 bg-white p-4">
          <img
            src="/markers/qr-hiro-marker.svg"
            alt="Marcador QR-style com centro Hiro"
            className="mx-auto aspect-square w-full max-w-[32rem]"
          />
        </div>
      </div>
    </section>
  );
}
