import { Star } from "lucide-react";

const reviews = [
  {
    name: "María G.",
    text: "La ruta es clara y fácil de seguir desde el primer día.",
  },
  {
    name: "Carlos R.",
    text: "Me gustó que las lecciones fueran directas y prácticas.",
  },
  {
    name: "Daniela M.",
    text: "Finalmente entendí conceptos que antes parecían complicados.",
  },
  {
    name: "José A.",
    text: "El formato me permitió estudiar sin sentirme abrumado.",
  },
  {
    name: "Andrea L.",
    text: "Todo está organizado paso a paso y en español.",
  },
  {
    name: "Miguel T.",
    text: "Las explicaciones son claras y fáciles de aplicar.",
  },
  {
    name: "Sofía C.",
    text: "Me ayudó a tener una ruta concreta para comenzar.",
  },
  {
    name: "Luis P.",
    text: "Contenido práctico y sin información innecesaria.",
  },
  {
    name: "Valeria N.",
    text: "La plataforma se siente moderna y muy fácil de usar.",
  },
  {
    name: "Javier B.",
    text: "Pude avanzar a mi propio ritmo y guardar mis notas.",
  },
  {
    name: "Camila H.",
    text: "La estructura de las clases mantiene todo muy sencillo.",
  },
  {
    name: "Fernando S.",
    text: "Una buena introducción para comenzar desde cero.",
  },
  {
    name: "Paola V.",
    text: "Me gusta poder regresar exactamente donde me quedé.",
  },
  {
    name: "Ricardo D.",
    text: "Las rutas están bien separadas y son fáciles de entender.",
  },
  {
    name: "Natalia F.",
    text: "Todo se siente profesional y enfocado en la ejecución.",
  },
  {
    name: "Alejandro C.",
    text: "La información está presentada de una manera muy accesible.",
  },
  {
    name: "Gabriela J.",
    text: "Me ayudó a dejar de consumir contenido sin una dirección.",
  },
  {
    name: "Mateo E.",
    text: "El seguimiento de progreso hace que sea fácil continuar.",
  },
  {
    name: "Isabella R.",
    text: "Las lecciones cortas hacen que estudiar sea más manejable.",
  },
  {
    name: "Diego M.",
    text: "Una ruta sencilla para aprender habilidades digitales.",
  },
];

function ReviewCard({ name, text }: { name: string; text: string }) {
  return (
    <article className="w-[310px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-0.5 text-[#79a98e]">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={15} fill="currentColor" strokeWidth={1.5} />
          ))}
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
          Vista previa
        </span>
      </div>

      <p className="mt-4 min-h-12 text-sm leading-6 text-white/78">“{text}”</p>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <p className="text-sm font-semibold text-white">{name}</p>

        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
          Estudiante
        </p>
      </div>
    </article>
  );
}

export function ReviewMarquee() {
  const repeatedReviews = [...reviews, ...reviews];

  return (
    <section
      aria-label="Opiniones de estudiantes"
      className="overflow-hidden border-y border-white/10 bg-[#101311] py-11 text-white"
    >
      <div className="container-shell mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#79a98e]">
            Opiniones de estudiantes
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
            Una experiencia creada para avanzar.
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-0.5 text-[#79a98e]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={17}
                fill="currentColor"
                strokeWidth={1.5}
              />
            ))}
          </div>

          <span className="text-sm font-semibold text-white/75">
            Estilo Trustpilot
          </span>
        </div>
      </div>

      <div className="review-marquee-mask">
        <div className="review-marquee-track flex w-max gap-5 px-5">
          {repeatedReviews.map((review, index) => (
            <ReviewCard
              key={`${review.name}-${index}`}
              name={review.name}
              text={review.text}
            />
          ))}
        </div>
      </div>

      <p className="container-shell mt-7 text-center text-[10px] leading-5 text-white/35">
        Contenido visual de demostración. Publica únicamente opiniones reales y
        verificables de tus estudiantes.
      </p>
    </section>
  );
}
