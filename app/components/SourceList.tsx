import { TimelineEntry } from "@/app/data/timeline";

type SourceListProps = {
  entries: TimelineEntry[];
};

export function SourceList({ entries }: SourceListProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-mist/60">
            Fontes
          </p>
          <h2 className="section-title mt-2 text-3xl text-white">
            Wikipédia em português e imagens históricas
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-mist/70">
          Os textos do projeto foram redigidos a partir das páginas em português da
          Wikipédia e cada retrato aponta para o arquivo histórico correspondente no
          Wikimedia Commons.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4"
          >
            <p className="text-xs uppercase tracking-[0.26em] text-mist/60">
              {entry.year} · {entry.name}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <a
                href={entry.source}
                target="_blank"
                rel="noreferrer"
                className="block text-white transition hover:text-gold"
              >
                Fonte textual
              </a>
              <a
                href={entry.mediaSource}
                target="_blank"
                rel="noreferrer"
                className="block text-white transition hover:text-gold"
              >
                Fonte da imagem
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
