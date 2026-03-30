const markerUrl = "/markers/hiro-marker.png";

export default function MarkerPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f5f1e7",
        color: "#1c1710"
      }}
    >
      <div
        style={{
          width: "min(100%, 520px)",
          display: "grid",
          gap: "18px",
          textAlign: "center"
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 10px", fontSize: "1.8rem" }}>Marcador Hiro</h1>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            Abra esta tela em outra tela ou imprima a imagem abaixo para testar a experiencia em
            AR.
          </p>
        </div>

        <img
          src={markerUrl}
          alt="Marcador Hiro"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "20px",
            boxShadow: "0 22px 44px rgba(0, 0, 0, 0.18)"
          }}
        />
      </div>
    </main>
  );
}
