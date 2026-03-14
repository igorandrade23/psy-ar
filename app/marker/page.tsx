export default function MarkerPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="flex max-w-3xl flex-col items-center gap-6">
        <img
          src="/markers/hiro-marker.png"
          alt="Official Hiro marker"
          className="w-full max-w-2xl rounded-2xl border border-black/10 shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
        />
        <p className="max-w-xl text-center text-sm leading-6 text-slate-700">
          Use este marcador em outra tela ou impresso, sem cortar as bordas. O rastreamento
          da experiencia AR atual usa o preset Hiro do AR.js.
        </p>
      </div>
    </main>
  );
}
